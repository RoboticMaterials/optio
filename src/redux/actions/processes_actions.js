import { normalize, schema } from 'normalizr';

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

import * as api from '../../api/processes_api'
import { processesSchema } from '../../normalizr/schema';
import { deepCopy } from '../../methods/utils/utils'


export const getProcesses = () => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: GET_PROCESSES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: GET_PROCESSES_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: GET_PROCESSES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const processes = await api.getProcesses();
            // Uncomment when you want to make processes an object
            const normalizedProcesses = normalize(processes, processesSchema);
            if (normalizedProcesses.entities.processes === undefined) {
                return onSuccess(normalizedProcesses.entities)
            }
            else{
                return onSuccess(normalizedProcesses.entities.processes)
            }
        } catch (error) {
            return onError(error)
        }
    }
}
export const postProcesses = (process) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: POST_PROCESSES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: POST_PROCESSES_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: POST_PROCESSES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            delete process.new
            const newProcesses = await api.postProcesses(process);
            return onSuccess(newProcesses)
        } catch (error) {
            return onError(error)
        }
    }
}
export const putProcesses = (process) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: PUT_PROCESSES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: PUT_PROCESSES_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: PUT_PROCESSES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const ID = deepCopy(process._id)
            // delete process._id
            const updateProcesses = await api.putProcesses(process, ID);
            return onSuccess(updateProcesses)
        } catch (error) {
            return onError(error)
        }
    }
}
export const deleteProcesses = (ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_PROCESSES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: DELETE_PROCESSES_SUCCESS, payload: ID });
            return response;
        }
        function onError(error) {
            dispatch({ type: DELETE_PROCESSES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const removeProcesses = await api.deleteProcesses(ID);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}

export const updateProcesses = (processes, d3) => {
    return { type: 'UPDATE_PROCESSES', payload: { processes, d3 } }
}

export const setSelectedProcess = (process) => {
    return { type: 'SET_SELECTED_PROCESS', payload: process }
}
