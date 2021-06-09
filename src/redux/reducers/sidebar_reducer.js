import {
    SET_MODE,
    SET_ACTION,
    SET_WIDTH,
    SET_OPEN,
    PAGE_DATA_CHANGED, SET_CONFIRM_DELETE,
    SHOW_LOT_SCAN_MODAL,
} from '../types/sidebar_types'


const defaultState = {
    mode: 'locations',
    action: null,
    width: 450,
    open: false,
    pageDataChanged:false,
    showConfirmDeleteModal: false,
    confirmDeleteCallback: null,
    showLotScanModal: false,
};

export default function sidebarReducer(state = defaultState, action) {

    switch (action.type) {

        case SET_CONFIRM_DELETE: {
            return {
                ...state,
                showConfirmDeleteModal: action.payload.show,
                confirmDeleteCallback: action.payload.callback,
            }
        }

        case SET_MODE:
            return {
                ...state,
                mode: action.payload.mode
            }

        case SET_ACTION:
            return {
                ...state,
                action: action.payload.action
            }

        case SET_WIDTH:
            return {
                ...state,
                width: action.payload
            }

        case SET_OPEN:
            return {
                ...state,
                open: action.payload
            }

        case PAGE_DATA_CHANGED:
            return {
                ...state,
                pageDataChanged: action.payload
            }

        case SHOW_LOT_SCAN_MODAL:
            return {
                ...state,
                showLotScanModal: action.payload
            }


        default:
            return state;
    }
}
