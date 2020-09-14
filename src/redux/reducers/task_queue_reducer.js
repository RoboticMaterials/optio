import {
    GET_TASK_QUEUE,
    TASK_QUEUE,
    TASK_QUEUE_ALL,
    TASK_QUEUE_ITEM,
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

import { clone_object } from '../../methods/utils/utils';

const defaultState = {
    taskQueue: {},
    pending: false,
    error: '',
    taskQueueItemClicked: '',
    hilTimers: {},
};

export default function taskQueueReducer(state = defaultState, action) {
    let taskQueue = {}

    switch (action.type) {

        case 'TASK_QUEUE_ITEM_CLICKED':
            return {
                ...state,
                taskQueueItemClicked: action.payload
            }

        case 'HIL_TIMERS':
            return {
                ...state,
                hilTimers: action.payload,
            }

        // get
        // ***************
        case GET_TASK_QUEUE_SUCCESS:
            if(action.payload === undefined){
                action.payload = {}
            }
            return Object.assign({}, state, {
                taskQueue: action.payload,
                pending: false
            });

        case GET_TASK_QUEUE_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case GET_TASK_QUEUE_STARTED:

            return {
                ...state,
                pending: true,
            }
        // ~~~~~~~~~~~~~~~

        // post
        // ***************
        case POST_TASK_QUEUE_SUCCESS:

            return Object.assign({}, state, {
                taskQueue: { ...state.taskQueue, [action.payload.createdTaskQueueItem._id.$oid]: action.payload.createdTaskQueueItem },
                error: '',
                pending: false
            });

        case POST_TASK_QUEUE_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case POST_TASK_QUEUE_STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // delete
        // ***************
        case DELETE_ + TASK_QUEUE_ALL + _SUCCESS:
            return Object.assign({}, state, {
                taskQueue: {},
                pending: false
            });

        case DELETE_ + TASK_QUEUE_ALL + _FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_ + TASK_QUEUE_ALL + _STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        // delete
        // ***************
        case DELETE_ + TASK_QUEUE_ITEM + _SUCCESS:
            taskQueue = clone_object(state.taskQueue);
            delete taskQueue[action.payload.id];

            return Object.assign({}, state, {
                taskQueue: { ...taskQueue },
                pending: false
            });

        case DELETE_ + TASK_QUEUE_ITEM + _FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_ + TASK_QUEUE_ITEM + _STARTED:
            return Object.assign({}, state, {
                pending: true
            });
        // ~~~~~~~~~~~~~~~

        default:
            return state
    }
}
