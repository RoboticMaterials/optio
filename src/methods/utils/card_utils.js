import {deepCopy} from "./utils";
import {SORT_MODES} from "../../constants/common_contants";

const EVENT_NAMES = {
	CREATE: "create",
	UPDATE: "update"
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
* Converts date from a card into a JS date object
*
* The card date object contains key, value pairs for year, month, and date
* These values are extracted, and if the values are valid, used to generate a new Date objects
*
* returns a JS Date object if the card date is valid, and null otherwise
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