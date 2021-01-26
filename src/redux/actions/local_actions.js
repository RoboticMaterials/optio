// These actions are used for local API calls to local storage

import {
  GET_LOGGERS,
  GET_LOGGERS_STARTED,
  GET_LOGGERS_SUCCESS,
  GET_LOGGERS_FAILURE,

  POST_LOGGERS,
  POST_LOGGERS_STARTED,
  POST_LOGGERS_SUCCESS,
  POST_LOGGERS_FAILURE,

  GET_LOCAL_SETTINGS,
  GET_LOCAL_SETTINGS_STARTED,
  GET_LOCAL_SETTINGS_SUCCESS,
  GET_LOCAL_SETTINGS_FAILURE,

  POST_LOCAL_SETTINGS,
  POST_LOCAL_SETTINGS_STARTED,
  POST_LOCAL_SETTINGS_SUCCESS,
  POST_LOCAL_SETTINGS_FAILURE,

  STOP_API_CALLS,

} from '../types/local_types';

import * as api from '../../api/local_api';

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
export const postLoggers =  (loggers, loaded) => {
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

          if(loaded) {
              const newLoggers = await api.postLoggers(loggers);
              return await onSuccess(newLoggers);
          } else {
              return await onSuccess(loggers);
          }


      } catch(error) {
          return onError(error)
      }
  }
}

export const getLocalSettings = () => {
  return async dispatch => {
      function onStart() {
          dispatch({ type: GET_LOCAL_SETTINGS_STARTED });
        }
        function onSuccess(response) {
          dispatch({ type: GET_LOCAL_SETTINGS_SUCCESS, payload: response });
          return response;
        }
        function onError(error) {
          dispatch({ type: GET_LOCAL_SETTINGS_FAILURE, payload: error });
          return error;
        }

      try {
          onStart();
          const localSettings = await api.getLocalSettings();
          return onSuccess(localSettings)
      } catch(error) {
          return onError(error)
      }
  }
}

export const postLocalSettings =  (settings) => {
  return async dispatch => {
        async function onStart() {
          dispatch({ type: POST_LOCAL_SETTINGS_STARTED });
        }
        async function onSuccess(response) {
          dispatch({ type: POST_LOCAL_SETTINGS_SUCCESS, payload: settings });
          return response;
        }
        async function onError(error) {
          dispatch({ type: POST_LOCAL_SETTINGS_FAILURE, payload: error });
          return error;
        }

      try {
          onStart();
          const localSettings = await api.postLocalSettings(settings);
          return await onSuccess(localSettings)
      } catch(error) {
          return onError(error)
      }
  }
}

export const stopAPICalls = (bool) => {
    return { type: STOP_API_CALLS, payload: bool }
}
