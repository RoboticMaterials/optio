import { normalize, schema } from 'normalizr';

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

import {
    DASHBOARD,
    DASHBOARDS
} from "../types/data_types"

import {
    SET
} from "../types/prefixes"

import {
    KICK_OFF_ENABLED
} from "../types/suffixes"

import * as api from '../../api/dashboards_api'
import { dashboardsSchema } from '../../normalizr/schema';


export const getDashboards = () => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: GET_DASHBOARDS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: GET_DASHBOARDS_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: GET_DASHBOARDS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const dashboards = await api.getDashboards();

            const normalizedDashboards = {}
            dashboards.map((dashboard) => {
                normalizedDashboards[dashboard._id.$oid] = dashboard
            })

            return onSuccess(normalizedDashboards)
            // return onSuccess(dashboards)
        } catch (error) {
            return onError(error)
        }
    }
}
export const postDashboard = (dashboard) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: POST_DASHBOARD_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: POST_DASHBOARD_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: POST_DASHBOARD_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            delete dashboard._id
            const newDashboard = await api.postDashboards(dashboard);
            return onSuccess(newDashboard)
        } catch (error) {
            return onError(error)
        }
    }
}
export const putDashboard = (dashboard, ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: PUT_DASHBOARD_STARTED });
        }
        function onSuccess(updatedDashboard) {
            dispatch({ type: PUT_DASHBOARD_SUCCESS, payload: updatedDashboard });
            return updatedDashboard;
        }
        function onError(error) {
            dispatch({ type: PUT_DASHBOARD_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            delete dashboard._id
            const updateDashboard = await api.putDashboards(dashboard, ID);
            return onSuccess(updateDashboard)
        } catch (error) {
            return onError(error)
        }
    }
}
export const deleteDashboard = (ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_DASHBOARD_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: DELETE_DASHBOARD_SUCCESS, payload: ID });
            return response;
        }
        function onError(error) {
            dispatch({ type: DELETE_DASHBOARD_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const removeDashboards = await api.deleteDashboards(ID);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}

export const dashboardOpen = (bol) => {
    return { type: DASHBOARD_OPEN, payload: bol }
}

export const setSelectedValueAttr = (dashboardId, kickOffEnabled) => {
    return { type: SET + DASHBOARD + KICK_OFF_ENABLED, payload: {dashboardId, kickOffEnabled} }
}
