import { isObject } from "./object_utils";
import {useParams} from 'react-router-dom'
import {
    BASIC_LOT_TEMPLATE,
    BASIC_LOT_TEMPLATE_ID, BIN_IDS,
    FIELD_DATA_TYPES,
    LOT_FILTER_OPTIONS
} from "../../constants/lot_contants";
import store from '../../redux/store/index'
import lotTemplatesReducer from "../../redux/reducers/lot_templates_reducer";
import { toIntegerOrZero } from "./number_utils";
import { useSelector } from "react-redux";
import { FILTER_DATE_OPTIONS } from "../../components/basic/advanced_calendar_placeholder_button/advanced_calendar_placeholder_button";

// Import external utils
import { immutableDelete, immutableReplace, isArray, isNonEmptyArray } from "./array_utils";
import { capitalizeFirstLetter, isEqualCI, isString } from "./string_utils";
import { getProcessStations } from './processes_utils'
import { getLoadStationId } from './route_utils'
import { jsDateToString } from './card_utils'


export const getDisplayName = (lotTemplate, fieldName, fallback) => {
    let returnVal
    if (isObject(lotTemplate?.displayNames) && lotTemplate.displayNames[fieldName]) {
        returnVal = lotTemplate.displayNames[fieldName]
    }

    return isString(returnVal) ? returnVal : fallback ? fallback : ""
}

export const getBinName = (binId) => {
    const stations = store.getState().stationsReducer.stations || {}

    if (binId === BIN_IDS.QUEUE) {
        return "Queue"
    }
    else if (binId === BIN_IDS.FINISH) {
        return "Finish"
    }
    else {
        const station = stations[binId] || {}
        const {
            name = ""
        } = station

        return name
    }
}

export const testFilterOption = (filterOptions, filterValue, testValue) => {
    if (!isNonEmptyArray(filterOptions)) return true

    for (const currOption of (filterOptions || [])) {
        if (currOption === FILTER_DATE_OPTIONS.EQUAL) {
            if (testValue && testValue.toDateString() === filterValue.toDateString()) {
                return true
            }
        }
        else if (currOption === FILTER_DATE_OPTIONS.LESS_THAN) {
            if (testValue - filterValue < 0) return true
        }
        else if (currOption === FILTER_DATE_OPTIONS.GREATER_THAN) {
            if (testValue - filterValue > 0) return true
        }
    }

    return false
}

export const stringifyFilter = (filter) => {
    let fieldStr = filter.label;
    let operatorStr = filter.operator;
    let optionsStr;
    switch (filter.dataType) {
        case 'STRING':
            optionsStr = "'" + filter.options.text + "'";
            break;
        case 'INTEGER':
            optionsStr = filter.options.num;
            break;
        case 'PROCESSES':
            fieldStr = 'Process' // Special case (since we actually use IDs)
            optionsStr = filter.options.processes.map(p => p.name).join(' | ')
            break;
        case 'FLAGS':
            optionsStr = '...'
            break;
        case 'DATE':
        case 'DATE_RANGE':
            if (filter.options.isRelative) {
                optionsStr = 'today' + (filter.options.relativeDays < 0 ? '' : '+') + filter.options.relativeDays
            } else {
                optionsStr = jsDateToString(filter.options.date)
            }
            break;
        default:
            optionsStr = '?'
            break;
    }

    return fieldStr + ' ' + operatorStr + ' ' + optionsStr;
}

