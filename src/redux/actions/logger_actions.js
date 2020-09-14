import {
  GET_LOGGERS,
  GET_LOGGERS_STARTED,
  GET_LOGGERS_SUCCESS,
  GET_LOGGERS_FAILURE,

  POST_LOGGERS,
  POST_LOGGERS_STARTED,
  POST_LOGGERS_SUCCESS,
  POST_LOGGERS_FAILURE,

} from '../types/logger_types';

import * as api from '../../api/logger_api_local';

// import logger
import log from '../../logger.js';

const logger = log.getLogger("Actions", "Redux");

export const getLoggers = () => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: GET_LOGGERS_STARTED });
          }
          function onSuccess(response) {
            dispatch({ type: GET_LOGGERS_SUCCESS, payload: response });
            return response;
          }
          function onError(error) {
            dispatch({ type: GET_LOGGERS_FAILURE, payload: error });
            return error;
          }

        try {
            onStart();
            const loggers = await api.getLoggers();

            return onSuccess(loggers)
        } catch(error) {
            return onError(error)
        }
    }
}
export const postLoggers =  (loggers) => {
  return async dispatch => {
        async function onStart() {
          dispatch({ type: POST_LOGGERS_STARTED });
        }
        async function onSuccess(response) {
          dispatch({ type: POST_LOGGERS_SUCCESS, payload: loggers });
          return response;
        }
        async function onError(error) {
          dispatch({ type: POST_LOGGERS_FAILURE, payload: error });
          return error;
        }

      try {
          onStart();
          const newLoggers = await api.postLoggers(loggers);
          return await onSuccess(newLoggers)
      } catch(error) {
          return onError(error)
      }
  }
}
