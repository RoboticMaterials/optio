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
    EDITING_PROCESS,
} from '../types/processes_types'

import { deepCopy } from '../../methods/utils/utils';

const defaultState = {
    // processes: {'qqq':{
    //     id: 'qqq',
    //     name: 'Fakey McFake Fake',
    //     routes: [
    //         "5fa06a9dfacd1af9a74c1925",
    //         "5fa06aa4facd1af9a74c1926",
    //         "5fa06ac3facd1af9a74c1927",
    //     ],
    // },},
    processes: {},
    selectedProcess: null,
    fixingProcess: false,
}

const processesReducer = (state = defaultState, action) => {
    let processesClone = {}

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
            processesClone[action.payload._id] = action.payload

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
            return {
                ...state,
                processes: {
                    ...state.processes,
                    [action.payload._id]: action.payload
                },
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
                selectedProcess: action.payload

            }

        case EDITING_PROCESS:
            return {
                ...state,
                editingProcess: action.payload,
            }

        case 'SET_FIXING_PROCESS':
            return {
                ...state,
                fixingProcess: action.payload
            }

        default:
            return state


    }
}

export default processesReducer
