import {
    SET_MODE,
    SET_ACTION,
    SET_WIDTH,
    SET_OPEN,
    PAGE_DATA_CHANGED, SET_CONFIRM_DELETE,
    SHOW_LOT_SCAN_MODAL,
} from '../types/sidebar_types'

export const setMode = (mode) => {
    return { type: SET_MODE, payload: {mode}}
}

export const setAction = (action) => {
    return { type: SET_ACTION, payload: {action} }
}

export const setWidth = (width) => {
    return { type: SET_WIDTH, payload: width }
}

export const setOpen = (state) => {
    return { type: SET_OPEN, payload: state}
}

export const pageDataChanged = (state) => {
    return { type: PAGE_DATA_CHANGED, payload: state}
}

export const setConfirmDelete = (show, callback) => {
    return { type: SET_CONFIRM_DELETE, payload: {show, callback}}
}

export const showLotScanModal = (show) => {
    return { type: SHOW_LOT_SCAN_MODAL, payload: show }
}
