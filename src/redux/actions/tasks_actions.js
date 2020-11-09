import {
    GET_TASKS,
    GET_TASKS_STARTED,
    GET_TASKS_SUCCESS,
    GET_TASKS_FAILURE,

    GET_TASK,
    GET_TASK_STARTED,
    GET_TASK_SUCCESS,
    GET_TASK_FAILURE,

    POST_TASK,
    POST_TASK_STARTED,
    POST_TASK_SUCCESS,
    POST_TASK_FAILURE,

    PUT_TASK,
    PUT_TASK_STARTED,
    PUT_TASK_SUCCESS,
    PUT_TASK_FAILURE,

    DELETE_TASK,
    DELETE_TASK_STARTED,
    DELETE_TASK_SUCCESS,
    DELETE_TASK_FAILURE,

    ADD_TASK,
    UPDATE_TASK,
    UPDATE_TASKS,
    REMOVE_TASK,
    SET_TASK_ATTRIBUTES,
    SELECT_TASK,
    SET_SELECTED_TASK,
    DESELECT_TASK,
} from '../types/tasks_types'

import { deepCopy } from '../../methods/utils/utils';

import * as api from '../../api/tasks_api'

// get
// ******************************
export const getTasks = () => {
    return async dispatch => {

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
            const tasks = await api.getTasks();

            const normalizedTasks = {}
            tasks.map((task) => {
                normalizedTasks[task._id] = task
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
// export const getTask = (task_id) => {
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
//       const task_details = await api.getTask(task_id);
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
            if(task.new){
                delete task.new
            }
            const newTask = await api.postTask(task);
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
            delete taskCopy._id
            const updateTask = await api.putTask(taskCopy, ID);
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
            const removeTask = await api.deleteTask(ID);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const addTask = (task) => {
    return { type: ADD_TASK, payload: { task } }
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

export const setTaskAttributes = (id, attr) => {
    return { type: SET_TASK_ATTRIBUTES, payload: { id, attr } }
}

export const selectTask = (id) => {
    return { type: SELECT_TASK, payload: { id } }
}

export const setSelectedTask = (task) => {
    return { type: SET_SELECTED_TASK, payload: { task }}
}

export const deselectTask = () => {
    return { type: DESELECT_TASK }
}
