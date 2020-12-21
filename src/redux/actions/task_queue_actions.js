import { normalize, schema } from 'normalizr';
import {
    TASK_QUEUE,
    TASK_QUEUE_ALL,
    TASK_QUEUE_ITEM,
    GET_TASK_QUEUE,
    GET_TASK_QUEUE_STARTED,
    GET_TASK_QUEUE_SUCCESS,
    GET_TASK_QUEUE_FAILURE,

    GET_TASK_QUEUE_ITEM,
    GET_TASK_QUEUE_ITEM_STARTED,
    GET_TASK_QUEUE_ITEM_SUCCESS,
    GET_TASK_QUEUE_ITEM_FAILURE,

    POST_TASK_QUEUE,
    POST_TASK_QUEUE_STARTED,
    POST_TASK_QUEUE_SUCCESS,
    POST_TASK_QUEUE_FAILURE,

    DELETE_TASK_QUEUE,
    DELETE_TASK_QUEUE_STARTED,
    DELETE_TASK_QUEUE_SUCCESS,
    DELETE_TASK_QUEUE_FAILURE,

    TASK_QUEUE_OPEN,
} from '../types/task_queue_types';

import {
    GET_,
    POST_,
    DELETE_,
    PUT_,

    _STARTED,
    _SUCCESS,
    _FAILURE,
} from '../types/api_types';

import { taskQueueSchema } from '../../normalizr/task_queue_schema';

import * as api from '../../api/task_queue_api'

// get
// ******************************
export const getTaskQueue = () => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: GET_ + TASK_QUEUE + _STARTED });
        }
        function onSuccess(taskQueue) {
            dispatch({ type: GET_ + TASK_QUEUE + _SUCCESS, payload: taskQueue });
            return taskQueue;
        }
        function onError(error) {
            dispatch({ type: GET_ + TASK_QUEUE + _FAILURE, payload: error });
            return error;
        }

        try {
            onStart();

            const taskQueue = await api.getTaskQueue();
            // console.log('getTaskQueue: taskQueue:',taskQueue)
            const normalizedData = normalize(taskQueue, taskQueueSchema);
            // console.log('getTaskQueue normalizedData', normalizedData)

            return onSuccess(normalizedData.entities.taskQueue);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// create
// ******************************
export const postTaskQueue = (queueItem) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: POST_ + TASK_QUEUE + _STARTED });
        }
        function onSuccess(createdTaskQueueItem, oldTaskQueueItemId) {
            const payload = { createdTaskQueueItem, oldTaskQueueItemId };
            dispatch({ type: POST_ + TASK_QUEUE + _SUCCESS, payload });
            return (
                createdTaskQueueItem
            );
        }
        function onError(error) {
            dispatch({ type: POST_ + TASK_QUEUE + _FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const createdTaskQueueItem = await api.postTaskQueue(queueItem);
            return onSuccess(createdTaskQueueItem, queueItem.id);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update
// ******************************
export const putTaskQueue = (item, ID) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: PUT_ + TASK_QUEUE + _STARTED });
        }
        function onSuccess(item, ID) {
            const payload = { item, ID };
            dispatch({ type: PUT_ + TASK_QUEUE + _SUCCESS, payload });
            return payload

        }
        function onError(error) {
            dispatch({ type: PUT_ + TASK_QUEUE + _FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const taskQueueItem = await api.putTaskQueueItem(item, ID);
            return onSuccess(item, ID);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete all
// ******************************
export const deleteTaskQueueAll = () => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: DELETE_ + TASK_QUEUE_ALL + _STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: DELETE_ + TASK_QUEUE_ALL + _SUCCESS });
            return response;
        }
        function onError(error) {
            dispatch({ type: DELETE_ + TASK_QUEUE_ALL + _FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const response = await api.deleteTaskQueueAll();
            return onSuccess(response);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete all
// ******************************
export const deleteTaskQueueItem = (id) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: DELETE_ + TASK_QUEUE_ITEM + _STARTED });
        }
        function onSuccess(response, id) {
            const payload = { id }
            dispatch({ type: DELETE_ + TASK_QUEUE_ITEM + _SUCCESS, payload });
            return response;
        }
        function onError(error) {
            dispatch({ type: DELETE_ + TASK_QUEUE_ITEM + _FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const response = await api.deleteTaskQueueItem(id);
            return onSuccess(response, id);
        } catch (error) {
            return onError(error);
        }
    };
};

export const taskQueueOpen = (bool) => {
    return { type: TASK_QUEUE_OPEN, payload: bool }
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
