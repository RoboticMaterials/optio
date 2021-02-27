import {isObject} from "./object_utils";
import {isString} from "./string_utils";
import {LOT_FILTER_OPTIONS} from "../../constants/lot_contants";
import {isArray} from "./array_utils";

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
		default:
			return true
	}




}