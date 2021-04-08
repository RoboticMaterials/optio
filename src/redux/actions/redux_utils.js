export const createActionType = (items) => {
	let type = ""
	items.forEach((currItem) => type = type + currItem)
	return type
}