import {deepCopy} from "./utils";
import {SORT_MODES} from "../../constants/common_contants";
import {isObject} from "./object_utils";
import {isArray} from "./array_utils";
import {
	defaultBins,
	FIELD_COMPONENT_NAMES,
	FIELD_DATA_TYPES,
	LOT_PRIMARY_FIELD_IDS, REQUIRED_FIELDS,
	SORT_DIRECTIONS
} from "../../constants/lot_contants";
import {BASIC_FIELD_DEFAULTS, DATA_TYPE_DEFAULTS} from "../../constants/form_constants";
import {toIntegerOrZero} from "./number_utils";
import {isValidDateString} from "./date_utils";
import {isInteger} from "formik";
import {getLotField} from "./lot_utils";

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
export const getFormCustomFields = (fields, card) => {
	let initialValues = [] // initialize to empty object

	// make sure fields is array
	if(isArray(fields)) {

		// loop through rows in column
		fields.forEach((currRow, currRowIndex) => {
			let newRow = []

			// loop through items in row
			currRow.forEach((currItem, currItemIndex) => {

				// extract properties of currItem
				const {
					fieldName,
					id: fieldId,
					component,
					dataType,
					key
				} = currItem || {}

				let value
				if(isArray(card)) {
					for(const field of card.flat()) {
						const {
							id,
							value: currVal
						} = field || {}

						if(id === fieldId) {
							value = currVal
						}
					}
				}

				newRow.push({
					...currItem,
					value: convertValue(value, dataType)
				})
			})

			initialValues.push(newRow)
		})
	}
	else {

	}

	return initialValues
}

/*
* Takes value and desired dataType, and converts value to dataType if necessary
* */
export const convertValue = (value, dataType) => {
	if(!value) return DATA_TYPE_DEFAULTS[dataType]

	switch(dataType) {
		case FIELD_DATA_TYPES.STRING: {
			if(!(value instanceof String)) return value.toString()
		}
		case FIELD_DATA_TYPES.EMAIL: {
			break
		}
		case FIELD_DATA_TYPES.DATE: {
			if(!(value instanceof Date)) return new Date(value)
			break
		}
		case FIELD_DATA_TYPES.DATE_RANGE: {
			let updatedValues = [...BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE]	// SPREAD SO YOU DON'T CHANGE THE VALUE OF THE CONSTANT DEFAULT

			// convert first item to date
			if( isArray(value) && value.length > 0 && value[0] !== null) {
				updatedValues[0] = new Date(value[0])
			}

			// convert second item to date
			if(value.length > 1 && value[1] !== null) {
				updatedValues[1] = new Date(value[1])
			}

			return updatedValues

			break
		}
		case FIELD_DATA_TYPES.URL: {
			break
		}
		case FIELD_DATA_TYPES.INTEGER: {
			if(!isInteger(value)) return parseInt(value)
			break
		}
		default: {
			return value
		}
	}

	return value
}

export const convertLotToExcel = (lot, lotTemplateId) => {
	// const {
	// 	[lotTemplateId]: templateValues,
	// 	...rest
	// } = lot
	//
	// return {
	// 	...templateValues,
	// 	...rest
	// }

	return {
		...lot
	}
}

export const convertPastePayloadToLot = (excel, lotTemplate, processId) => {
	let remainingExcel = {...excel}
	let lot = {}

	for(const primaryField of REQUIRED_FIELDS) {

		const {
			id: primaryFieldId,
			fieldName,
			dataType,
			fieldPath,
		} = primaryField || {}

		const {
			[primaryFieldId]: extractedPrimaryField,
			...rest
		} = remainingExcel
		remainingExcel = rest


		const value = extractedPrimaryField ? extractedPrimaryField.value : DATA_TYPE_DEFAULTS[dataType]

		// for fields that use a field path, must contrcut value object
		if(isArray(fieldPath) && fieldPath.length > 0) {

			let constrcutedValue = {}
			constrcutedValue = {[fieldPath[fieldPath.length - 1]]: value}

			fieldPath.forEach((currentPath, currPathIndex) => {
				if(currPathIndex === fieldPath.length - 1) return // skip last since it was done
				constrcutedValue = {[currentPath]: constrcutedValue}
			})

			lot[fieldName] = constrcutedValue
		}


		else {
			lot[primaryField.fieldName] = value
		}
	}

	lot.fields = getFormCustomFields(lotTemplate.fields, [Object.values(remainingExcel)])
	lot.processId = processId

	return lot
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
		primary,
		id: fieldId,
	} = sortMode

	arr.sort((itemA, itemB) => {
		let fieldA, fieldB

		if(primary) {
			fieldA = itemA[fieldName]
			fieldB = itemB[fieldName]
		}
		else {
			fieldA = getLotField("fieldName", fieldName, itemA)?.value
			fieldB = getLotField("fieldName", fieldName, itemB)?.value
		}

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
				if(!fieldA) return 1
				if(!fieldB) return -1
				if(isAscending) {
					return new Date(fieldA) - new Date(fieldB);
				}
				else {
					return new Date(fieldB) - new Date(fieldA);
				}

				break

			}
			case FIELD_DATA_TYPES.DATE_RANGE: {
				if(!fieldA) return 1
				if(!fieldB) return -1

				const valA = fieldA[index]
				const valB = fieldB[index]

				if(!valA) return 1
				if(!valB) return -1
				if(isAscending) {
					return new Date(valA) - new Date(valB);
				}
				else {
					return new Date(valB) - new Date(valA);
				}

				break
			}
			case FIELD_DATA_TYPES.STRING: {
				if(!fieldA) return 1
				if(!fieldB) return -1

				if(isAscending) {
					if(fieldA >= fieldB) return 1
					return -1
				}
				else {
					if(fieldA >= fieldB) return -1
					return 1
				}

				break
			}
			case FIELD_DATA_TYPES.INTEGER: {
				if(fieldA === null) return 1

				if(isAscending) {
					if(fieldA >= fieldB) return 1
					return -1
				}
				else {
					if(fieldA >= fieldB) return -1
					return 1
				}

				break
			}
			default: {
				break
			}
		}
	})

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