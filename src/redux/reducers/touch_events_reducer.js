import {
    GET_TOUCH_EVENTS,
    GET_TOUCH_EVENTS_STARTED,
    GET_TOUCH_EVENTS_SUCCESS,
    GET_TOUCH_EVENTS_FAILURE,

    GET_LOT_TOUCH_EVENTS,
    GET_LOT_TOUCH_EVENTS_STARTED,
    GET_LOT_TOUCH_EVENTS_SUCCESS,
    GET_LOT_TOUCH_EVENTS_FAILURE,

    POST_TOUCH_EVENTS,
    POST_TOUCH_EVENTS_STARTED,
    POST_TOUCH_EVENTS_SUCCESS,
    POST_TOUCH_EVENTS_FAILURE,

    PUT_TOUCH_EVENTS,
    PUT_TOUCH_EVENTS_STARTED,
    PUT_TOUCH_EVENTS_SUCCESS,
    PUT_TOUCH_EVENTS_FAILURE,

    DELETE_TOUCH_EVENTS,
    DELETE_TOUCH_EVENTS_STARTED,
    DELETE_TOUCH_EVENTS_SUCCESS,
    DELETE_TOUCH_EVENTS_FAILURE,
} from '../types/touch_events_types'

import { deepCopy } from '../../methods/utils/utils';

const defaultState = {
    events: [],
    lotEvents: {}
}

const eventsReducer = (state = defaultState, action) => {
    
    let eventsClone = {}
    let currentEvent = ''

    switch (action.type) {

        // ======================================== //
        //                                          //
        //              Get Lot Events              //
        //                                          //
        // ======================================== //
        case GET_LOT_TOUCH_EVENTS:
            break;

        case GET_LOT_TOUCH_EVENTS_SUCCESS:
            return {
    
                ...state,
                lotEvents: {
                    ...state.lotEvents,
                    [action.payload.lotId]: action.payload.events
                },
                pending: false,
            }


        case GET_LOT_TOUCH_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_LOT_TOUCH_EVENTS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        // ======================================== //
        //                                          //
        //             Post Events                 //
        //                                          //
        // ======================================== //
        case POST_TOUCH_EVENTS:
            break;

        case POST_TOUCH_EVENTS_SUCCESS:

            eventsClone = deepCopy(state.events)

            eventsClone[action.payload._id.$oid] = action.payload

            return {
                ...state,
                pending: false
            }


        case POST_TOUCH_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_TOUCH_EVENTS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });


        // ======================================== //
        //                                          //
        //             Utilities                    //
        //                                          //
        // ======================================== //

        default:
            return state


    }
}

export default eventsReducer