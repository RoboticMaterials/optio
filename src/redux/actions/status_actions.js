import { normalize, schema } from 'normalizr';
import {
    GET_STATUS,
    GET_STATUS_STARTED,
    GET_STATUS_SUCCESS,
    GET_STATUS_FAILURE,

    POST_STATUS,
    POST_STATUS_STARTED,
    POST_STATUS_SUCCESS,
    POST_STATUS_FAILURE,
} from '../types/status_types';

import { statusSchema, statusesSchema } from '../../normalizr/status_schema';
import * as api from '../../api/status_api'


// get
// ******************************
export const getStatus = () => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: GET_STATUS_STARTED });
        }
        function onSuccess(status) {
            dispatch({ type: GET_STATUS_SUCCESS, payload: status });
            return status;
        }
        function onError(error) {
            dispatch({ type: GET_STATUS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const status = await api.getStatus();
            //const normalizedStatus = normalize(status, statusesSchema);
            //console.log('normalizedStatus',normalizedStatus)


            return onSuccess(status);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// For some reason, this function does not execute the dispatch function. Have no idea why...
export const postStatus = (status) => {

    return async dispatch => {

        function onStart() {
            dispatch({ type: POST_STATUS_STARTED });
        }

        function onSuccess(response) {
            dispatch({ type: POST_STATUS_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: POST_STATUS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();

            // currently the backend just returns the status code
            // if backend returns new status object, newStatus should be passed to onSuccess instead of status
            const response = await api.postStatus(status);
            return onSuccess(status)

        } catch (error) {
            return onError(error)
        }
    }
}
