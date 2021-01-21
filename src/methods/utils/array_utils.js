import {SORT_MODES} from "../../constants/common_contants";
import {convertCardDate} from "./card_utils";
import {deepCopy} from "./utils";

export const sortBy = (arr, sortMode) => {
	let arrCopy = deepCopy(arr)
	switch(sortMode) {
		case SORT_MODES.QUANTITY: {
			break
		}
		case SORT_MODES.NAME: {
			arrCopy = arrCopy.sort((itemA, itemB) => {
				const {
					name: nameA
				} = itemA

				const {
					name: nameB
				} = itemB

				return nameA > nameB
			})
			break
		}
		case SORT_MODES.END_DESCENDING: {
			break
		}
		case SORT_MODES.END_ASCENDING: {
			break
		}
		case SORT_MODES.START_DESCENDING: {
			break
		}
		case SORT_MODES.START_ASCENDING: {
			arrCopy = arrCopy.sort((itemA, itemB) => {
				const {
					startDateA = {
						year: 0,
						month: 0,
						day: 0
					}
				} = itemA
				const convertedA = convertCardDate(startDateA)


				const {
					startDateB = {
						year: 0,
						month: 0,
						day: 0
					}
				} = itemB
				const convertedB = convertCardDate(startDateB)

				console.log("convertedA",convertedA)
				console.log("convertedB",convertedB)
				return convertedA > convertedB
			})
			break
		}

	}

	return arrCopy

}
