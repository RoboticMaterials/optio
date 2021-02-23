import {isObject} from "./object_utils";
import {isString} from "./string_utils";

export const getDisplayName = (lotTemplate, fieldName, fallback) => {
	let returnVal
	if(isObject(lotTemplate?.displayNames) && lotTemplate.displayNames[fieldName]) {
		returnVal =  lotTemplate.displayNames[fieldName]
	}

	return isString(returnVal) ? returnVal : fallback ? fallback : ""
}