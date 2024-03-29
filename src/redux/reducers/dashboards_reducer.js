import {
    GET_DASHBOARDS,
    GET_DASHBOARDS_STARTED,
    GET_DASHBOARDS_SUCCESS,
    GET_DASHBOARDS_FAILURE,

    POST_DASHBOARD,
    POST_DASHBOARD_STARTED,
    POST_DASHBOARD_SUCCESS,
    POST_DASHBOARD_FAILURE,

    PUT_DASHBOARD,
    PUT_DASHBOARD_STARTED,
    PUT_DASHBOARD_SUCCESS,
    PUT_DASHBOARD_FAILURE,

    DELETE_DASHBOARD,
    DELETE_DASHBOARD_STARTED,
    DELETE_DASHBOARD_SUCCESS,
    DELETE_DASHBOARD_FAILURE,

    DASHBOARD_OPEN,
} from '../types/dashboards_types'

import { deepCopy } from '../../methods/utils/utils';
import {SET} from "../types/prefixes";
import {DASHBOARD} from "../types/data_types";
import {FINISH_ENABLED, KICK_OFF_ENABLED} from "../types/suffixes";


const defaultState = {

    dashboards: null,
    kickOffEnabledDashboards: {}, // key = dashboard id - value = list of processes where the processes first station is the same as the dashboard's station
    finishEnabledDashboards: {}, // key = dashboard id - value = list of processes where the processes first station is the same as the dashboard's station

    error: {},
    pending: false,

    dashboardOpen: false,
};

export default function dashboardsReducer(state = defaultState, action) {
    let dashboardsCopy = {}

    switch (action.type) {

        case SET + DASHBOARD + KICK_OFF_ENABLED: {
            const {
                dashboardId,
                kickOffEnabled
            } = action.payload

            return {
                ...state,
                kickOffEnabledDashboards: {...state.kickOffEnabledDashboards, [dashboardId]: kickOffEnabled},
            }
        }


        case SET + DASHBOARD + FINISH_ENABLED: {
            const {
                dashboardId,
                finishEnabled
            } = action.payload

            return {
                ...state,
                finishEnabledDashboards: {...state.finishEnabledDashboards, [dashboardId]: finishEnabled},
            }
        }



        case DASHBOARD_OPEN:
            return {
                ...state,
                dashboardOpen: action.payload
            }

        // ======================================== //
        //                                          //
        //              Get Dashboards              //
        //                                          //
        // ======================================== //
        case GET_DASHBOARDS:
            break;

        case GET_DASHBOARDS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_DASHBOARDS_SUCCESS:
            dashboardsCopy = deepCopy(action.payload)
            return {
                ...state,
                dashboards: action.payload,
                pending: false
            }

        case GET_DASHBOARDS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ======================================== //
        //                                          //
        //             Post Dashboards               //
        //                                          //
        // ======================================== //

        case POST_DASHBOARD:
            break;

        case POST_DASHBOARD_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case POST_DASHBOARD_SUCCESS:
            return {
                ...state,
                dashboards: {...state.dashboards, [action.payload._id.$oid]: action.payload},
                pending: false,

            }

        case POST_DASHBOARD_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ======================================== //
        //                                          //
        //             Put Dashboards                //
        //                                          //
        // ======================================== //

        case PUT_DASHBOARD:
            break;

        case PUT_DASHBOARD_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case PUT_DASHBOARD_SUCCESS:

            return {
                ...state,
                dashboards: {...state.dashboards, [action.payload._id.$oid]: action.payload},
            }

        case PUT_DASHBOARD_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_DASHBOARD:
            break;

        case DELETE_DASHBOARD_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case DELETE_DASHBOARD_SUCCESS:
            dashboardsCopy = deepCopy(state.dashboards)

            delete dashboardsCopy[action.payload]

            return {
                ...state,
                dashboards: dashboardsCopy
            }

        case DELETE_DASHBOARD_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });


        default:
            return state;
    }
}
