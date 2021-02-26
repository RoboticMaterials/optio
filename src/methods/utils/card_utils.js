import {deepCopy} from "./utils";
import {SORT_MODES} from "../../constants/common_contants";
import {isObject} from "./object_utils";
import {isArray} from "./array_utils";
import {defaultBins, FIELD_COMPONENT_NAMES} from "../../constants/lot_contants";
import {BASIC_FIELD_DEFAULTS} from "../../constants/form_constants";

const EVENT_NAMES = {
	CREATE: "create",
	UPDATE: "update"
}

export const jsDateToObjDate = (jsDate) => {
	if(!jsDate) return null

	let trimmed = new Date(jsDate.toDateString());

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
					_id: fieldId,
					component,
					key
				} = currItem || {}

				// set initialValue for current item
				// name of value is given by fieldName
				// if card already has a value, use it. Otherwise, use appropriate default value for field type
				switch(component) {
					case FIELD_COMPONENT_NAMES.TEXT_BOX: {
						initialValues[fieldName] = isObject(card) ?
							(card[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD)
							:
							isObject(initialValues) ?
								(initialValues[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD)
								:
								BASIC_FIELD_DEFAULTS.TEXT_FIELD
						break;
					}

					case FIELD_COMPONENT_NAMES.TEXT_BOX_BIG: {
						initialValues[fieldName] = isObject(card) ?
							(card[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD)
							:
							isObject(initialValues) ?
								(initialValues[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD)
								:
								BASIC_FIELD_DEFAULTS.TEXT_FIELD
						break;
					}

					case FIELD_COMPONENT_NAMES.CALENDAR_SINGLE: {
						initialValues[fieldName] = isObject(card) ?
							(card[fieldName] || BASIC_FIELD_DEFAULTS.CALENDAR_FIELD)
							:
							isObject(initialValues) ?
								(initialValues[fieldName] || BASIC_FIELD_DEFAULTS.CALENDAR_FIELD)
								:
								BASIC_FIELD_DEFAULTS.CALENDAR_FIELD
						break;
					}

					case FIELD_COMPONENT_NAMES.CALENDAR_START_END: {
						let updatedValues = BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE

						if(isObject(card) && isArray(card[fieldName])) {
							const val = card[fieldName]
							if(val.length > 0) {
								updatedValues = [new Date(val[0])]
							}
							if(val.length > 1) {
								updatedValues.push(new Date(val[1]))
							}
						}
						else if(isObject(initialValues) && isArray(initialValues[fieldName])) {
							const val = initialValues[fieldName]
							if(val.length > 0) {
								updatedValues = [new Date(val[0])]
							}
							if(val.length > 1) {
								updatedValues.push(new Date(val[1]))
							}
						}

						initialValues[fieldName] = updatedValues
						break;
					}

					case FIELD_COMPONENT_NAMES.NUMBER_INPUT: {
						initialValues[fieldName] = isObject(card) ?
							(card[fieldName] || BASIC_FIELD_DEFAULTS.NUMBER_FIELD)
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
		_id,				// extract reserved fields
		quantity,			// extract reserved fields
		...remainingPayload
	} = excel

	return {
		name: payloadName ? payloadName : "",
		bins: bins ? bins : defaultBins,
		processId: selectedProcessId ? selectedProcessId : (processId ? processId : null),	// if currentLot has processId, use it. Otherwise if form has value, use it. Otherwise set to null
		_id,
		[lotTemplate._id]: {
			...getInitialValues(lotTemplate),
			...remainingPayload
		}
	}
}
/*
* This function receives an array of cards as an argument and sorts them based on the {sortMode} argument.
*
* The original array is modified in place - THIS WILL MODIFY THE ARRAY - pass a copy if the original array shouldn't be modified
*
* @param {array} arr - array of cards
* @param {string} sortMode - string identifier of mode to sort by
* */
export const sortBy = (arr, sortMode) => {

	switch(sortMode) {
		case SORT_MODES.QUANTITY_ASCENDING: {
			arr.sort((itemA, itemB) => {
				const { count: countA } = itemA

				const { count: countB } = itemB

				if(parseInt(countA) >= parseInt(countB)) return 1
				return -1
			})

			break
		}
		case SORT_MODES.QUANTITY_DESCENDING: {
			arr.sort((itemA, itemB) => {
				const { count: countA } = itemA

				const { count: countB } = itemB

				if(parseInt(countA) < parseInt(countB)) return 1
				return -1
			})

			break
		}

		case SORT_MODES.NAME_ASCENDING: {
			arr.sort((itemA, itemB) => {
				const { name: nameA } = itemA

				const { name: nameB } = itemB

				if(nameA >= nameB) return 1
				return -1
			})
			break
		}

		case SORT_MODES.NAME_DESCENDING: {
			arr.sort((itemA, itemB) => {
				const { name: nameA } = itemA

				const { name: nameB } = itemB

				if(nameA < nameB) return 1
				return -1
			})
			break
		}

		case SORT_MODES.END_DESCENDING: {
			arr.sort((itemA, itemB) => {
				const { end_date: endDateA } = itemA
				const convertedA = convertCardDate(endDateA)

				const { end_date: endDateB } = itemB
				const convertedB = convertCardDate(endDateB)

				if(!convertedA) return 1
				if(convertedA > convertedB) return -1
				return 1
			})

			break
		}
		case SORT_MODES.END_ASCENDING: {
			arr.sort((itemA, itemB) => {
				const { end_date: endDateA } = itemA
				const convertedA = convertCardDate(endDateA)

				const { end_date: endDateB } = itemB
				const convertedB = convertCardDate(endDateB)

				if(!convertedA) return 1
				if(convertedA >= convertedB) return 1
				return -1
			})

			break
		}
		case SORT_MODES.START_DESCENDING: {
			arr.sort((itemA, itemB) => {
				const { start_date: startDateA } = itemA
				const convertedA = convertCardDate(startDateA)

				const { start_date: startDateB } = itemB
				const convertedB = convertCardDate(startDateB)

				if(!convertedA) return 1
				if(convertedA > convertedB) return -1
				return 1
			})
			break
		}
		case SORT_MODES.START_ASCENDING: {
			arr.sort((itemA, itemB) => {
				const { start_date: startDateA } = itemA
				const convertedA = convertCardDate(startDateA)

				const { start_date: startDateB } = itemB
				const convertedB = convertCardDate(startDateB)

				if(!convertedA) return 1
				if(convertedA >= convertedB) return 1
				return -1
			})
			break
		}

	}

	return arr
}