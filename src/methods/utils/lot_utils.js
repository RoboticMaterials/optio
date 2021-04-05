import {isObject} from "./object_utils";
import {capitalizeFirstLetter, isEqualCI, isString} from "./string_utils";
import {
	BASIC_LOT_TEMPLATE,
	BASIC_LOT_TEMPLATE_ID, BIN_IDS,
	FIELD_DATA_TYPES,
	LOT_FILTER_OPTIONS
} from "../../constants/lot_contants";
import {immutableDelete, immutableReplace, isArray} from "./array_utils";
import store from '../../redux/store/index'
import lotTemplatesReducer from "../../redux/reducers/lot_templates_reducer";
import {toIntegerOrZero} from "./number_utils";
import {useSelector} from "react-redux";

export const getDisplayName = (lotTemplate, fieldName, fallback) => {
	let returnVal
	if(isObject(lotTemplate?.displayNames) && lotTemplate.displayNames[fieldName]) {
		returnVal =  lotTemplate.displayNames[fieldName]
	}

	return isString(returnVal) ? returnVal : fallback ? fallback : ""
}

export const getBinName = (binId) => {
	const stations = store.getState().stationsReducer.stations || {}

	if(binId === BIN_IDS.QUEUE) {
		return "Queue"
	}
	else if(binId === BIN_IDS.FINISH) {
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

export const getMatchesFilter = (lot, filterValue, filterMode) => {
	switch(filterMode.label) {
		case LOT_FILTER_OPTIONS.name.label: {
			if(filterValue) {
				return lot.name.toLowerCase().includes((filterValue || "").toLowerCase())
			}
			return true
			break
		}
		case LOT_FILTER_OPTIONS.lotNumber.label: {
			if(filterValue) {
				const formattedLotNumber = formatLotNumber(lot.lotNumber)
				return formattedLotNumber.toLowerCase().includes((filterValue || "").toLowerCase())
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
					fieldName,
				} = filterMode || {}

				if(lot[fieldName] !== undefined) {
					if(!filterValue) return true

					switch(dataType) {
						case FIELD_DATA_TYPES.URL: {
							// not implemented yet
							return true
						}
						case FIELD_DATA_TYPES.EMAIL: {
							// not implemented yet
							return true
						}
						case FIELD_DATA_TYPES.DATE: {
							// not implemented yet
							return true
						}
						case FIELD_DATA_TYPES.DATE_RANGE: {
							// not implemented yet
							return true
						}
						case FIELD_DATA_TYPES.STRING: {
							return lot[fieldName].toLowerCase().includes((filterValue || "").toLowerCase())
						}
						case FIELD_DATA_TYPES.INTEGER: {
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

export const getBinQuantity = ({bins}, binId) => {
	const {
		[binId]: currentBin
	} = bins || {}

	const {
		count
	} = currentBin || {}

	return count
}

export const getIsCardAtBin = ({bins}, binId) => {
	return !!getBinQuantity({bins}, binId)
}

export const getAllTemplateFields = () => {
	const lotTemplates = {
		[BASIC_LOT_TEMPLATE_ID]: {...BASIC_LOT_TEMPLATE},
		...(store.getState().lotTemplatesReducer.lotTemplates || {})
	}

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
					component,
					fieldName
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

export const getLotTemplateData = (lotTemplateId, lot) => {
	const lotTemplates = store.getState().lotTemplatesReducer.lotTemplates || {}
	const lotTemplate = lotTemplateId === BASIC_LOT_TEMPLATE_ID ? BASIC_LOT_TEMPLATE : (lotTemplates[lotTemplateId] || {})

	let templateValues = []

	console.log("getLotTemplateData",lot)

	if(isArray(lotTemplate.fields)) {
		lotTemplate.fields.forEach((currRow) => {

			if(isArray(currRow)) {
				currRow.forEach((currItem) => {
					const {
						dataType,
						fieldName
					} = currItem

					const lotValue = lot.templateValues[fieldName]
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

	if(movedBin) {
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
