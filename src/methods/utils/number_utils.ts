export const toIntegerOrZero = (value) => {
	return Number.isInteger(value) ?
		value
		:
		Number.isInteger(parseInt(value)) ?
			parseInt(value)
			:
			0
}