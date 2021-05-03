import { isObject } from "./object_utils";
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

export const getMatchesFilter = (lot, filterValue, filterMode) => {
    const {
        dataType,							// eg. "STRING"
        label,								// eg. "Dates (start)"
        fieldName,							// eg. "dates"
        lotTemplateId: filterTemplateId 	// eg. 123
    } = filterMode || {}

    const {
        lotTemplateId,
        [fieldName]: fieldValue
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

                if (fieldName in lot || lotTemplateId === filterTemplateId) {
                    if (!filterValue) return true

                    switch (dataType) {
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
                                        matchesFilter = (testFilterOption(filterOptions2, filterValue2, new Date(lot[fieldName][1]))) && matchesFilter // && since both filters must match
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
                            return lot[fieldName].toLowerCase().includes((filterValue || "").toLowerCase())
                        }

                        case FIELD_DATA_TYPES.INTEGER: {
                            // simple ===, but also make sure they're ints
                            return toIntegerOrZero(lot[fieldName]) === toIntegerOrZero(filterValue)
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

export const formatLotNumber = (lotNumber) => {
    return (isString(lotNumber) || Number.isInteger(lotNumber)) ?
        `RM-${parseInt(lotNumber).toLocaleString('en-US', { minimumIntegerDigits: 6, useGrouping: false })}`
        :
        ``
}

export const getLotTotalQuantity = ({ bins }) => {
    let totalQuantity = 0

    if (isObject(bins)) {
        Object.values(bins).forEach(currBin => {
            const {
                count
            } = currBin || {}

            totalQuantity = totalQuantity + parseInt(count)
        })
    }

    return totalQuantity
}

export const getBinQuantity = ({ bins }, binId) => {
    const {
        [binId]: currentBin
    } = bins || {}

    const {
        count
    } = currentBin || {}

    return count
}

export const getIsCardAtBin = ({ bins }, binId) => {
    return !!getBinQuantity({ bins }, binId)
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
                    lotTemplateId
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

export const getLotTemplateData = (lotTemplateId, lot) => {
    const lotTemplates = store.getState().lotTemplatesReducer.lotTemplates || {}
    const lotTemplate = lotTemplateId === BASIC_LOT_TEMPLATE_ID ? BASIC_LOT_TEMPLATE : (lotTemplates[lotTemplateId] || {})

    let templateValues = []

    if (isArray(lotTemplate.fields)) {
        lotTemplate.fields.forEach((currRow) => {

            if (isArray(currRow)) {
                currRow.forEach((currItem) => {
                    const {
                        dataType,
                        fieldName
                    } = currItem

                    const lotValue = lot[fieldName]
                    templateValues.push({
                        dataType,
                        fieldName,
                        value: lotValue
                    })
                })
            }

        })
    }

    return templateValues
}

export const convertDataTypeContantToDisplay = (dataTypeContant) => {
    switch (dataTypeContant) {
        case FIELD_DATA_TYPES.INTEGER: {
            return "Number"
        }
        case FIELD_DATA_TYPES.STRING: {
            return "String"
        }
        case FIELD_DATA_TYPES.DATE_RANGE: {
            return "Date range"
        }
        case FIELD_DATA_TYPES.DATE: {
            return "Date"
        }
        case FIELD_DATA_TYPES.EMAIL: {
            return "Email"
        }
        case FIELD_DATA_TYPES.URL: {
            return "Url"
        }
        default: {
            return null
        }
    }
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
    console.log('QQQQ current route', currentRoute)
    return currentRoute
}