import {
    GET_SETTINGS,
    GET_SETTINGS_STARTED,
    GET_SETTINGS_SUCCESS,
    GET_SETTINGS_FAILURE,

    POST_SETTINGS,
    POST_SETTINGS_STARTED,
    POST_SETTINGS_SUCCESS,
    POST_SETTINGS_FAILURE,
    DEVICE_ENABLED, PUT_SETTINGS, PUT_SETTINGS_SUCCESS, PUT_SETTINGS_FAILURE, PUT_SETTINGS_STARTED,

} from '../types/setting_types'

const defaultState = {
    settings: {
        timezone: null,
        loggers: {
            Dashboards: false,
            Scheduler: false,
            Tasks: false,
            Objects: false,
            ModelViewer: false,
            Api: false,
            ReduxLogger: false,
            All: false,
        },
        shiftDetails: {
            startOfShift: '07:00',
            endOfShift: '15:00',
            expectedOutput: null,
            breaks: {
                break1: {
                    enabled: false,
                    startOfBreak: '08:30',
                    endOfBreak: '9:00',
                },
                break2: {
                    enabled: false,
                    startOfBreak: '11:00',
                    endOfBreak: '12:00',
                },
                break3: {
                    enabled: false,
                    startOfBreak: '13:00',
                    endOfBreak: '14:00',
                },
            },
        },
    },

    error: {},
    pending: false,
    deviceEnabled: false,
    enableLogger: '',
    muteReducer: false,
    apiSim: false,

    mapApps: {
        heatmap: true
    }
}

export const mirUrl = (state = defaultState) => {
    return state.settings
}

const settingsReducer = (state = defaultState, action) => {
    switch (action.type) {

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
            return {
                ...state,
                settings: {
                    ...state.settings,
                    ...action.payload,
                    loggers: { ...state.settings.loggers, ...action.payload.loggers },
                },
                pending: false,
            }

        case GET_SETTINGS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_SETTINGS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });


        // ======================================== //
        //                                          //
        //             PUT SETTINGS                //
        //                                          //
        // ======================================== //
        case PUT_SETTINGS:
            break;

        case PUT_SETTINGS_SUCCESS:
            return {
                ...state,
                settings: { ...state.settings, ...action.payload },
                pending: false,

            }

        case PUT_SETTINGS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case PUT_SETTINGS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~
        // ======================================== //
        //                                          //
        //             Post SETTINGS                //
        //                                          //
        // ======================================== //
        case POST_SETTINGS:
            break;

        case POST_SETTINGS_SUCCESS:
            return {
                ...state,
                settings: { ...state.settings, ...action.payload },
                pending: false,

            }

        case POST_SETTINGS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_SETTINGS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        default:
            return {
                ...state
            }
    }
    return state
}

export default settingsReducer
