import {
    GET_STATUS_STARTED,
    GET_STATUS_SUCCESS,
    GET_STATUS_FAILURE,

    POST_STATUS_STARTED,
    POST_STATUS_SUCCESS,
    POST_STATUS_FAILURE,
} from '../types/status_types';

const defaultState = {
    status: {},
    pending: false,
    hilTimer: String.fromCharCode(160),

};

export default function statusReducer(state = defaultState, action) {

    switch (action.type) {

        // get
        // ***************
        case GET_STATUS_SUCCESS:
            return Object.assign({}, state, {
                status: action.payload,
                pending: false
            });

        case GET_STATUS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_STATUS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // post
        // ***************
        case POST_STATUS_SUCCESS:
            return Object.assign({}, state, {
                pending: false,
                status: { ...state.status, ...action.payload },
            });

        case POST_STATUS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_STATUS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        default:
            return state
    }
}
