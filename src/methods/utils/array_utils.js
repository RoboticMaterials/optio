import { SORT_MODES } from "../../constants/common_contants";
import { convertCardDate } from "./card_utils";
import { deepCopy } from "./utils";


export const isArray = (arr) => {
    return ((typeof arr !== 'undefined') && Array.isArray(arr))
}

export const removeArrayIndices = (arr, indices) => {
    let arrCopy = [...arr]

    for (var i = indices.length - 1; i >= 0; i--)
        arrCopy.splice(indices[i], 1);

    return arrCopy
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export const isNonEmptyArray = (arr) => {
    return isArray(arr) && arr.length > 0
}

export const immutableInsert = (arr, ele, index) => {
    return [...arr.slice(0, index), ele, ...arr.slice(index, arr.length)]
}

export const immutableDelete = (arr, index) => {
    return [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)]
}

export const immutableReplace = (arr, ele, index) => {
    return [...arr.slice(0, index), ele, ...arr.slice(index + 1, arr.length)]
}

export const immutableSet = (arr, ele, index) => {
    let arrCopy = [...arr]
    for (let i = 0; i < index; i++) {
        if (!arrCopy[i]) arrCopy[i] = null
    }
    arrCopy[index] = ele

    return arrCopy
}

export const immutableMove = (arr, fromIndex, toIndex) => {
    let copyArr = [...arr]
    // Delete the item from it's current position
    const item = copyArr.splice(fromIndex, 1);

    // Move the item to its new position
    copyArr.splice(toIndex, 0, item[0]);
    return copyArr
}
