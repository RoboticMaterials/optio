import {
    POST_HUMAN_TASK_QUEUE,
    DELETE_HUMAN_TASK_QUEUE,
} from '../types/human_task_queue_types'

export const postHumanTaskQueue = (task) =>{

    return async dispatch => {

        dispatch({type: POST_HUMAN_TASK_QUEUE, payload: task})
        return task

    }

}

export const deleteHumanTaskQueue = (ID) => {
    return async dispatch => {

        dispatch({type: DELETE_HUMAN_TASK_QUEUE, payload: ID})
        return ID

    }
}