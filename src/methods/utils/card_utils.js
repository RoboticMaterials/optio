import {deepCopy} from "./utils";
import {SORT_MODES} from "../../constants/common_contants";
import {isObject} from "./object_utils";
import {isArray, isNonEmptyArray} from "./array_utils";
import {defaultBins, FIELD_COMPONENT_NAMES, FIELD_DATA_TYPES, SORT_DIRECTIONS} from "../../constants/lot_contants";
import {BASIC_FIELD_DEFAULTS} from "../../constants/form_constants";
import {toIntegerOrZero} from "./number_utils";
import {isValidDateString} from "./date_utils";

const EVENT_NAMES = {
	CREATE: "create",
	UPDATE: "update"
}

export const jsDateToObjDate = (jsDate) => {
	if(!jsDate) return null

	let trimmed = new Date(new Date(jsDate).toDateString());

	let month = trimmed.getUTCMonth()
	let day = trimmed.getUTCDate();
	let year = trimmed.getUTCFullYear();

	return {year, month: month + 1, day}
}


export const generateBinId = (index, stationId) => {
	return index + "+" + stationId
}
export const parseMessageFromEvent = (eventName, username, data) => {
	switch(eventName) {

		case EVENT_NAMES.CREATE:
			return [`Created card`]

		case EVENT_NAMES.UPDATE:
			let msgs = []

			const keys = Object.keys(data)
			keys.forEach((currKey) => {
				const {
					new: newVal,
					old: oldVal,
				} = data[currKey]

				if(oldVal) {
					msgs.push(`Changed ${currKey} from "${oldVal}" to "${newVal}"`)
				}
				else {
					msgs.push(`Set ${currKey} to "${newVal}"`)
				}


			})

			// if(msgs.length === 0) msgs.push("No info found")

			return msgs

		default:
			return [`${eventName} performed by ${username}`]
	}
}

/*
* Converts date from a lot into a JS date object
*
* The lot date object contains key, value pairs for year, month, and date
* These values are extracted, and if the values are valid, used to generate a new Date objects
*
* returns a JS Date object if the lot date is valid, and null otherwise
*
* @param {object} cardDate - object containing year, month and date keys
* */
export const convertCardDate = (cardDate) => {
	const year = cardDate?.year || 0
	const month = cardDate?.month || 0
	const day = cardDate?.day || 0

	return (year && (month + 1) && day) ? new Date(year, month + 1, day, 0, 0, 0, 0) : null
}

/*
	* extracts initial values from the current lot and maps them to the template parameter
	* */
