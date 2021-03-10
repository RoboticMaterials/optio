// This reducer is for api calls to local storage

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
  SET_TEMP_SIGN_IN_DATA,

} from '../types/local_types';
import {defaultLocalSettings} from "../../constants/local_settings_constants";


const defaultState = {
    loggers: {
        /*
        All: {
          enabled: false,
          level: 0,
          name: "All"
        },
        Dashboards: {
          enabled: false,
          level: 0,
          name: "Dashboards"
        },
        Scheduler: {
          enabled: false,
          level: 0,
          name: "Scheduler"
        },
        Tasks: {
          enabled: false,
          level: 0,
          name: "Tasks"
        },
        Objects: {
          enabled: false,
          level: 0,
          name: "Objects"
        },
        Api: {
          enabled: false,
          level: 0,
          name: "Api"
        },
        ReduxLogger: {
          enabled: false,
          level: 0,
          name: "ReduxLogger"
        }
        */
    },

    localSettings: defaultLocalSettings,

    devicesEnabled: false,
    disableAll: false,
    enableAll: false,
    loaded: false,
};

const localReducer = (state = defaultState, action) => {
    switch(action.type) {

    // ======================================== //
    //                                          //
    //              Get SETTINGS                //
    //                                          //
    // ======================================== //
        case GET_LOGGERS:
            break;

        case GET_LOGGERS_SUCCESS:
            return  {
                ...state,
                ...action.payload,
                loggers: {
                  ...state.loggers, ...action.payload.loggers
                },

                pending: false,
                loaded: true,
            }

        case GET_LOGGERS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false,
                loaded: true,
            });

        case GET_LOGGERS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

    // ======================================== //
    //                                          //
    //             Post LOGGERS                //
    //                                          //
    // ======================================== //
        case POST_LOGGERS:
            break;

        case POST_LOGGERS_SUCCESS:
            return{
                ...state,
                 ...action.payload,
                pending: false
            }

        case POST_LOGGERS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_LOGGERS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

    // ======================================== //
    //                                          //
    //          Get Local Settings              //
    //                                          //
    // ======================================== //
        case GET_LOCAL_SETTINGS:
            break

        case GET_LOCAL_SETTINGS_SUCCESS:
            return  {
                ...state,
                localSettings: action.payload,
                pending: false,
            }

        case GET_LOCAL_SETTINGS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_LOCAL_SETTINGS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

    // ======================================== //
    //                                          //
    //           Post Local Settings            //
    //                                          //
    // ======================================== //
        case POST_LOCAL_SETTINGS:
            break;

        case POST_LOCAL_SETTINGS_SUCCESS:
            return{
                ...state,
                localSettings: {
                    ...state.localSettings,
                    ...action.payload
                },
                pending: false
            }

        case POST_LOCAL_SETTINGS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_LOCAL_SETTINGS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

        case STOP_API_CALLS:
            return {
                ...state,
                stopAPICalls: action.payload,
            }



        // ~~~~~~~~~~~~~~~
        default:
            return {
                ...state
            }
    }

    return state
}

export default localReducer
