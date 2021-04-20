import { normalize } from 'normalizr';

import {
    TASK_QUEUE,
    TASK_QUEUE_ALL,
    TASK_QUEUE_ITEM,

    TASK_QUEUE_OPEN,
    INCREMENT_GET_DATA_FAILURE_COUNT,
    SET_SHOW_MODAL_ID
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
import uuid from 'uuid';
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
            dispatch({ type: INCREMENT_GET_DATA_FAILURE_COUNT, payload: null })
            return error;
        }

        try {
            onStart();

            const taskQueue = await api.getTaskQueue();
            const normalizedData = normalize(taskQueue, taskQueueSchema);

            if(!!normalizedData.entities.taskQueue){
                return onSuccess(normalizedData.entities.taskQueue);
            }else{
                return onSuccess(normalizedData.entities);
            }
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
            dispatch({ type: POST_ + TASK_QUEUE + _STARTED, payload: queueItem });
        }
        function onSuccess(createdTaskQueueItem, oldTaskQueueItemId) {
            const payload = { createdTaskQueueItem, oldTaskQueueItemId };
            dispatch(postTaskQueueSucess(payload))
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

export const postTaskQueueSucess = (payload) => {
    return { type: POST_ + TASK_QUEUE + _SUCCESS, payload }
}



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update
// ******************************
export const putTaskQueue = (item, ID) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: PUT_ + TASK_QUEUE + _STARTED, payload: {item, ID} });
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
export const deleteTaskQueueItem = (id, item) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_ + TASK_QUEUE_ITEM + _STARTED });
        }
        function onSuccess(response, id) {
            dispatch(deleteTaskQueueItemSuccess(id));
            return response;
        }
        function onError(error) {
            dispatch({ type: DELETE_ + TASK_QUEUE_ITEM + _FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const response = await api.deleteTaskQueueItem(id, item);
            return onSuccess(response, id);
        } catch (error) {
            return onError(error);
        }
    };
};

export const deleteTaskQueueItemSuccess = (id) => {
    const payload = { id }
    return { type: DELETE_ + TASK_QUEUE_ITEM + _SUCCESS, payload }
}


/**
 @param {*} props
 */

export const handlePostTaskQueue = (props) => {
    const {
        dashboardID,
        tasks,
        taskQueue,
        Id,
        // name,
        custom,
        fromSideBar,
        deviceType
    } = props

    return async dispatch => {
        // If a custom task then add custom task key to task q
        if (Id === 'custom_task') {

            await dispatch(postTaskQueue(
                {
                    id: uuid.v4(), dashboardID,
                    "taskId": Id,
                    'custom_task': custom,
                    "device_type": deviceType
                }
            ))
        }else {

            let inQueue = false

            if (!!taskQueue) {
                Object.values(taskQueue).map((item) => {
                    // If its in the Q and not a handoff, then alert the user saying its already there
                    if (item.taskId === Id
                        // && !tasks[item.task_id].handoff 
                        // && item.device_type === deviceType
                        ) inQueue = true
                })
            }

            // add alert to notify task has been added
            if (!inQueue) {
                // If the task is a human task, its handled a little differently compared to a normal task
                // Set hil_response to null because the backend does not dictate the load hil message
                // Since the task is put into the q but automatically assigned to the person that clicks the button
                if (deviceType === 'human') {

                    const postTask = {
                        "device_type": deviceType,
                        "taskId": Id,
                        dashboard: dashboardID,
                        hil_response: null,
                        showModal: true,
                        id: uuid.v4(),
                    }

                    await dispatch({ type: 'LOCAL_HUMAN_TASK', payload: postTask.id })
                    // const postToQueue = dispatch(postTaskQueue(postTask))
                    const payload = { createdTaskQueueItem: postTask };
                    dispatch(postTaskQueueSucess(payload))

                    if (fromSideBar) {
                        // postToQueue.then(item => {
                            dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: postTask.id })
                        // })
                    }
                }

                else {
                    await dispatch(postTaskQueue(
                        {
                            id: uuid.v4(),
                            "device_type": deviceType,
                            "taskId": Id,
                        })
                    )
                }
            }
        }
    };
};


export const taskQueueOpen = (bool) => {
    return { type: TASK_QUEUE_OPEN, payload: bool }
};

export const setShowModalId = (id) => {
    return { type: SET_SHOW_MODAL_ID, payload: id}
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
