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

export const convertCardDate = (cardDate) => {
	console.log("convertCardDate cardDate",cardDate)
	const year = cardDate?.year || 0
	const month = cardDate?.month || 0
	const day = cardDate?.day || 0

	return (year && (month + 1) && day) ? new Date(year, month, day, 0, 0, 0, 0) : new Date()
}