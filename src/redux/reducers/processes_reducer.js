import {
    GET_PROCESSES,
    GET_PROCESSES_STARTED,
    GET_PROCESSES_SUCCESS,
    GET_PROCESSES_FAILURE,

    POST_PROCESSES,
    POST_PROCESSES_STARTED,
    POST_PROCESSES_SUCCESS,
    POST_PROCESSES_FAILURE,

    PUT_PROCESSES,
    PUT_PROCESSES_STARTED,
    PUT_PROCESSES_SUCCESS,
    PUT_PROCESSES_FAILURE,

    DELETE_PROCESSES,
    DELETE_PROCESSES_STARTED,
    DELETE_PROCESSES_SUCCESS,
    DELETE_PROCESSES_FAILURE,
} from '../types/processes_types'

import { deepCopy } from '../../methods/utils/utils';

const defaultState = {
    processes: {},
    selectedProcesse: null,
}

const processesReducer = (state = defaultState, action) => {
    let processesClone = {}
    let currentProcesse = ''
    let updatedProcesseIndex = ''
    let index = ''

    switch (action.type) {

        // ======================================== //
        //                                          //
        //              Get Processes               //
        //                                          //
        // ======================================== //
        case GET_PROCESSES:
            break;

        case GET_PROCESSES_SUCCESS:
            return {
                ...state,
                processes: action.payload,
                pending: false,
            }

        case GET_PROCESSES_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_PROCESSES_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        // ======================================== //
        //                                          //
        //             Post Processes                 //
        //                                          //
        // ======================================== //
        case POST_PROCESSES:
            break;

        case POST_PROCESSES_SUCCESS:
            processesClone = deepCopy(state.processes)
            processesClone[action.payload._id.$oid] = action.payload

            return {
                ...state,
                processes: processesClone,
                pending: false
            }


        case POST_PROCESSES_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_PROCESSES_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //              Put Processes                 //
        //                                          //
        // ======================================== //
        case PUT_PROCESSES:
            break;

        case PUT_PROCESSES_SUCCESS:
            // Find the corresponding process and replace it with the new one
            currentProcesse = action.payload

            processesClone = deepCopy(state.processes)

            processesClone[currentProcesse._id] = currentProcesse

            return {
                ...state,
                processes: processesClone,
                pending: false
            }

        case PUT_PROCESSES_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case PUT_PROCESSES_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //           Delete Processes                 //
        //                                          //
        // ======================================== //
        case DELETE_PROCESSES:
            break;

        case DELETE_PROCESSES_SUCCESS:

            processesClone = deepCopy(state.processes)

            delete processesClone[action.payload]
            return {
                ...state,
                processes: processesClone
            }

        case DELETE_PROCESSES_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_PROCESSES_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //             Utilities                    //
        //                                          //
        // ======================================== //
        case 'UPDATE_PROCESSES':
            return {
                ...state,
                processes: deepCopy(action.payload.processes),
                // processes: action.payload.processes,
                d3: action.payload.d3,
            }

        case 'SET_SELECTED_PROCESS':
            return {
                ...state,
                selectedProcesse: action.payload

            }

        default:
            return state


    }
}

export default processesReducer