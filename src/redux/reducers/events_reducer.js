import {
    GET_EVENTS,
    GET_EVENTS_STARTED,
    GET_EVENTS_SUCCESS,
    GET_EVENTS_FAILURE,

    POST_EVENTS,
    POST_EVENTS_STARTED,
    POST_EVENTS_SUCCESS,
    POST_EVENTS_FAILURE,

    PUT_EVENTS,
    PUT_EVENTS_STARTED,
    PUT_EVENTS_SUCCESS,
    PUT_EVENTS_FAILURE,

    DELETE_EVENTS,
    DELETE_EVENTS_STARTED,
    DELETE_EVENTS_SUCCESS,
    DELETE_EVENTS_FAILURE,
} from '../types/events_types'

import { clone_object, deepCopy } from '../../methods/utils/utils';

const defaultState = {
    events: {},
}

const eventsReducer = (state = defaultState, action) => {
    let eventsClone = {}
    let currentEvent = ''
    let updatedEventIndex = ''
    let index = ''


    switch (action.type) {

        // ======================================== //
        //                                          //
        //              Get Events                 //
        //                                          //
        // ======================================== //
        case GET_EVENTS:
            break;

        case GET_EVENTS_SUCCESS:


            return {
    
                ...state,
                events: { ...action.payload },
                pending: false,
            }


        case GET_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_EVENTS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        // ======================================== //
        //                                          //
        //             Post Events                 //
        //                                          //
        // ======================================== //
        case POST_EVENTS:
            break;

        case POST_EVENTS_SUCCESS:

            eventsClone = deepCopy(state.events)

            eventsClone[action.payload._id.$oid] = action.payload

            return {
                ...state,
                events: eventsClone,
                pending: false
            }


        case POST_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_EVENTS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //              Put Events              //
        //                                          //
        // ======================================== //
        case PUT_EVENTS:
            break;

        case PUT_EVENTS_SUCCESS:
            // Find the corresponding event and replace it with the new one
            currentEvent = JSON.parse(action.payload)

            eventsClone = deepCopy(state.events)

            eventsClone[currentEvent._id.$oid] = currentEvent

            return {
                ...state,
                events: { ...eventsClone }
            }

        case PUT_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case PUT_EVENTS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //           Delete Events                 //
        //                                          //
        // ======================================== //
        case DELETE_EVENTS:
            break;

        case DELETE_EVENTS_SUCCESS:

            eventsClone = deepCopy(state.events)

            delete eventsClone[action.payload]

            return {
                ...state,
                events: eventsClone
            }

        case DELETE_EVENTS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_EVENTS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //             Utilities                    //
        //                                          //
        // ======================================== //
        case 'UPDATE_EVENTS':
            return {
                ...state,
                events: deepCopy(action.payload.events)
            }

        default:
            return state


    }
}

export default eventsReducer