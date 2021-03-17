export const isControlAndShift = (event) => {
	return isShift(event) && isControl(event)
}

export const isShift = (event) => {
	return event.shiftKey
}

export const isControl = (event) => {
	return event.metaKey
}