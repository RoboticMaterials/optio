import {
    GET_SETTINGS,
    GET_SETTINGS_STARTED,
    GET_SETTINGS_SUCCESS,
    GET_SETTINGS_FAILURE,

    POST_SETTINGS,
    POST_SETTINGS_STARTED,
    POST_SETTINGS_SUCCESS,
    POST_SETTINGS_FAILURE,
    DEVICE_ENABLED,

  } from '../types/setting_types'

const defaultState = {
    settings: {
        loggers: {
            Dashboards: false,
            Scheduler: false,
            Tasks: false,
            Objects: false,
            ModelViewer: false,
            Api: false,
            ReduxLogger: false,
            All: false,
        }
    },

    error: {},
    pending: false,
    enableLogger: '',
    muteReducer: false,
    deviceEnabled: false,
    apiSim: false,
}

// import { deepCoppy } from '../../methods/utils/utils'

export const mirUrl = (state = defaultState) => {
    return state.settings
}

const settingsReducer = (state = defaultState, action) => {
    switch(action.type) {

        case 'apiSim':
            return {
                ...state,
                apiSim: action.payload
            }

        case DEVICE_ENABLED:
            return {
                ...state,
                deviceEnabled: action.payload,
            };

    // ======================================== //
    //                                          //
    //              Get SETTINGS                //
    //                                          //
    // ======================================== //
        case GET_SETTINGS:
            break;

        case GET_SETTINGS_SUCCESS:
            return  {
                ...state,
                settings: {
                  ...state.settings,
                  ...action.payload,
                  loggers: {...state.settings.loggers, ...action.payload.loggers},
                },
                pending: false,
            }

        case GET_SETTINGS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_SETTINGS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

    // ======================================== //
    //                                          //
    //             Post SETTINGS                //
    //                                          //
    // ======================================== //
        case POST_SETTINGS:
            break;

        case POST_SETTINGS_SUCCESS:
            return{
                ...state,
                settings: {...state.settings, ...action.payload},
                pending: false,

            }

        case POST_SETTINGS_FAILURE:
        return Object.assign({}, state, {
            error: action.payload,
            pending: false
        });

        case POST_SETTINGS_STARTED:
        return  Object.assign({}, state, {
            pending: true
        });
        // ~~~~~~~~~~~~~~~
    }
    return state
}

export default settingsReducer
