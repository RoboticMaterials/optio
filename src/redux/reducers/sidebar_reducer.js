import {
    SET_MODE,
    SET_ACTION,
    SET_WIDTH,
    SET_OPEN,
    PAGE_DATA_CHANGED,
} from '../types/sidebar_types'


const defaultState = {
    mode: 'locations',
    action: null,
    width: 450,
    open: false,
    pageDataChanged:false,
};

export default function sidebarReducer(state = defaultState, action) {

    switch (action.type) {

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



        default:
            return state;
    }
}
