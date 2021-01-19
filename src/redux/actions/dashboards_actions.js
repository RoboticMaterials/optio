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
    KICK_OFF_ENABLED,
    FINISH_ENABLED
} from "../types/suffixes"

import * as api from '../../api/dashboards_api'
import { dashboardsSchema } from '../../normalizr/schema';
import {getLoadStationId, getRouteProcesses} from "../../methods/utils/route_utils";
import {willRouteDeleteBreakProcess} from "../../methods/utils/processes_utils";
import {putProcesses, setSelectedProcess} from "./processes_actions";
import {deleteTask} from "./tasks_actions";
import {deepCopy} from "../../methods/utils/utils";
import {useSelector} from "react-redux";
import * as stationActions from "./stations_actions";


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

// deletes all buttons with routeId from all dashboards
// ******************************
export const removeRouteFromAllDashboards = (routeId) => {
    return async (dispatch, getState) => {

        // current state
        const state = getState()

        const dashboards = state.dashboardsReducer.dashboards || {}
        const routes = state.tasksReducer.tasks || {}
        const selectedTask = routes[routeId] || {}

        // Delete all dashboard buttons associated with that task
        Object.values(dashboards)
            .filter(dashboard =>
                dashboard.station == selectedTask.load.station || dashboard.station == selectedTask?.unload?.station
            ).forEach(currDashboard => {
                var currButtons = [...currDashboard.buttons]

                currButtons = currButtons.filter(button => button.task_id !== routeId)

                // update dashboard
                dispatch(putDashboard({
                    ...currDashboard,
                    buttons: currButtons
                }, currDashboard._id.$oid))
            }
        )

    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// deletes all buttons with routeId from all dashboards
// ******************************
export const addRouteToDashboards = (route) => {
    return async (dispatch, getState) => {

        // current state
        const state = getState()

        const dashboards = state.dashboardsReducer.dashboards || {}
        const routes = state.tasksReducer.tasks || {}
        const stations = state.locationsReducer.stations || {}

        // Add the task automatically to the associated load station dashboard
        // Since as of now the only type of task we are doing is push, only need to add it to the load location
        const loadStation = stations[getLoadStationId(route)]


        const dashboard = dashboards[loadStation.dashboards[0]]

        const newDashboardButton = {
            color: '#bcbcbc',
            id: selectedTask._id,
            name: selectedTask.name,
            task_id: selectedTask._id
        }

        if (dashboard === undefined) {
            const defaultDashboard = {
                name: updatedStation.name + ' Dashboard',
                buttons: [newDashboardButton],
                station: updatedStation._id
            }
            const postDashboardPromise = postDashboard(defaultDashboard)
            postDashboardPromise.then(async postedDashboard => {
                alert('Added dashboard to location. There already should be a dashboard tied to this location, so this is an temp fix')
                await stationActions.putStation({
                    ...loadStation,
                    dashboards: [postedDashboard._id.$oid]
                }, loadStation._id)

            })
        }

        else {
            const buttonIndex = dashboard.buttons.findIndex((currButton) => {
                return currButton.task_id === route._id
            })

            // only add button if it isn't already in the dashboard
            if(buttonIndex === -1) {
                putDashboard({
                    ...dashboard,
                    buttons: [...dashboard.buttons, newDashboardButton]
                }, dashboard._id.$oid)
            }

        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const dashboardOpen = (bol) => {
    return { type: DASHBOARD_OPEN, payload: bol }
}

export const setDashboardKickOffProcesses = (dashboardId, kickOffEnabled) => {
    return { type: SET + DASHBOARD + KICK_OFF_ENABLED, payload: {dashboardId, kickOffEnabled} }
}

export const setDashboardFinishProcesses = (dashboardId, finishEnabled) => {
    return { type: SET + DASHBOARD + FINISH_ENABLED, payload: {dashboardId, finishEnabled} }
}