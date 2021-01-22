export const isArray = (arr) => {
	return ((typeof arr !== 'undefined') && Array.isArray(arr))
}

export const removeArrayIndices = (arr, indices) => {
	let arrCopy = [...arr]

	for (var i = indices.length - 1; i >= 0; i--)
		arrCopy.splice(indices[i],1);

	return arrCopy
}