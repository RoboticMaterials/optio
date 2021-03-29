import {
    TASK_QUEUE_ALL,
    TASK_QUEUE_ITEM,
    GET_TASK_QUEUE_STARTED,
    GET_TASK_QUEUE_SUCCESS,
    GET_TASK_QUEUE_FAILURE,

    POST_TASK_QUEUE_STARTED,
    POST_TASK_QUEUE_SUCCESS,
    POST_TASK_QUEUE_FAILURE,

    PUT_TASK_QUEUE_STARTED,
    PUT_TASK_QUEUE_SUCCESS,
    PUT_TASK_QUEUE_FAILURE,

    TASK_QUEUE_OPEN,
    INCREMENT_GET_DATA_FAILURE_COUNT,
    SET_SHOW_MODAL_ID,
} from '../types/task_queue_types';

import {
    DELETE_,

    _STARTED,
    _SUCCESS,
    _FAILURE,
} from '../types/api_types';

import { clone_object, deepCopy } from '../../methods/utils/utils';

const defaultState = {
    taskQueue: {},
    pending: false,
    error: '',
    taskQueueItemClicked: '',
    hilTimers: {},
    hilResponse: '',
    activeHilDashboards: {},
    localHumanTask: null,
    taskQueueOpen: false,
    getFailureCount: 1,
    showModalID: null
};

export default function taskQueueReducer(state = defaultState, action) {
    let taskQueue = {}

    switch (action.type) {

        /**
         * HILs?
         */
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

        // Used for immediate HIL response input
        case 'HIL_RESPONSE':
            return {
                ...state,
                hilResponse: action.payload,
            }

        // Used for when a human task is clicked, should only show dashboard on the clicked tablet
        case 'LOCAL_HUMAN_TASK':
            return {
                ...state,
                localHumanTask: action.payload,
            }

        // Used to set first in, first out dashboard HILs
        // Not 100% tested, but in theory should work
        case 'ACTIVE_HIL_DASHBOARDS':
            return {
                ...state,
                activeHilDashboards: action.payload,
            }


        // get
        // ***************
        case GET_TASK_QUEUE_SUCCESS:
            if (action.payload === undefined) {
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
            return {
                ...state,
                taskQueue: {
                    ...state.taskQueue,
                    [action.payload.createdTaskQueueItem._id]: action.payload.createdTaskQueueItem
                },
                error: '',
                pending: false,
            }

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

        // put
        // ***************
        case PUT_TASK_QUEUE_SUCCESS:

            const updatedTaskQ = deepCopy({
                ...action.payload.item,
                _id: action.payload.ID
            })

            let forceUpdate = {}

            forceUpdate = Object.assign(forceUpdate, updatedTaskQ)

            return {
                ...state,
                taskQueue: {
                    ...state.taskQueue,
                    [action.payload.ID]: forceUpdate,
                },
                error: '',
                pending: false,
            }

        case PUT_TASK_QUEUE_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case PUT_TASK_QUEUE_STARTED:
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

        case TASK_QUEUE_OPEN:
            return {
                ...state,
                taskQueueOpen: action.payload,
            }

        case INCREMENT_GET_DATA_FAILURE_COUNT:
            return {
                ...state,
                getFailureCount: state.getFailureCount + 1,
            }

        case SET_SHOW_MODAL_ID:
            return {
              ...state,
              showModalID: action.payload,
            }

        // ~~~~~~~~~~~~~~~

        default:
            return state
    }
}