export const getInitialValues = (lotTemplate, card) => {
	let initialValues = {} // initialize to empty object

	// make sure lotTemplate is object to avoid errors
	// make sure lotTemplate.fields is array
	if(isObject(lotTemplate) && isArray(lotTemplate.fields)) {


		// loop through rows in column
		lotTemplate.fields.forEach((currRow, currRowIndex) => {

			// loop through items in row
			currRow.forEach((currItem, currItemIndex) => {

				// extract properties of currItem
				const {
					fieldName,
					id: fieldId,
					component,
					key
				} = currItem || {}

				// set initialValue for current item
				// name of value is given by fieldName
				// if card already has a value, use it. Otherwise, use appropriate default value for field type
				switch(component) {
					case FIELD_COMPONENT_NAMES.TEXT_BOX: {
						initialValues[fieldName] = (isObject(card) && isObject(card.templateValues)) ?
							(card.templateValues[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD)
							:
							isObject(initialValues) ?
								(initialValues[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD)
								:
								BASIC_FIELD_DEFAULTS.TEXT_FIELD
						break;
					}

					case FIELD_COMPONENT_NAMES.TEXT_BOX_BIG: {
						initialValues[fieldName] = (isObject(card) && isObject(card.templateValues)) ?
							(card.templateValues[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD)
							:
							isObject(initialValues) ?
								(initialValues[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD)
								:
								BASIC_FIELD_DEFAULTS.TEXT_FIELD
						break;
					}

					case FIELD_COMPONENT_NAMES.CALENDAR_SINGLE: {
						initialValues[fieldName] = (isObject(card) && isObject(card.templateValues)) ?
							((isValidDateString(card.templateValues[fieldName]) ? new Date(card.templateValues[fieldName]) : BASIC_FIELD_DEFAULTS.CALENDAR_FIELD) || BASIC_FIELD_DEFAULTS.CALENDAR_FIELD)
							:
							isObject(initialValues) ?
								((isValidDateString(initialValues[fieldName]) ? new Date(initialValues[fieldName]) : BASIC_FIELD_DEFAULTS.CALENDAR_FIELD) || BASIC_FIELD_DEFAULTS.CALENDAR_FIELD)
								:
								BASIC_FIELD_DEFAULTS.CALENDAR_FIELD
						break;
					}

					case FIELD_COMPONENT_NAMES.CALENDAR_START_END: {
						let updatedValues = [...BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE]
						if((isObject(card) && isObject(card.templateValues)) && isArray(card.templateValues[fieldName])) {
							const val = card.templateValues[fieldName]
							if(val.length > 0 && val[0] !== null) {
								updatedValues[0] = new Date(val[0])
							}
							if(val.length > 1 && val[1] !== null) {
								updatedValues[1] = new Date(val[1])
							}
						}

						initialValues[fieldName] = updatedValues
						break;
					}

					case FIELD_COMPONENT_NAMES.NUMBER_INPUT: {
						initialValues[fieldName] = (isObject(card) && isObject(card.templateValues)) ?
							(card.templateValues[fieldName] || BASIC_FIELD_DEFAULTS.NUMBER_FIELD)
							:
							isObject(initialValues) ?
								(initialValues[fieldName] || BASIC_FIELD_DEFAULTS.NUMBER_FIELD)
								:
								BASIC_FIELD_DEFAULTS.NUMBER_FIELD
						break;
					}
				}
			})
		})
	}
	else {

	}

	return initialValues
}

export const convertLotToExcel = (lot, lotTemplateId) => {
	const {
		[lotTemplateId]: templateValues,
		...rest
	} = lot

	return {
		...templateValues,
		...rest
	}
}

export const convertExcelToLot = (excel, lotTemplate, processId) => {
	const  {
		name: payloadName,	// extract reserved fields
		bins,				// extract reserved fields
		processId: selectedProcessId,			// extract reserved fields
		id,				// extract reserved fields
		quantity,			// extract reserved fields
		...remainingPayload
	} = excel

	return {
		name: payloadName ? payloadName : "",
		bins: bins ? bins : defaultBins,
		processId: selectedProcessId ? selectedProcessId : (processId ? processId : null),	// if currentLot has processId, use it. Otherwise if form has value, use it. Otherwise set to null
		id,
		[lotTemplate.id]: {
			...getInitialValues(lotTemplate),
			...remainingPayload
		}
	}
}

export const getFieldValueFromPath = (item, path, name) => {


	if(isNonEmptyArray(path)) {
		let fieldValue = {...item}

		for(let i = 0; i < path.length; i++) {
			fieldValue = fieldValue[path[i]]
		}
		return fieldValue[name]
	}
	else if(path) {
		const {
			[path]: pathObj
		} = item || {}

		const {
			[name]: fieldValue
		} = pathObj || {}

		return fieldValue
	}
	else if(name) {
		return item[name]
	}

	return null

}

/*
* This function receives an array of cards as an argument and sorts them based on the {sortMode} argument.
*
* The original array is modified in place - THIS WILL MODIFY THE ARRAY - pass a copy if the original array shouldn't be modified
*
* @param {array} arr - array of cards
* @param {string} sortMode - string identifier of mode to sort by
* */
export const sortBy = (arr, sortMode, sortDirection) => {
	const isAscending = sortDirection.id === SORT_DIRECTIONS.ASCENDING.id

	const {
		dataType,
		label,
		index,
		fieldName,
		fieldPath,
	} = sortMode

	switch(dataType) {
		case FIELD_DATA_TYPES.URL: {
			// not yet implemented
			break
		}
		case FIELD_DATA_TYPES.EMAIL: {
			// not yet implemented
			break
		}
		case FIELD_DATA_TYPES.DATE: {
			arr.sort((itemA, itemB) => {
				const valA = getFieldValueFromPath(itemA, fieldPath, fieldName)
				const valB = getFieldValueFromPath(itemB, fieldPath, fieldName)

				if(!valA) return 1
				if(!valB) return -1
				if(isAscending) {
					return new Date(valA) - new Date(valB);
				}
				else {
					return new Date(valB) - new Date(valA);
				}
			})
			break

		}
		case FIELD_DATA_TYPES.DATE_RANGE: {
			arr.sort((itemA, itemB) => {
				const rangeA = getFieldValueFromPath(itemA, fieldPath, fieldName)
				const rangeB = getFieldValueFromPath(itemB, fieldPath, fieldName)

				if(!rangeA) return 1
				if(!rangeB) return -1

				const valA = rangeA[index]
				const valB = rangeB[index]

				if(!valA) return 1
				if(!valB) return -1
				if(isAscending) {
					return new Date(valA) - new Date(valB);
				}
				else {
					return new Date(valB) - new Date(valA);
				}
			})
			break
		}
		case FIELD_DATA_TYPES.STRING: {
			arr.sort((itemA, itemB) => {
				const stringA = getFieldValueFromPath(itemA, fieldPath, fieldName)
				const stringB = getFieldValueFromPath(itemB, fieldPath, fieldName)

				if(!stringA) return 1

				if(isAscending) {
					if(stringA >= stringB) return 1
					return -1
				}
				else {
					if(stringA >= stringB) return -1
					return 1
				}

			})
			break
		}
		case FIELD_DATA_TYPES.INTEGER: {
			arr.sort((itemA, itemB) => {
				const valA = getFieldValueFromPath(itemA, fieldPath, fieldName)
				const valB = getFieldValueFromPath(itemB, fieldPath, fieldName)

				if(valA === null) return 1

				if(isAscending) {
					if(valA >= valB) return 1
					return -1
				}
				else {
					if(valA >= valB) return -1
					return 1
				}
			})
			break
		}
		default: {
			break
		}
	}

	return arr
}

export const jsDateToString = (jsDate) => {
	const objDate = jsDateToObjDate(jsDate)

	const {
		year: startYear,
		month: startMonth,
		day: startDay
	} = objDate || {}

	return (startDay && startMonth && startYear) ? `${startMonth}/${startDay}/${startYear}` : null
}

export const dateRangeToStrings = (dateRange) => {

	let startDateText
	let endDateText
	if(isArray(dateRange) && dateRange.length > 0) {
		startDateText = jsDateToString(dateRange[0])

		if(dateRange.length > 1) {
			endDateText = jsDateToString(dateRange[1])
		}
	}

	return [startDateText, endDateText]
}