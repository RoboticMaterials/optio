import {
    GET_TOUCH_EVENTS,
    GET_TOUCH_EVENTS_STARTED,
    GET_TOUCH_EVENTS_SUCCESS,
    GET_TOUCH_EVENTS_FAILURE,

    GET_LOT_TOUCH_EVENTS,
    GET_LOT_TOUCH_EVENTS_STARTED,
    GET_LOT_TOUCH_EVENTS_SUCCESS,
    GET_LOT_TOUCH_EVENTS_FAILURE,

    OPEN_TOUCH_EVENT,
    OPEN_TOUCH_EVENT_STARTED,
    OPEN_TOUCH_EVENT_SUCCESS,
    OPEN_TOUCH_EVENT_FAILURE,

    CLOSE_TOUCH_EVENT,
    CLOSE_TOUCH_EVENT_STARTED,
    CLOSE_TOUCH_EVENT_SUCCESS,
    CLOSE_TOUCH_EVENT_FAILURE,

    GET_OPEN_TOUCH_EVENTS,
    GET_OPEN_TOUCH_EVENTS_STARTED,
    GET_OPEN_TOUCH_EVENTS_SUCCESS,
    GET_OPEN_TOUCH_EVENTS_FAILURE,

    GET_OPEN_STATION_TOUCH_EVENTS,
    GET_OPEN_STATION_TOUCH_EVENTS_STARTED,
    GET_OPEN_STATION_TOUCH_EVENTS_SUCCESS,
    GET_OPEN_STATION_TOUCH_EVENTS_FAILURE,

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
    lotEvents: {},
    openEvents: {}
}

const eventsReducer = (state = defaultState, action) => {
    
    let eventsClone = {}
    let eventIdx = null
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
        //              Get Open Map Events         //
        //                                          //
        // ======================================== //
        case GET_OPEN_TOUCH_EVENTS:
            break;

        case GET_OPEN_TOUCH_EVENTS_SUCCESS:
            return {
    
                ...state,
                openEvents: action.payload,
                pending: false,
            }


        case GET_OPEN_TOUCH_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_OPEN_TOUCH_EVENTS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        // ======================================== //
        //                                          //
        //              Get Open Station Events     //
        //                                          //
        // ======================================== //
        case GET_OPEN_STATION_TOUCH_EVENTS:
            break;

        case GET_OPEN_STATION_TOUCH_EVENTS_SUCCESS:
            return {
    
                ...state,
                openEvents: {
                    ...state.openEvents,
                    [action.payload.stationId]: action.payload.events
                },
                pending: false,
            }


        case GET_OPEN_STATION_TOUCH_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_OPEN_STATION_TOUCH_EVENTS_STARTED:
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
        //             Open Event                   //
        //                                          //
        // ======================================== //
        case OPEN_TOUCH_EVENT:
            break;

        case OPEN_TOUCH_EVENT_SUCCESS:

            eventsClone = deepCopy(state.openEvents[action.payload.load_station_id]) || []
            eventsClone.push(action.payload)

            return {
                ...state,
                openEvents: {
                    ...state.openEvents,
                    [action.payload.load_station_id]: eventsClone
                },
                pending: false
            }


        case OPEN_TOUCH_EVENT_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case OPEN_TOUCH_EVENT_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        // ======================================== //
        //                                          //
        //             Close Event                  //
        //                                          //
        // ======================================== //
        case CLOSE_TOUCH_EVENT:
            break;

        case CLOSE_TOUCH_EVENT_SUCCESS:

            eventsClone = deepCopy(state.openEvents[action.payload.load_station_id]) || []
            eventIdx = eventsClone.findIndex(e => e._id === action.payload._id);
            eventsClone.splice(eventIdx, 1)

            return {
                ...state,
                openEvents: {
                    ...state.openEvents,
                    [action.payload.load_station_id]: eventsClone
                },
                pending: false
            }


        case CLOSE_TOUCH_EVENT_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case CLOSE_TOUCH_EVENT_STARTED:
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