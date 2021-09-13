import {
    GET_TASKS,
    GET_TASKS_STARTED,
    GET_TASKS_SUCCESS,
    GET_TASKS_FAILURE,

    // GET_TASK,
    // GET_TASK_STARTED,
    // GET_TASK_SUCCESS,
    // GET_TASK_FAILURE,

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
    SET_TASKS,
    UPDATE_TASK,
    UPDATE_TASKS,
    REMOVE_TASK,
    SET_TASK_ATTRIBUTES,
    SELECT_TASK,
    SET_SELECTED_TASK,
    DESELECT_TASK,
    EDITING_TASK, REMOVE_TASKS,
    SET_SELECTED_HOVERING_TASK,
    SET_SHOW_ROUTE_CONFIRMATION,
    SET_ROUTE_CONFIRMATION_LOCATION,
    AUTO_ADD_ROUTE,

} from '../types/tasks_types'

import { deepCopy } from '../../methods/utils/utils';
import { isObject } from "../../methods/utils/object_utils";


const defaultState = {
    tasks: {},
    selectedTask: null,
    selectedHoveringTask: null,

    error: {},
    pending: false,
    showRouteConfirmation: false,
    routeConfirmationLocation: null,
    autoAddRoute: false
};

export default function tasksReducer(state = defaultState, action) {
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
        //              Get Task               //
        //                                          //
        // ======================================== //
        // case GET_TASK:
        //     break;

        // case GET_TASK_STARTED:
        //     return Object.assign({}, state, {
        //         pending: true
        //     });

        // case GET_TASK_SUCCESS:
        //     tasksCopy = deepCopy(state.tasks)
        //     tasksCopy[action.payload.id] = action.payload.task
        //     return {
        //         ...state,
        //         tasks: tasksCopy,
        //         pending: false
        //     }

        // case GET_TASK_FAILURE:
        //     return Object.assign({}, state, {
        //         error: action.payload,
        //         pending: false
        //     });

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
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [action.payload._id]: action.payload,
                }
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

        case SET_TASKS:
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    ...action.payload
                }
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

        case REMOVE_TASK: {
            const {
                [action.payload.id]: taskToRemove,  // extract task to remove
                ...remainingTasks                   // all other tasks are left here
            } = state.tasks

            return {
                ...state,
                tasks: { ...remainingTasks },         // keep all tasks but the one to remove
            }
        }

        case REMOVE_TASKS: {


            let temp = { ...state.tasks }

            action.payload.ids.forEach((currId) => {
                const {
                    [currId]: removed,
                    ...remainingTasks
                } = temp

                temp = remainingTasks
            })

            return {
                ...state,
                tasks: { ...temp },         // keep all tasks but the one to remove
            }
        }


        case SET_TASK_ATTRIBUTES: {
            var newState

            if (isObject(state.selectedTask) && state.selectedTask._id === action.payload.id) {
                newState = {
                    ...state,
                    tasks: state.tasks[action.payload.id] ?
                        {
                            ...state.tasks,
                            [action.payload.id]: { ...state.tasks[action.payload.id], ...action.payload.attr },
                        }
                        :
                        {
                            ...state.tasks
                        },
                    selectedTask: {
                        ...state.selectedTask,
                        ...action.payload.attr
                    }
                }
            } else {
                newState = {
                    ...state,
                    tasks: state.tasks[action.payload.id] ? {
                        ...state.tasks,
                        [action.payload.id]: { ...state.tasks[action.payload.id], ...action.payload.attr },
                    }
                        :
                        {
                            ...state.tasks
                        }
                }
            }

            return newState

        }


        case SELECT_TASK:
            return {
                ...state,
                selectedTask: state.tasks[action.payload.id]
            }

        case SET_SELECTED_TASK:
            let tasksCopy = state.tasks;
            if (action.payload.task !== null && state.tasks[action.payload.task._id] === undefined) {
                tasksCopy[action.payload.task._id] = action.payload.task
            }

            return {
                ...state,
                tasks: tasksCopy,
                selectedTask: action.payload.task
            }

        case SET_SELECTED_HOVERING_TASK:
            return {
                ...state,
                selectedHoveringTask: action.payload.task
            }

        case DESELECT_TASK:
            return {
                ...state,
                selectedTask: null,
            }

        case EDITING_TASK:
            return {
                ...state,
                editingTask: action.payload,
            }

        case SET_SHOW_ROUTE_CONFIRMATION:
            return {
                ...state,
                showRouteConfirmation: action.payload,
            }

        case SET_ROUTE_CONFIRMATION_LOCATION:
            return {
                ...state,
                routeConfirmationLocation: action.payload,
            }

        case AUTO_ADD_ROUTE:
            return {
                ...state,
                autoAddRoute: action.payload,
            }
            
        default:
            return state;
    }
}
