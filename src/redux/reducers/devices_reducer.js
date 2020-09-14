import {
    GET_DEVICES,
    GET_DEVICES_STARTED,
    GET_DEVICES_SUCCESS,
    GET_DEVICES_FAILURE,

    POST_DEVICES,
    POST_DEVICES_STARTED,
    POST_DEVICES_SUCCESS,
    POST_DEVICES_FAILURE,

    PUT_DEVICES,
    PUT_DEVICES_STARTED,
    PUT_DEVICES_SUCCESS,
    PUT_DEVICES_FAILURE,

    DELETE_DEVICES,
    DELETE_DEVICES_STARTED,
    DELETE_DEVICES_SUCCESS,
    DELETE_DEVICES_FAILURE,
} from '../types/devices_types'

import { clone_object, deepCopy } from '../../methods/utils/utils';

const defaultState = {
    devices: {},
}

const devicesReducer = (state = defaultState, action) => {
    let devicesClone = {}
    let currentDevice = ''
    let updatedDeviceIndex = ''
    let index = ''


    switch (action.type) {

        // ======================================== //
        //                                          //
        //              Get Devices                 //
        //                                          //
        // ======================================== //
        case GET_DEVICES:
            break;

        case GET_DEVICES_SUCCESS:


            return {
    
                ...state,
                devices: { ...action.payload },
                pending: false,
            }


        case GET_DEVICES_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_DEVICES_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        // ======================================== //
        //                                          //
        //             Post Devices                 //
        //                                          //
        // ======================================== //
        case POST_DEVICES:
            break;

        case POST_DEVICES_SUCCESS:

            devicesClone = deepCopy(state.devices)

            devicesClone[action.payload._id.$oid] = action.payload

            return {
                ...state,
                devices: devicesClone,
                pending: false
            }


        case POST_DEVICES_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_DEVICES_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //              Put Devices              //
        //                                          //
        // ======================================== //
        case PUT_DEVICES:
            break;

        case PUT_DEVICES_SUCCESS:
            // Find the corresponding device and replace it with the new one
            currentDevice = JSON.parse(action.payload)

            devicesClone = deepCopy(state.devices)

            devicesClone[currentDevice._id.$oid] = currentDevice

            return {
                ...state,
                devices: { ...devicesClone }
            }

        case PUT_DEVICES_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case PUT_DEVICES_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //           Delete Devices                 //
        //                                          //
        // ======================================== //
        case DELETE_DEVICES:
            break;

        case DELETE_DEVICES_SUCCESS:

            devicesClone = deepCopy(state.devices)

            delete devicesClone[action.payload]

            return {
                ...state,
                devices: devicesClone
            }

        case DELETE_DEVICES_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_DEVICES_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // ======================================== //
        //                                          //
        //             Utilities                    //
        //                                          //
        // ======================================== //
        case 'UPDATE_DEVICES':
            return {
                ...state,
                devices: deepCopy(action.payload.devices)
            }

        default:
            return state


    }
}

export default devicesReducer