const COMPARITOR_FUNCTIONS = {
    '<': (a, b) => a < b,
    '<=': (a, b) => a <= b,
    '=': (a, b) => a === b,
    '>=': (a, b) => a >= b,
    '>': (a, b) => a > b
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export const checkCardMatchesFilter = (lot, filter) => {

    const {
        fieldName,
        dataType,
        operator,
        options
    } = filter;

    // Primarily filters if the key exists in the lot
    const lotFields = {}
    lot.fields.forEach(fieldArr => fieldArr.forEach(field => lotFields[field.fieldName] = field));
    if (lot[fieldName] == null && (lotFields[fieldName] == null ||
            (lotFields[fieldName].dataType === 'DATE_RANGE' && lotFields[fieldName].value[0] == null || lotFields[fieldName].value[1] == null)))
    //if (lot[fieldName] == null && (lotFields[fieldName] == null || lotFields[fieldName].value == null ||
      //      (lotFields[fieldName].dataType === 'DATE_RANGE' && Array.isArray(lotFields[fieldName].value) && (lotFields[fieldName].value.length < 2 || lotFields[fieldName].value[0] == null || lotFields[fieldName].value[1] == null))))
        { return false; }

    switch (fieldName) {

        case 'name':
            return lot.name.toLowerCase().includes(options.text.toLowerCase())
        case 'flags':
            switch (operator) {
                case 'all':
                    return options.flags.every(filterFlagId => lot[fieldName].includes(filterFlagId))
                case 'any':
                    return options.flags.some(filterFlagId => lot[fieldName].includes(filterFlagId))
                case 'not_all':
                    return !options.flags.every(filterFlagId => lot[fieldName].includes(filterFlagId))
                case 'not_any':
                    return !options.flags.some(filterFlagId => lot[fieldName].includes(filterFlagId))
            }
        case 'process_id':
            return options.processes.map(p => p._id).includes(lot[fieldName])
        case 'lotNumber':
            return COMPARITOR_FUNCTIONS[operator](lot[fieldName], options.num)
        case 'quantity':
            return COMPARITOR_FUNCTIONS[operator](lot.quantity, options.num)
        case 'totalQuantity':
            return COMPARITOR_FUNCTIONS[operator](lot.totalQuantity, options.num)
        default: // Any other fields
            switch (dataType) {
                case 'STRING':
                    return lotFields[fieldName].value.toLowerCase().includes(options.text.toLowerCase())
                case 'INTEGER':
                    return COMPARITOR_FUNCTIONS[operator](lotFields[fieldName].value, options.num)
                case 'DATE':
                    if (options.isRelative) {
                        let compareDate = new Date;
                        return COMPARITOR_FUNCTIONS[operator](new Date(lotFields[fieldName].value), compareDate.addDays(options.relativeDays))
                    } else {
                        return COMPARITOR_FUNCTIONS[operator](new Date(lotFields[fieldName].value), new Date(options.date))
                    }
                case 'DATE_RANGE':
                    console.log(lotFields[fieldName].value)
                    if (options.isRelative) {
                        let compareDate = new Date;
                        return COMPARITOR_FUNCTIONS[operator](new Date(lotFields[fieldName].value[filter.index]), compareDate.addDays(options.relativeDays))
                    } else {
                        return COMPARITOR_FUNCTIONS[operator](new Date(lotFields[fieldName].value[filter.index]), new Date(options.date))
                    }

            }
    }


}

export const getMatchesFilter = (lot, filterValue, filterMode) => {
    const {
        dataType: filterDataType,							// eg. "STRING"
        label,								// eg. "Dates (start)"
        _id: fieldId,
        fieldName: filterFieldName,							// eg. "dates"
        lotTemplateId: filterTemplateId, 	// eg. 123
    } = filterMode || {}

    const {
        lotTemplateId,
        [filterFieldName]: fieldValue
    } = lot || {}

    // first filter known/required fields
    switch (filterMode.label) {

        // name (string)
        case LOT_FILTER_OPTIONS.name.label: {
            if (filterValue) {
                return lot.name.toLowerCase().includes((filterValue || "").toLowerCase())
            }
            return true
            break
        }

        //  lot number (treated as string when formatted)
        case LOT_FILTER_OPTIONS.lotNumber.label: {
            if (filterValue) {
                const formattedLotNumber = formatLotNumber(lot.lotNumber)
                return formattedLotNumber.toLowerCase().includes((filterValue || "").toLowerCase())
            }
            return true
            break
        }

        // flags (array of ints)
        case LOT_FILTER_OPTIONS.flags.label: {
            if (isArray(filterValue) && filterValue.length > 0) {
                if (isArray(lot.flags)) {
                    for (const filterFlag of filterValue) {
                        const {
                            id: currFilterId
                        } = filterFlag

                        if (!lot.flags.includes(currFilterId)) return false
                    }
                    return true
                }
                return false
            }
            return true
            break
        }

        // now must filter by data type
        default: {
            if (isObject(filterMode)) {

                let fieldInLot = false
                let fieldValue = null

                const lotField = getLotField("fieldName", filterFieldName, lot)
                if (lotField) {
                    fieldInLot = true
                    fieldValue = lotField.value
                }

                if (fieldInLot || lotTemplateId === filterTemplateId) {
                    if (!filterValue) return true

                    switch (filterDataType) {
                        case FIELD_DATA_TYPES.URL: {
                            // not implemented yet
                            return true
                        }
                        case FIELD_DATA_TYPES.EMAIL: {
                            // not implemented yet
                            return true
                        }
                        case FIELD_DATA_TYPES.DATE: {
                            const {
                                value,
                                options: filterOptions
                            } = filterValue || {}

                            if (value) {
                                return testFilterOption(filterOptions, value, fieldValue ? new Date(fieldValue) : null)
                            }

                            // if no filter value, default true
                            else {
                                return true
                            }
                        }
                        case FIELD_DATA_TYPES.DATE_RANGE: {
                            let matchesFilter = false

                            if ((isNonEmptyArray(filterValue) && filterValue.length > 0)) {
                                // extract first filter properties
                                const {
                                    value: filterValue1,
                                    options: filterOptions1
                                } = filterValue[0] || {}

                                // extract second filter properties
                                const {
                                    value: filterValue2,
                                    options: filterOptions2
                                } = filterValue[1] || {}

                                if (isNonEmptyArray(fieldValue) && fieldValue.length > 0) {

                                    // check first filter
                                    if (filterValue1) {
                                        // check if fieldValue matches filter value
                                        matchesFilter = testFilterOption(filterOptions1, filterValue1, new Date(fieldValue[0]))
                                    }
                                    else {
                                        // no filter value, so default to match
                                        matchesFilter = true
                                    }

                                    // check second filter
                                    if (filterValue2) {
                                        matchesFilter = (testFilterOption(filterOptions2, filterValue2, new Date(fieldValue[1]))) && matchesFilter // && since both filters must match
                                    }
                                    else {
                                        matchesFilter = true && matchesFilter // && since both filters must match
                                    }

                                    // matches?
                                    return matchesFilter
                                }

                                // there is filter value, but no field value.
                                else {
                                    return false
                                }
                            }

                            // no filter value, default matches to true
                            return true
                        }

                        case FIELD_DATA_TYPES.STRING: {
                            // simple string compare, make lowercase for case insensitive
                            return fieldValue.toLowerCase().includes((filterValue || "").toLowerCase())
                        }

                        case FIELD_DATA_TYPES.INTEGER: {
                            // simple ===, but also make sure they're ints
                            return toIntegerOrZero(fieldValue) === toIntegerOrZero(filterValue)
                        }
                        default: {
                            // unknown dateType, return true
                            return true
                        }
                    }
                }
                else {
                    return false
                }
            }
            else {
                // no filter mode selected, return true
                return true
            }
        }
    }
}

export const getLotField = (searchKey, searchValue, lot) => {
    for (const field of lot.fields.flat()) {
        const {
            [searchKey]: currValue
        } = field || {}

        if (currValue === searchValue) {
            return field
        }
    }

    return null
}

export const formatLotNumber = (lotNumber) => {
    return (isString(lotNumber) || Number.isInteger(lotNumber)) ?
        `RM-${parseInt(lotNumber).toLocaleString('en-US', { minimumIntegerDigits: 6, useGrouping: false })}`
        :
        ``
}

export const getLotTotalQuantity = (card) => {

      return card.totalQuantity

}

export const getBinQuantity = ({ bins }, binId) => {
    if(!!bins){
      return bins[binId]?.count || 0
    }
    else return 0
}

export const getIsCardAtBin = ({ bins }, binId) => {
  if(!!bins){
    for(const i in bins[binId]){
      if(!!bins[binId][i] && i!== 'count') return true
    }
  }
    return !!getBinQuantity({ bins }, binId)
}

export const getCardsInBin = (cards, binId, processId) => {
    return Object.values(cards).filter((card, ind) => {
        return getIsCardAtBin(card, binId) && (!processId || card.process_id === processId)
    })
}

export const getAllTemplateFields = () => {
    const lotTemplates = {
        [BASIC_LOT_TEMPLATE_ID]: { ...BASIC_LOT_TEMPLATE },
        ...(store.getState().lotTemplatesReducer.lotTemplates || {})
    }

    let templateFields = []

    Object.values(lotTemplates).forEach((currLotTemplate) => {
        const {
            fields,
            _id: lotTemplateId
        } = currLotTemplate || {}

        fields.forEach((currRow) => {
            currRow.forEach((currField) => {

                const {
                    component,		//"CALENDAR_START_END"
                    dataType,		//"DATE_RANGE"
                    fieldName,		//"dates"
                    key,			//1
                    _id,			//1
                } = currField || {}

                const item = {
                    // label: `${capitalizeFirstLetter(fieldName)} (${convertDataTypeContantToDisplay(dataType)})`,
                    label: fieldName,
                    dataType,
                    component,
                    fieldName,
                    lotTemplateId,
                    _id
                }

                let alreadyExists = false
                templateFields.forEach((currTemplateField) => {
                    const {
                        label: currExistingLabel,
                        dataType: currExistingDataType,
                        component: currExistingComponent
                    } = currTemplateField || {}

                    if ((isEqualCI(item.label, currExistingLabel)) && (item.dataType === currExistingDataType)) {
                        alreadyExists = true
                    }
                })

                if (!alreadyExists) {
                    templateFields.push(item)
                }
            })
        })
    })

    return templateFields
}

/*
* Returns array of lots custom fields
* Each field field includes dataType, fieldName, and value
* */
export const getCustomFields = (lotTemplateId, lot, dashboardID, includeNonPreview) => {
    const lotTemplates = store.getState().lotTemplatesReducer.lotTemplates || {}
    const lotTemplate = lotTemplateId === BASIC_LOT_TEMPLATE_ID ? BASIC_LOT_TEMPLATE : (lotTemplates[lotTemplateId] || {})
    const stationBasedLots = store.getState().settingsReducer.settings.stationBasedLots || false
    const dashboards = store.getState().dashboardsReducer.dashboards || {}
    const currentDashboard = dashboards[dashboardID]

    let customFieldValues = []

    const { syncWithTemplate } = lot || {}

    // if sync with template, use fields from template. Otherwise use fields from lot
    const fields = syncWithTemplate ? (lotTemplate.fields) : (lot?.fields || lotTemplate.fields)

    if(!!stationBasedLots && !!currentDashboard && !!currentDashboard.fields){
      Object.values(currentDashboard.fields).forEach((field) =>{

        const {
          fieldName,
          dataType,
          _id
        } = field

        customFieldValues.push({
          dataType,
          fieldName,
          value: getLotField('_id', _id, lot)?.value
          })
        })
      }
      else{
        // loop through fields and get relevant data
        if (isArray(fields)) {
            fields.flat().forEach((currField) => {
                const {
                    dataType,
                    fieldName,
                    showInPreview,
                    _id
                } = currField

                  // if includeNonPreview, add all.
                  // otherwise, only add if lot has showInPreview set to true
                  if (includeNonPreview || (!includeNonPreview && showInPreview)) {
                      customFieldValues.push({
                          dataType,
                          fieldName,
                          value: syncWithTemplate ? getLotField("_id", _id, lot)?.value : currField?.value,
                      })
                  }
            })
        }
      }

    return customFieldValues
}

export const getLotAfterBinMerge = (lotToMove, currentBinId, destinationBinId) => {
    const {
        bins: oldBins,
        ...unchangedLotAttributes
    } = lotToMove || {}

    const {
        [currentBinId]: movedBin,
        [destinationBinId]: destinationBin,
        ...unchangedBins
    } = oldBins || {}

    if (movedBin) {
        // already contains items in destinationBin
        if (destinationBin && movedBin) {
            const oldCount = parseInt(destinationBin?.count || 0)
            const movedCount = parseInt(movedBin?.count || 0)

            return {
                ...unchangedLotAttributes,
                bins: {
                    ...unchangedBins,
                    [destinationBinId]: {
                        ...destinationBin,
                        count: oldCount + movedCount
                    }
                }

            }
        }

        // no items in bin
        else {
            return {
                ...unchangedLotAttributes,
                bins: {
                    ...unchangedBins,
                    [destinationBinId]: {
                        ...movedBin,
                    }
                }
            }
        }
    }
}


export const getCurrentRouteForLot = (lot, stationID) => {
    let currentRoute

    const processes = store.getState().processesReducer.processes || {}
    const routes = store.getState().tasksReducer.tasks || {}

    const lotProcess = processes[lot.process_id]

    for (let i = 0; i < lotProcess.routes.length; i++) {
        const loadStation = routes[lotProcess.routes[i]].load.station
        if (loadStation === stationID) {
            currentRoute = routes[lotProcess.routes[i]]
            break
        }
    }
    return currentRoute
}

export const getPreviousRouteForLot = (lot, stationID) => {
    let prevRoute

    const processes = store.getState().processesReducer.processes || {}
    const routes = store.getState().tasksReducer.tasks || {}

    const lotProcess = processes[lot.process_id]

    for (let i = 0; i < lotProcess.routes.length; i++) {
        const loadStation = routes[lotProcess.routes[i]].load.station
        const unloadStation = routes[lotProcess.routes[i]].unload.station
        if (loadStation === stationID) {
            prevRoute = routes[lotProcess.routes[i - 1]]
            break
        } else if (unloadStation === stationID) {
            prevRoute = routes[lotProcess.routes[i]]
            break
        }
    }
    return prevRoute
}


export const moveLot = (lot, destinationBinId, startBinId, quantity) => {

    let updatedLot = { ...lot }

    const oldBins = lot.bins ? lot.bins : {}

    const {
        [startBinId]: startBin,
        [destinationBinId]: destinationBin,
        ...remainingOldBins
    } = oldBins || {}

    if (startBin) {
        // handle updating lot
        {
            const destinationBinQuantity = parseInt(destinationBin?.count || 0)
            const startBinQuantity = parseInt(startBin?.count || 0)

            if (quantity > startBinQuantity) return false

            updatedLot = {
                ...updatedLot,
                bins: {
                    ...remainingOldBins,
                    [startBinId]: {
                        ...startBin,
                        count: startBinQuantity - quantity
                    },
                    [destinationBinId]: {
                        ...destinationBin,
                        count: destinationBinQuantity + quantity
                    }
                }
            }
        }
    }

    return updatedLot
    // }
}
