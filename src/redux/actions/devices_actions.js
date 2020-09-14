import { normalize, schema } from 'normalizr';

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

import * as api from '../../api/devices_api'
import { devicesSchema } from '../../normalizr/schema';


export const getDevices = () => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: GET_DEVICES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: GET_DEVICES_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: GET_DEVICES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const devices = await api.getDevices();
            devices.forEach((device, ind) => {
                devices[ind].position.pos_x = device.position.x
                devices[ind].position.pos_y = device.position.y
            })

            // Uncomment when you want to make devices an object
            const normalizedDevices = normalize(devices, devicesSchema);

            return onSuccess(normalizedDevices.entities.devices)
            // return onSuccess(devices)
        } catch (error) {
            return onError(error)
        }
    }
}
export const postDevices = (devices) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: POST_DEVICES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: POST_DEVICES_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: POST_DEVICES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const newDevices = await api.postDevices(devices);
            return onSuccess(newDevices)
        } catch (error) {
            return onError(error)
        }
    }
}
export const putDevices = (device, ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: PUT_DEVICES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: PUT_DEVICES_SUCCESS, payload: response.data });
            return response;
        }
        function onError(error) {
            dispatch({ type: PUT_DEVICES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const updateDevices = await api.putDevices(device, ID);
            return onSuccess(updateDevices)
        } catch (error) {
            return onError(error)
        }
    }
}
export const deleteDevices = (ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_DEVICES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: DELETE_DEVICES_SUCCESS, payload: ID });
            return response;
        }
        function onError(error) {
            dispatch({ type: DELETE_DEVICES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const removeDevices = await api.deleteDevices(ID);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}

export const updateDevices = (devices) => {
    return { type: 'UPDATE_DEVICES', payload: { devices } }
}
