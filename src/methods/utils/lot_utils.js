import {isObject} from "./object_utils";
import {capitalizeFirstLetter, isEqualCI, isString} from "./string_utils";
import {FIELD_DATA_TYPES, LOT_FILTER_OPTIONS} from "../../constants/lot_contants";
import {isArray} from "./array_utils";
import store from '../../redux/store/index'
import lotTemplatesReducer from "../../redux/reducers/lot_templates_reducer";
import {toIntegerOrZero} from "./number_utils";

export const getDisplayName = (lotTemplate, fieldName, fallback) => {
	let returnVal
	if(isObject(lotTemplate?.displayNames) && lotTemplate.displayNames[fieldName]) {
		returnVal =  lotTemplate.displayNames[fieldName]
	}

	return isString(returnVal) ? returnVal : fallback ? fallback : ""
}

export const getMatchesFilter = (lot, filterValue, filterMode) => {
	switch(filterMode.label) {
		case LOT_FILTER_OPTIONS.name.label: {
			if(filterValue) {
				return lot.name.toLowerCase().includes((filterValue || "").toLowerCase())
			}
			return true
			break
		}
		case LOT_FILTER_OPTIONS.flags.label: {
			if(isArray(filterValue) && filterValue.length > 0) {
				if(isArray(lot.flags)) {
					for(const filterFlag of filterValue) {
						const {
							id: currFilterId
						} = filterFlag

						if(!lot.flags.includes(currFilterId)) return false
					}
					return true
				}
				return false
			}
			return true
			break
		}
		default: {
			if(isObject(filterMode)) {
				const {
					dataType,		//"STRING"
					label,			//"Skew (String)"
				} = filterMode || {}

				if(lot[label] !== undefined) {
					if(!filterValue) return true

					switch(dataType) {
						case FIELD_DATA_TYPES.URL: {

						}
						case FIELD_DATA_TYPES.EMAIL: {

						}
						case FIELD_DATA_TYPES.DATE: {

						}
						case FIELD_DATA_TYPES.DATE_RANGE: {

						}
						case FIELD_DATA_TYPES.STRING: {
							return lot[label].toLowerCase().includes((filterValue || "").toLowerCase())
						}
						case FIELD_DATA_TYPES.INTEGER: {
							return toIntegerOrZero(lot[label]) === toIntegerOrZero(filterValue)
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
		`#${parseInt(lotNumber).toLocaleString('en-US', {minimumIntegerDigits: 6, useGrouping:false})}`
		:
		``
}

export const getLotTotalQuantity = ({bins}) => {
	let totalQuantity = 0

	if(isObject(bins)) {
		Object.values(bins).forEach(currBin => {
			const {
				count
			} = currBin || {}

			totalQuantity = totalQuantity + parseInt(count)
		})
	}

	return totalQuantity
}

export const getAllTemplateFields = () => {
	const lotTemplates = store.getState().lotTemplatesReducer.lotTemplates

	let templateFields = []

	Object.values(lotTemplates).forEach((currLotTemplate) => {
		const {
			fields
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
					component
				}

				let alreadyExists = false
				templateFields.forEach((currTemplateField) => {
					const {
						label: currExistingLabel,
						dataType: currExistingDataType,
						component: currExistingComponent
					} = currTemplateField || {}

					if((isEqualCI(item.label, currExistingLabel)) && (item.dataType === currExistingDataType)) {
						alreadyExists = true
					}
				})

				if(!alreadyExists) {
					templateFields.push(item)
				}
			})
		})
	})

	return templateFields
}

export const convertDataTypeContantToDisplay = (dataTypeContant) => {
	switch(dataTypeContant) {
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