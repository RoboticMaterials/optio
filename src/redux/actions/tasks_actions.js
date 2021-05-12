import {
    GET_TASKS_STARTED,
    GET_TASKS_SUCCESS,
    GET_TASKS_FAILURE,

    POST_TASK_STARTED,
    POST_TASK_SUCCESS,
    POST_TASK_FAILURE,

    PUT_TASK_STARTED,
    PUT_TASK_SUCCESS,
    PUT_TASK_FAILURE,

    DELETE_TASK_STARTED,
    DELETE_TASK_SUCCESS,
    DELETE_TASK_FAILURE,

    ADD_TASK,
    SET_TASKS,
    UPDATE_TASK,
    UPDATE_TASKS,
    REMOVE_TASK,
    SET_TASK_ATTRIBUTES,
    SELECT_TASK,
    SET_SELECTED_TASK,
    DESELECT_TASK,
    EDITING_TASK,
    REMOVE_TASKS,
    SET_SELECTED_HOVERING_TASK,
    SET_SHOW_ROUTE_CONFIRMATION,
    SET_ROUTE_CONFIRMATION_LOCATION,
    AUTO_ADD_ROUTE,
} from '../types/tasks_types'

import { deepCopy } from '../../methods/utils/utils';

import * as api from '../../api/routes'
import * as processesActions from "./processes_actions";
import * as dashboardsActions from "./dashboards_actions";

// get
// ******************************
export const getTasks = () => {
    return async (dispatch) => {

        function onStart() {
            dispatch({ type: GET_TASKS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: GET_TASKS_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: GET_TASKS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const tasks = await api.getRoutes();

            const normalizedTasks = {}
            tasks.map((task) => {
                normalizedTasks[task.id] = task
                return task
            })

            return onSuccess(normalizedTasks);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get task details
// ******************************
// export const getTask = (taskId) => {
//   return async dispatch => {

//     function onStart() {
//       dispatch({ type: GET_TASK_STARTED });
//     }
//     function onSuccess(response) {
//       dispatch({ type: GET_TASK_SUCCESS, payload: response });
//       return response;
//     }
//     function onError(error) {
//       dispatch({ type: GET_TASK_FAILURE, payload: error });
//       return error;
//     }

//     try {
//       onStart();
//       const task_details = await api.getTask(taskId);
//       return onSuccess(task_details);
//     } catch (error) {
//       return onError(error);
//     }
//   };
// };
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// post
// ******************************
export const postTask = (task) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: POST_TASK_STARTED });
        }
        const onSuccess = async (newTask) => {
            await dispatch({ type: POST_TASK_SUCCESS, payload: newTask });
            return newTask;
        }
        function onError(error) {
            dispatch({ type: POST_TASK_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            if(!!task.new){
                delete task.new
            }
            if(task.changed) {
                delete task.changed
            }
            const newTask = await api.postRoute(task);
            return onSuccess(newTask);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// put
// ******************************
export const putTask = (task, ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: PUT_TASK_STARTED });
        }
        function onSuccess(updateTask) {
            dispatch({ type: PUT_TASK_SUCCESS, payload: updateTask });
            return updateTask;
        }
        function onError(error) {
            dispatch({ type: PUT_TASK_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            let taskCopy = deepCopy(task)
            if(!!taskCopy.new){
                delete taskCopy.new
            }
            if(taskCopy.changed) {
                delete taskCopy.changed
            }
            // delete taskCopy.id
            const updateTask = await api.putRoute(taskCopy, ID);
            return onSuccess(updateTask)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteTask = (ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_TASK_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: DELETE_TASK_SUCCESS, payload: ID });
            return response;
        }
        function onError(error) {
            dispatch({ type: DELETE_TASK_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            await api.deleteRoute(ID);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteRouteClean = (routeId) => {
    return async (dispatch, getState) => {

        // remove route from all dashboards
        // await dispatch(dashboardsActions.removeRouteFromAllDashboards(routeId))

        // remove route from all processes
        // await dispatch(processesActions.removeRouteFromAllProcesses(routeId))

        // delete route
        await dispatch(deleteTask(routeId));
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// PUT clean
// ******************************
export const putRouteClean = (route, routeId) => {
    return async (dispatch, getState) => {

        // put task
        const result = await dispatch(putTask(route, routeId));

        // remove buttons associated with route at dashboards at the wrong station
        // await dispatch(dashboardsActions.removeRouteFromWrongDashboards(route))

        // handle adding buttons to dashboards
        // await dispatch(dashboardsActions.addRouteToDashboards(route))

        return result
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// POST clean
// ******************************
export const postRouteClean = (route) => {
    return async (dispatch, getState) => {

        // post route
        const posted = await dispatch(postTask(route));

        // remove buttons associated with route at dashboards at the wrong station
        // await dispatch(dashboardsActions.removeRouteFromWrongDashboards(route))

        // handle adding buttons to dashboards
        // await dispatch(dashboardsActions.addRouteToDashboards(route))

        return posted
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//
// ******************************
export const saveFormRoute = (formRoute) => {
    return async (dispatch) => {

        // extract values
        const {
            unsaved,        // remove key
            new: isNew,     // remove key
            changed,        // remove key
            needsSubmit,    // remove key
            obj = {},
            ...remainingRoute
        } = formRoute
        // get objectId
        const {
            id: objectId
        } = obj || {}

        // create payload
        const payload = {
            ...remainingRoute,
            obj: objectId
        }

        // create new route
        if(isNew) {
            return await dispatch(postRouteClean(payload))
        }

        // update existing route
        else {
            return await dispatch(putRouteClean(payload, payload.id))
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


export const addTask = (task) => {
    return { type: ADD_TASK, payload: { task } }
}

export const setTasks = (tasks) => {
    return { type: SET_TASKS, payload: tasks}
}

export const updateTask = (task) => {
    return { type: UPDATE_TASK, payload: { task } }
}

export const updateTasks = (tasks) => {
    return { type: UPDATE_TASKS, payload: { tasks } }
}

export const removeTask = (id) => {
    return { type: REMOVE_TASK, payload: { id } }
}

export const removeTasks = (ids) => {
    return { type: REMOVE_TASKS, payload: { ids } }
}

export const setTaskAttributes = (id, attr) => {
    return { type: SET_TASK_ATTRIBUTES, payload: { id, attr } }
}

export const selectTask = (id) => {
    return { type: SELECT_TASK, payload: { id } }
}

export const setSelectedTask = (task) => {
    return { type: SET_SELECTED_TASK, payload: { task }}
}

export const setSelectedHoveringTask = (task) => {
    return { type: SET_SELECTED_HOVERING_TASK, payload: { task }}
}

export const deselectTask = () => {
    return { type: DESELECT_TASK }
}

export const editingTask = (bool) => {
    return { type: EDITING_TASK, payload: bool }
}

export const showRouteConfirmation = (bool) => {
    return { type: SET_SHOW_ROUTE_CONFIRMATION, payload: bool }
}

export const setRouteConfirmationLocation = (id) => {
    return { type: SET_ROUTE_CONFIRMATION_LOCATION, payload: id }
}

export const autoAddRoute = (bool) => {
    return { type: AUTO_ADD_ROUTE, payload: bool }
}
