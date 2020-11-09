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
    VALIDATE_TASK,
    SELECT_TASK,
    SET_SELECTED_TASK,
    DESELECT_TASK,
} from '../types/tasks_types'

import { deepCopy } from '../../methods/utils/utils';


const defaultState = {
    tasks: {},
    selectedTask: null,

    error: {},
    pending: false
};

export default function tasksReducer(state = defaultState, action) {
    let index = ''
    let taskID = ''
    let tasksCopy = {};

    switch (action.type) {

        // ======================================== //
        //                                          //
        //              Get Tasks               //
        //                                          //
        // ======================================== //
        case GET_TASKS:
            break;

        case GET_TASKS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_TASKS_SUCCESS:
            tasksCopy = deepCopy(action.payload)
            return {
                ...state,
                tasks: action.payload,
                pending: false
            }

        case GET_TASKS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ======================================== //
        //                                          //
        //             Post Tasks               //
        //                                          //
        // ======================================== //

        case POST_TASK:
            break;

        case POST_TASK_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case POST_TASK_SUCCESS:
            const ID = deepCopy(action.payload._id)
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [ID]: action.payload,
                },
                pending: false,

            }

        case POST_TASK_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ======================================== //
        //                                          //
        //             Put Tasks                //
        //                                          //
        // ======================================== //

        case PUT_TASK:
            break;

        case PUT_TASK_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case PUT_TASK_SUCCESS:
            tasksCopy = deepCopy(state.tasks)
            tasksCopy[action.payload._id] = action.payload

            return {
                ...state,
                tasks: tasksCopy
            }

        case PUT_TASK_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_TASK:
            break;

        case DELETE_TASK_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case DELETE_TASK_SUCCESS:
            tasksCopy = deepCopy(state.tasks)
            delete tasksCopy[action.payload]

            return {
                ...state,
                tasks: tasksCopy
            }

        case DELETE_TASK_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });



        // ======================================== //
        //                                          //
        //             Tasks Utils              //
        //                                          //
        // ======================================== //

        case ADD_TASK:
            tasksCopy = deepCopy(state.tasks)
            tasksCopy[action.payload.task._id] = action.payload.task
            return {
                ...state,
                tasks: tasksCopy
            }

        case UPDATE_TASK:
            tasksCopy = deepCopy(state.tasks)
            tasksCopy[action.payload.task._id] = action.payload.task

            if (state.selectedTask !== null) {
                return {
                    ...state,
                    tasks: tasksCopy,
                    selectedTask: tasksCopy[state.selectedTask._id]
                }
            } else {
                return {
                    ...state,
                    tasks: tasksCopy
                }
            }

        case UPDATE_TASKS:
            tasksCopy = deepCopy(action.payload.tasks)

            if (state.selectedTask !== null) {
                return {
                    ...state,
                    tasks: deepCopy(action.payload.tasks),
                    selectedTask: deepCopy(action.payload.tasks[state.selectedTask._id])
                }
            } else {
                return {
                    ...state,
                    tasks: deepCopy(action.payload.tasks)
                }
            }

        case REMOVE_TASK:
            tasksCopy = deepCopy(state.tasks)
            delete tasksCopy[action.payload.id]

            return {
                ...state,
                tasks: tasksCopy,
            }


        case SET_TASK_ATTRIBUTES:
            tasksCopy = deepCopy(state.tasks)
            Object.assign(tasksCopy[action.payload.id], action.payload.attr)

            // tasksCopy = {
            //     ...tasksCopy,
            //     [action.payload.id]: action.payload.attr,
            // }

            if (state.selectedTask !== null) {
                return {
                    ...state,
                    tasks: tasksCopy,
                    selectedTask: deepCopy(tasksCopy[state.selectedTask._id])
                }
            } else {
                return {
                    ...state,
                    tasks: tasksCopy,
                }
            }


        case SELECT_TASK:
            tasksCopy = deepCopy(state.tasks)
            return {
                ...state,
                selectedTask: tasksCopy[action.payload.id]
            }

        case SET_SELECTED_TASK:
            return {
                ...state,
                selectedTask: action.payload.task
            }

        case DESELECT_TASK:
            return {
                ...state,
                selectedTask: null,
            }

        default:
            return state;
    }
}
