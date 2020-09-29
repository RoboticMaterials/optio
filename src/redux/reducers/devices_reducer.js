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

import { deepCopy, isEquivalent } from '../../methods/utils/utils';
import { convertRealToD3 } from '../../methods/utils/map_utils'

const defaultState = {
    devices: {},
    d3: null,
    selectedDevice: null,
}

const devicesReducer = (state = defaultState, action) => {
    let devicesClone = {}
    let currentDevice = ''
    let updatedDeviceIndex = ''
    let index = ''

    // ======================================== //
    //                                          //
    //         DEVICE UTILITY FUNCTIONS         //
    //                                          //
    // ======================================== //
    const setDevices = (devices) => {

        // What this does is update the devices X and Y positions based on the values in the backend.
        // When the RMStudio initially loads, the devices X and Y is calculated in the map_view container, but those values aren't put to the backend.
        // When a get call is made, the state.devices is overwritten with the backend data (data without X and Y coords). This removes the device from the map view, which we dont want.
        // This function takes care of that and adds new X and Y coordinates on every get call. state.d3 is added in mapview
        if (!isEquivalent(devices, state.devices)) {
            devicesClone = deepCopy(devices)

            Object.keys(devicesClone).map((key, ind) => {
                const updatedDevice = devices[key]
                if (updatedDevice.position !== undefined) {

                    // On page load, the d3 state will be null. This is here so that devices wont be undifened on page load
                    if (state.d3 === null) {
                        devicesClone[key] = {
                            ...devicesClone[key],
                            position: {
                                ...devicesClone[key].position,
                                x: updatedDevice.position.pos_x,
                                y: updatedDevice.position.pos_y,
                            }
                        }
                    }

                    else {
                        let [x, y] = convertRealToD3([updatedDevice.position.pos_x, updatedDevice.position.pos_y], state.d3)
                        devicesClone[key] = {
                            ...devicesClone[key],
                            position: {
                                ...devicesClone[key].position,
                                x: x,
                                y: y,
                            }
                        }
                    }
                }
                return devicesClone
            })
        } else {
            return devices
        }
        return {
            ...state,
            devices: { ...devicesClone },
            pending: false,
        }
    }


    switch (action.type) {

        // ======================================== //
        //                                          //
        //              Get Devices                 //
        //                                          //
        // ======================================== //
        case GET_DEVICES:
            break;

        case GET_DEVICES_SUCCESS:
            return setDevices(action.payload)

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
            currentDevice = action.payload

            devicesClone = deepCopy(state.devices)

            devicesClone[currentDevice._id] = currentDevice

            return setDevices(devicesClone)

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
                devices: deepCopy(action.payload.devices),
                d3: action.payload.d3,
            }

        case 'SET_SELECTED_DEVICE':
            return {
                ...state,
                selectedDevice: action.payload

            }

        default:
            return state


    }
}

export default devicesReducer