import { normalize, schema } from 'normalizr';

import {
    GET_PROCESSES,
    GET_PROCESSES_STARTED,
    GET_PROCESSES_SUCCESS,
    GET_PROCESSES_FAILURE,

    POST_PROCESSES,
    POST_PROCESSES_STARTED,
    POST_PROCESSES_SUCCESS,
    POST_PROCESSES_FAILURE,

    PUT_PROCESSES,
    PUT_PROCESSES_STARTED,
    PUT_PROCESSES_SUCCESS,
    PUT_PROCESSES_FAILURE,

    DELETE_PROCESSES,
    DELETE_PROCESSES_STARTED,
    DELETE_PROCESSES_SUCCESS,
    DELETE_PROCESSES_FAILURE,
    EDITING_PROCESS,
    SET_EDITING_VALUES,
} from '../types/processes_types'

import * as api from '../../api/processes_api'
import { processesSchema } from '../../normalizr/schema';
import { deepCopy } from '../../methods/utils/utils'
import {putDashboard} from "./dashboards_actions";
import {getRouteProcesses} from "../../methods/utils/route_utils";
import {willRouteDeleteBreakProcess} from "../../methods/utils/processes_utils";
import * as dashboardsActions from "./dashboards_actions";
import {deleteTask} from "./tasks_actions";

import * as cardActions from "./card_actions";

export const getProcesses = () => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: GET_PROCESSES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: GET_PROCESSES_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: GET_PROCESSES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const processes = await api.getProcesses();
            // Uncomment when you want to make processes an object
            const normalizedProcesses = normalize(processes, processesSchema);
            if (normalizedProcesses.entities.processes === undefined) {
                return onSuccess(normalizedProcesses.entities)
            }
            else {
                return onSuccess(normalizedProcesses.entities.processes)
            }
        } catch (error) {
            return onError(error)
        }
    }
}
export const postProcesses = (process) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: POST_PROCESSES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: POST_PROCESSES_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: POST_PROCESSES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            delete process.new
            delete process.changed

            const newProcesses = await api.postProcesses(process);
            return onSuccess(newProcesses)
        } catch (error) {
            return onError(error)
        }
    }
}
export const putProcesses = (process) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: PUT_PROCESSES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: PUT_PROCESSES_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: PUT_PROCESSES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const ID = deepCopy(process._id)

            if(process.new) {
                delete process.new
            }
            if(process.changed) {
                delete process.changed
            }
            // delete process._id
            const updateProcesses = await api.putProcesses(process, ID);
            return onSuccess(updateProcesses)
        } catch (error) {
            return onError(error)
        }
    }
}


export const deleteProcess = (ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_PROCESSES_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: DELETE_PROCESSES_SUCCESS, payload: ID });
            return response;
        }
        function onError(error) {
            dispatch({ type: DELETE_PROCESSES_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const removeProcesses = await api.deleteProcess(ID);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}

// delete CLEAN
// ******************************
export const deleteProcessClean = (processId) => {
    return async (dispatch, getState) => {

        // remove route from all dashboards
        await dispatch(cardActions.deleteProcessCards(processId))

        await dispatch(deleteProcess(processId))
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// deletes all buttons with routeId from all dashboards
// ******************************
export const removeRouteFromAllProcesses = (routeId) => {
    return async (dispatch, getState) => {

        // current state
        const state = getState()
        const routes = state.tasksReducer.tasks || {}

        // get all processes that contain routeId
        const routeProcesses = getRouteProcesses(routeId)

        // loop through each of these processes, check if removing the route will break the process, then remove the route
        for (const currProcess of routeProcesses) {

            const processRoutes = currProcess.routes.map((currRoute) => routes[currRoute])

            // will removing route break the process?
            const willBreak = willRouteDeleteBreakProcess(processRoutes, routeId)
            console.log("willBreak",willBreak)

            // dispatch update
            await dispatch(putProcesses({
                ...currProcess,
                broken: willBreak,
                routes: currProcess.routes.filter((currRoute) => currRoute !== routeId)
            }))
        }

    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const updateProcesses = (processes, d3) => {
    return { type: 'UPDATE_PROCESSES', payload: { processes, d3 } }
}

export const setEditingValues = (process) => {
    return { type: 'SET_EDITING_VALUES', payload: process}
}

export const setSelectedProcess = (process) => {
    return { type: 'SET_SELECTED_PROCESS', payload: process }
}

export const setProcessAttributes = (id, attr) => {
    return { type: 'SET_PROCESS_ATTRIBUTES', payload: { id, attr } }
}

export const editingProcess = (bool) => {
    return { type: EDITING_PROCESS, payload: bool }
}

/**
 * This is to tell the map that you are fixing a process vs adding a new route to the process
 * It will force you to select a location that is tied with the location before the process breaks
 * @param {bool} bool
 */
export const setFixingProcess = (bool) => {
    return { type: 'SET_FIXING_PROCESS', payload: bool }
}
