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
    EDITING_PROCESS,
} from '../types/processes_types'

import * as api from '../../api/data_stream_api'
import { processesSchema } from '../../normalizr/schema';


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
            const dataStream = await api.getDataStream();
            // Uncomment when you want to make processes an object
            // const normalizedProcesses = normalize(processes, processesSchema);

            return console.log('QQQQ data stream', dataStream)
            if (normalizedProcesses.entities.processes === undefined) {
                return onSuccess(normalizedProcesses.entities)
            }
            else {
                return onSuccess(normalizedProcesses.entities.processes)
            }
        } catch (error) {
            return onError(error)
        }
    }
}
