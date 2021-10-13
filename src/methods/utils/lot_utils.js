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
import { getProcessStations, handleMergeExpression, findProcessStartNodes } from './processes_utils'
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
    if(!!bins && !!bins[binId]){
        return  Object.values(bins[binId]).reduce((pv, cv) => pv + cv, 0);
    }
    else return 0
}

export const getBinCount = ({ bins }, binId) => {

    if (!!bins && !!bins[binId]) {
        return bins[binId]?.count || 0;
    } else {
        return 0
    }

}

// If the count doesnt exist things break. This allows us to avoid that error
export const safelyDeconstructBin = (bins, binId) => {
    const test = {count: 2}
    const { count, ...b} = test
    console.log("A", count, b)


    if(!!bins && !!bins[binId] && ('count' in bins[binId])){
        const { count, ...partials } = bins[binId]
        console.log(bins[binId], count, partials)
      return {count, ...partials}
    }
    else return {count: 0}
}

export const getIsCardAtBin = ({ bins }, binId) => {
    return getBinQuantity({ bins }, binId) > 0
}

export const getCardsInBin = (cards, binId, processId) => {
    return Object.values(cards).filter((card, ind) => {
        return getIsCardAtBin(card, binId) && (!processId || card.process_id === processId)
    })
}

export const getAllTemplateFields = () => {
    const lotTemplates = store.getState().lotTemplatesReducer.lotTemplates || {}

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
    const lotTemplate = lotTemplates[lotTemplateId] || {}
    const stationBasedLots = store.getState().settingsReducer.settings.stationBasedLots || false
    const dashboards = store.getState().dashboardsReducer.dashboards || {}
    const currentDashboard = dashboards[dashboardID]

    let customFieldValues = []

    const { syncWithTemplate } = lot || {}

    // if sync with template, use fields from template. Otherwise use fields from lot
    const fields = syncWithTemplate ? (lotTemplate.fields) : (lot?.fields || lotTemplate.fields)
    if(!!stationBasedLots && !!currentDashboard && !!currentDashboard.fields){
      Object.keys(currentDashboard.fields).forEach((template) =>{
          Object.values(currentDashboard.fields[template]).forEach((field) =>{
            const {
              fieldName,
              dataType,
              _id
            } = field
            if(lot.lotTemplateId===template){
              customFieldValues.push({
                dataType,
                fieldName,
                value: getLotField('_id', _id, lot)?.value
                })
            }
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
export const handleMergedLotQuantity = (iDs, mergingRoutes, currentLot, destinationId, quantity, stationID) => {

  let countQuantity = currentLot.totalQuantity //Initialize count at totalquantity
  let completeParts = currentLot.totalQuantity
  let totalCompleteParts = 0
  let bestQty = 0
  let traveledRouteId = ""
  let existingPartQty = 0;

  for(const ind in iDs){
    let option = iDs[ind]
    for(const requirement in option){
       for(const idx in mergingRoutes){
        traveledRouteId = mergingRoutes[idx]._id
        existingPartQty = !!currentLot.bins[destinationId] && !!currentLot.bins[destinationId][traveledRouteId] ? currentLot.bins[destinationId][traveledRouteId] :  0

         if(mergingRoutes[idx].load === option[requirement] && option.includes(stationID)){
              countQuantity = existingPartQty<countQuantity ? option.length ===1 ? existingPartQty : existingPartQty :  countQuantity
              completeParts = 0
          }

          if(mergingRoutes[idx].load === option[requirement] && !option.includes(stationID)){
               completeParts = existingPartQty<completeParts ? existingPartQty : completeParts
           }
        }
       }
       if(option.includes(stationID)){
         if(countQuantity>bestQty) bestQty = countQuantity
       }
        totalCompleteParts += completeParts
        completeParts = currentLot.totalQuantity
     }

     return totalCompleteParts

}

/** Davis
 * Given the bin at a destination, this function determines the ~actual~ quantity of parts at the station based on the expression
 * that describes the required inputs (based on splits and merges).
 *
 * @param {object} bins The current bins
 * @param {array} mergeExpression This is the expression output from the handleMergeExpression function from process_utils. It
 * contains the "AND" "OR" boolean expressions that describe the required input routes to count as a part
 */
export const handleMergedLotBin = (bin, mergeExpression, station, routeId, count) => {
    const recursiveConditionalQuantities = (subExpression) => {
        // Since the expression can have nested elements, this function needs to be recursive
        let splitToChoice = false
        if (Array.isArray(subExpression)) {
            let precursor = subExpression[0]

            //Check for splitToChoice case
            if(precursor === 'AND'){
              for(let i = 1; i<Object.values(subExpression).length; i++){
                if(subExpression[i][0] === 'OR') splitToChoice = true
              }
            }

            if(!!splitToChoice){
              let pathArray = handleGenerateSplitChoiceArray(subExpression)
              const [containedInCombo, bestComboCount] = handleGetOptimalCombo(pathArray, bin, routeId, count)
              return bestComboCount

            }
            else{
              if (subExpression[0] === 'AND') {
                  let count = Math.max(...Object.values(bin));
                  for (var i=1; i<subExpression.length; i++) {
                      // If its an AND, its the minimum of all the quantities of the incoming routes
                      if(!!subExpression[i]){
                        count = Math.min(count, recursiveConditionalQuantities(subExpression[i]));
                      }
                  }
                  return count
              } else if (subExpression[0] === 'OR') {
                  let count = 0
                  for (var i=1; i<subExpression.length; i++) {
                      // If its an OR, we actually want the SUM of all the quantities of the station options
                      count += recursiveConditionalQuantities(subExpression[i])
                  }
                  return count
              }
            }

        } else {
            return subExpression in bin ? bin[subExpression] : 0;
        }

    }
    return {
        ...bin,
        count: recursiveConditionalQuantities(mergeExpression)
    }

}

/**This function handles the case of split followed by choice.
This case is unusual as different combinations can be used to create an available qty
The function creates an array of all possible merge combinations that will create a fully merged part in the [AND, A, [OR,B,C]] subexpression.
Note, this is the simplest case with only 2 possible combinations of 2 paths (2x2 array). if subExpression was [AND, [OR,A,B], [OR,C,D,E]]
a list of all combinations should be AC, AD, AE, BC, BD, BE.

*/

export const handleGenerateSplitChoiceArray = (row) => {
  let subArray = []
  let existingArrLength = 0
  let rowLength = 0
  let index = 0


  for(let i = 1; i<Object.values(row).length; i++){

    let subArrayCopy = []//Need a copy so you can reference these values when duplicating array.
    for (const index in subArray){
      subArrayCopy.push([])
      for(const idx in subArray[index]){
        subArrayCopy[index].push(subArray[index][idx])
      }
    }

    existingArrLength = Object.values(subArray).length
    rowLength = Object.values(row[i]).length
    if(rowLength === 36){ //if element in the subexpression is just single ID
        if(existingArrLength === 0){
          subArray.push([])
          subArray[0].push(row[i][0])
        }
        else{
          for(const ind in subArray){
            subArray[ind].push(row[i])
          }
        }
      }

    else{
      if(row[i][0] === "OR"){//if one element in the subexpression is an OR array
          if(existingArrLength === 0){//If no array, push options, creating new row for each ID
            for(let j = 1; j<rowLength; j++){
              subArray.push([])
              subArray[j-1].push(row[i][j])
            }
          }
          else{
            for(let j = 1; j<rowLength; j++){//if array exists push options into array
              for(let k = 0; k<existingArrLength; k++){//you need to duplicate rows for each option. eg.  A and [B or C] would need to duplicate A twice when pushing options B,C to get [A,B],[A,C]
                let ind = k+existingArrLength*(j-1)
                if(j>1){//If on second or higher option always need to duplicate existing rows
                  subArray.push([])
                  for(let p = 0; p < Object.keys(subArrayCopy[k]).length; p++) {
                    subArray[ind].push(subArrayCopy[k][p])
                  }
                    subArray[ind].push(row[i][j])
                }
                else{//if on first option just push to existing row
                  subArray[k].push(row[i][j])
                }
              }
            }
          }
        }

      else if(row[i][0] === "AND"){ //if one of the elements in subexpression is an AND array
          if(existingArrLength === 0){//If array doesnt exist just push AND options
            for(let m=1; m<rowLength; m++){
              if(m===1) subArray.push([])
              subArray[0].push(row[i][m])
            }
          }
          else{//Else need to go through each row in array and add AND option to the end
            for(let m=1; m<rowLength; m++){
              for(let n = 0; n<existingArrLength; n++) subArray[n].push(row[i][m])
            }
          }
        }
      }
    }
    return subArray
}


/**This function uses the handleGenerateSplitChoiceArray's array and goes through each option
to see if the parts are available in that combination to make a merged part. If it is possible
to make 1 or more merged parts from this array row, remove the parts and add to completed count
*/
export const handleGetOptimalCombo = (iDs, bin, routeId, count) => {

  let comboCount = count
  let containedInCombo = false
  let optimalCombo = []


  for(const i in iDs[1]){
    let combo = iDs[1][i]
    comboCount = count
    for(const j in combo){
      let partId = combo[j]
      if(!!partId && !!bin[partId]){
        if(bin[partId] < comboCount) comboCount = bin[partId]
      }
      else {
        comboCount = 0
      }
    }


    if(comboCount>0){//Greater than 0, consume the parts, add to count
      for(const k in combo){
        bin[combo[k]]-=comboCount
        }
        bin['count']+=comboCount
      }
    }

    return bin
}

/**This gets the overall array for all ways to create a completed parts
  it can include the handleGenerateSplitChoiceArray if the AND->OR case comes up
  there is still some work to fully integrate AND->OR part in really complex cases
  eg. [AND, OR[A,B], AND[C,[OR,D,OR[E,F]]]] wont work. Anything with less than
  6 routes coming into a station will work.
*/

export const handleGetPathArray = (station, process) => {
  const processes = store.getState().processesReducer.processes || {}
  const routes = store.getState().tasksReducer.tasks || {}
  const stations = store.getState().stationsReducer.stations || {}

  let iDs = []
  let option = 0
  let requirement = 0
  let startOption = 0
  let splitToChoice = false
  let involveSplitChoice = false

  let precursor = ''
  iDs.push([])

  const recursiveParse = (row) => {
      let splitMergeInd = 0
      let splitToChoice = false
      if(Array.isArray(row)){
        let precursor = row[0]

        //Check for splitToChoice case
        if(precursor === 'AND'){
          for(let i = 1; i<Object.values(row).length; i++){
            if(!!row[i] && row[i][0] === 'OR') {
              splitToChoice = true
              involveSplitChoice = true
              startOption = option
            }
          }
        }
        if(!splitToChoice){
          for(let i = 1; i<Object.values(row).length; i++){
            if(Array.isArray(row[i])){
              if(row[0] === 'OR'){
                option+=1
                iDs.push([])
              }
              recursiveParse(row[i])
            }
            else{
              if(precursor === 'OR'){
                involveSplitChoice = false
                iDs[option].push(row[i])
                option+=1
                iDs.push([])

              }
              else if(precursor === 'AND'){
                if(!!involveSplitChoice){
                  for(let a = startOption; a<option; a++){
                    iDs[a].push(row[i])
                  }
                }
                else{
                  iDs[option].push(row[i])
                }
              }
            }
          }
        }
        else {
          let pathArray = handleGenerateSplitChoiceArray(row)
          for(const i in pathArray){
            for(const j in pathArray[i]){
              iDs[option].push(pathArray[i][j])
            }
            option+=1
            iDs.push([])
          }
        }
      }
    }

    recursiveParse(handleMergeExpression(station, process, routes, stations))
    //console.log(handleMergeExpression(station, process, routes, stations))
    return iDs
}

/**This merges handles merging parts. It takes the array of all options and consumes parts that will merge to full part */
export const handleMergeParts = (bin, routeId, count, station, process) => {
  const processes = store.getState().processesReducer.processes || {}
  const routes = store.getState().tasksReducer.tasks || {}

  let iDs = handleGetPathArray(station, process, routes)
  //Determine count for that path
  for(const ind in iDs){//Go through all options
    let minCount = count
    if(Object.values(iDs[ind]).length>0){
      for(const idx in iDs[ind]){
          let prt = iDs[ind][idx]
          if(!!prt && !!bin[prt]){
            if(bin[prt]<minCount) minCount = bin[prt]
          }
          else minCount = 0
      }
      if(minCount>0){
        for(const idx in iDs[ind]){
            let id = iDs[ind][idx]
            if(!!bin[id] && bin[id]-minCount === 0) delete bin[id]
            else bin[id]-=minCount
          }
          bin['count'] += minCount
        }
      }
    }
    return bin
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

}

  //This function determines if multiple routes are merging into a station and handles the lot quantity available to move accordingly
  //If multiple routes merge into a station the parts at the station are kept track of at that bin
  //If one type of part doesn't exist yet none of that lot can be moved along
  //Otherwise, assuming 1 to 1 ratio the type of part with lowest count limits the amount of the lot that is available to move
export const handleNextStationBins = (bins, quantity, loadStationId, unloadStationId, process, routes, stations) => {

    const processRoutes = process.routes.map((routeId) => routes[routeId]);
    let unloadStations = processRoutes.map((route) =>
        !!route ? route.unload : {}
    );

    const mergingRoutes = process.routes
      .map((routeId) => routes[routeId])
      .filter((route) => route.unload === unloadStationId && (stations[route.load]?.type !=='warehouse' || unloadStations.includes(route.load)));

    if (mergingRoutes.length > 1) {
      //If multiple routes merge into station, keep track of parts at the station

      let mergingExpression = handleMergeExpression(
        unloadStationId,
        process,
        routes,
        stations
      );

      let tempBin,
        currentBin = bins[unloadStationId];
      let traveledRoute = mergingRoutes.find((route) => route.load === loadStationId);
      if (!!currentBin) {
        // The Bin for the destination already exists, update quantities

        let existingQuantity = !!currentBin[traveledRoute._id]


          ? currentBin[traveledRoute._id]
          : 0;
        tempBin = {
          ...bins[unloadStationId],
          [traveledRoute._id]: (existingQuantity += quantity),
        };


        bins[unloadStationId] = handleMergeParts(
          tempBin,
          traveledRoute._id,
          99999999,
          unloadStationId,
          process
        );
      } else {
        // The Bin for the destination does not exist, create is here

        tempBin = {
          [traveledRoute._id]: quantity,
          count: 0
        };

        bins[unloadStationId] = handleMergeParts(
          tempBin,
          traveledRoute._id,
          99999999,
          unloadStationId,
          process
        );
      }
    } else {
      // Only one route enters station, don't worry about tracking parts at the station
      let totalQuantity = !!bins[unloadStationId]?.count
        ? bins[unloadStationId].count + quantity
        : quantity;
      bins[unloadStationId] = {
        count: totalQuantity,
      };
    }

    return bins;
  };


export const handleCurrentStationBins = (bins, quantity, loadStationId, process, routes) => {//Since parts are now consumed, only reduce count. dont need to touch parts.
    if(quantity === bins[loadStationId]['count']) {
      delete bins[loadStationId]['count'];
    } else {
      bins[loadStationId]['count'] -= quantity;
    }
    if(bins[loadStationId]['count'] === 0 && Object.keys(bins[loadStationId]).length === 1) delete bins[loadStationId]
    return bins;
  };
