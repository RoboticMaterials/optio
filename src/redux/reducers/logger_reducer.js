import {
  GET_LOGGERS,
  GET_LOGGERS_STARTED,
  GET_LOGGERS_SUCCESS,
  GET_LOGGERS_FAILURE,
  POST_LOGGERS,
  POST_LOGGERS_STARTED,
  POST_LOGGERS_SUCCESS,
  POST_LOGGERS_FAILURE,
} from "../types/logger_types";

const defaultState = {
  loggers: {},

  disableAll: false,
  enableAll: false,
  loaded: false,
};

const loggerReducer = (state = defaultState, action) => {
  switch (action.type) {
    // ======================================== //
    //                                          //
    //              Get SETTINGS                //
    //                                          //
    // ======================================== //
    case GET_LOGGERS:
      break;

    case GET_LOGGERS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loggers: {
          ...state.loggers,
          ...action.payload.loggers,
        },

        pending: false,
        loaded: true,
      };

    case GET_LOGGERS_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        pending: false,
      });

    case GET_LOGGERS_STARTED:
      return Object.assign({}, state, {
        pending: true,
      });

    // ======================================== //
    //                                          //
    //             Post LOGGERS                //
    //                                          //
    // ======================================== //
    case POST_LOGGERS:
      break;

    case POST_LOGGERS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        pending: false,
      };

    case POST_LOGGERS_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        pending: false,
      });

    case POST_LOGGERS_STARTED:
      return Object.assign({}, state, {
        pending: true,
      });
    // ~~~~~~~~~~~~~~~
  }
  return state;
};

export default loggerReducer;
