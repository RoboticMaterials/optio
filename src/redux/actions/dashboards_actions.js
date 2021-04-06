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

import uuid from 'uuid'

import * as api from '../../api/dashboards_api'
import { dashboardsSchema } from '../../normalizr/schema';
import {getLoadStationId, getRouteProcesses, getUnloadStationId} from "../../methods/utils/route_utils";
import {willRouteDeleteBreakProcess} from "../../methods/utils/processes_utils";
import {putProcesses, setSelectedProcess} from "./processes_actions";
import {deleteTask} from "./tasks_actions";
import {deepCopy} from "../../methods/utils/utils";
import {useSelector} from "react-redux";
import * as stationActions from "./stations_actions";
import {getDefaultStation} from "../../methods/utils/station_utils";
import {removeArrayIndices} from "../../methods/utils/array_utils";
import {ROUTE_TYPES} from "../../constants/route_constants";
import {TYPES} from "../../components/widgets/widget_pages/dashboards_page/dashboards_sidebar/dashboards_sidebar";
import {DASHBOARD_BUTTON_COLORS} from "../../constants/dashboard_contants";


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
            console.log(error)

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
    const dashbaordCopy = deepCopy(dashboard)
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
            delete dashbaordCopy._id
            const updateDashboard = await api.putDashboards(dashbaordCopy, ID);
            return onSuccess(updateDashboard)
        } catch (error) {
            return onError(error)
        }
    }
}

export const putDashboardAttributes = (attributes, id) => {

    return async (dispatch, getState) => {

        const state = getState()
        const dashboards = state.dashboardsReducer.dashboards || {}

        const dashboard = dashboards[id]

        dispatch(putDashboard({
            ...dashboard,
            ...attributes
        }, id))
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
                dashboard.station === selectedTask?.load?.station || dashboard.station === selectedTask?.unload?.station
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

// automatically adds a button for a route to its load station's dashboard
// ******************************
export const addRouteToDashboards = (route) => {
    return async (dispatch, getState) => {

        // current state
        const state = getState()
        const dashboards = state.dashboardsReducer.dashboards || {}
        const stations = state.stationsReducer.stations || {}

        const {
            _id: routeId,
            type: routeType,
            name: routeName
        } = route

        // get station for route button (load if push, unload if pull)
        let stationId
        if(routeType === ROUTE_TYPES.PULL) {
            stationId = getUnloadStationId(route)
        }
        else {
            stationId = getLoadStationId(route)
        }

        const station = stations[stationId] || getDefaultStation()
        const dashboard = dashboards[station.dashboards[0]]

        const newDashboardButton = {
            color: '#bcbcbc',
            id: uuid.v4(),
            name: "",
            task_id: routeId,
            type: TYPES.ROUTES.key,
        }

        if (dashboard === undefined) {
            const defaultDashboard = {
                name: "",
                locked: false,
                buttons: [newDashboardButton],
                station: station._id
            }
            const postDashboardPromise = dispatch(postDashboard(defaultDashboard))
            postDashboardPromise.then(async postedDashboard => {
                alert('Added dashboard to location. There already should be a dashboard tied to this location, so this is an temp fix')
                await dispatch(stationActions.putStation({
                    ...station,
                    dashboards: [postedDashboard._id.$oid]
                }, station._id))

            })
        }

        else {
            // see if button for task already exists
            const buttonIndex = dashboard.buttons.findIndex((currButton) => {
                return currButton.task_id === route._id
            })

            // only add button if it isn't already in the dashboard
            if(buttonIndex === -1) {
                dispatch(putDashboard({
                    ...dashboard,
                    buttons: [...dashboard.buttons, newDashboardButton]
                }, dashboard._id.$oid))
            }

        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// automatically removes a button that was added to a dashboard but no longer belongs to it
// ******************************
export const removeRouteFromWrongDashboards = (route) => {
    return async (dispatch, getState) => {

        // current state
        const state = getState()
        const dashboards = Object.values(state.dashboardsReducer.dashboards) || []

        const {
            _id: routeId,
            type: routeType
        } = route

        // get station id for route (load for push, unload for pull)
        let stationId
        if(routeType === ROUTE_TYPES.PULL) {
            // if pull type, button should be at unload station
            stationId = getUnloadStationId(route)
        }

        else {
            // if push type, button should be at load station
            stationId = getLoadStationId(route)
        }

        dashboards.forEach((currDashboard) => {
            const {
                buttons: currDashboardButtons = [],
                _id: currDashboardIdObj = {},
                station: currStationId
            } = currDashboard

            const {
                $oid: currDashboardId
            } = currDashboardIdObj

            // curr dashboard isn't the route's load station
            if(currStationId !== stationId) {

                // loop through each button and check if the button needs to be removed
                const filteredButtons = currDashboardButtons.filter((currButton, currButtonIndex) => {
                    const {
                        task_id: currRouteId
                    } = currButton

                    return(currRouteId !== routeId) // if dashboard isn't at the right station for the route, filter out buttons for this route
                })

                // if length of buttons arr changed, a button was removed, so update
                // otherwise nothing was removed, so need for update
                if(filteredButtons.length !== currDashboardButtons.length) {
                    // update the dashboard
                    dispatch(putDashboard({
                        ...currDashboard,
                        buttons: filteredButtons
                    }, currDashboardId))
                }

            }
        })
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
