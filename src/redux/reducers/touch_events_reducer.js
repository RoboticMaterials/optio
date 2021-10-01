import {
    GET_TOUCH_EVENTS,
    GET_TOUCH_EVENTS_STARTED,
    GET_TOUCH_EVENTS_SUCCESS,
    GET_TOUCH_EVENTS_FAILURE,

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
    events: {},
}

const eventsReducer = (state = defaultState, action) => {
    
    let eventsClone = {}
    let currentEvent = ''

    switch (action.type) {

        // ======================================== //
        //                                          //
        //              Get Events                 //
        //                                          //
        // ======================================== //
        case GET_TOUCH_EVENTS:
            break;

        case GET_TOUCH_EVENTS_SUCCESS:


            return {
    
                ...state,
                events: { ...action.payload },
                pending: false,
            }


        case GET_TOUCH_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_TOUCH_EVENTS_STARTED:
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
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //              Put Events              //
        //                                          //
        // ======================================== //
        case PUT_TOUCH_EVENTS:
            break;

        case PUT_TOUCH_EVENTS_SUCCESS:
            // Find the corresponding event and replace it with the new one
            currentEvent = JSON.parse(action.payload)

            eventsClone = deepCopy(state.events)

            eventsClone[currentEvent._id.$oid] = currentEvent

            return {
                ...state,
                events: { ...eventsClone }
            }

        case PUT_TOUCH_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case PUT_TOUCH_EVENTS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //           Delete Events                 //
        //                                          //
        // ======================================== //
        case DELETE_TOUCH_EVENTS:
            break;

        case DELETE_TOUCH_EVENTS_SUCCESS:

            eventsClone = deepCopy(state.events)

            delete eventsClone[action.payload]

            return {
                ...state,
                events: eventsClone
            }

        case DELETE_TOUCH_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_TOUCH_EVENTS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //             Utilities                    //
        //                                          //
        // ======================================== //
        case 'UPDATE_TOUCH_EVENTS':
            return {
                ...state,
                events: deepCopy(action.payload.events)
            }

        default:
            return state


    }
}

export default eventsReducer