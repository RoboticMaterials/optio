import {
    POST_HUMAN_TASK_QUEUE,
    DELETE_HUMAN_TASK_QUEUE,
} from '../types/human_task_queue_types'

import { clone_object, deepCopy } from '../../methods/utils/utils';

const defaultState = {
    humanTaskQueue: {},
}

const humanTaskQueueReducer = (state = defaultState, action) => {

    switch (action.type) {
        case POST_HUMAN_TASK_QUEUE:
            const task = action.payload
            return {
                ...state,
                humanTaskQueue: {
                    ...state.humanTaskQueue,
                    [task._id]: task
                }
            }

        case POST_HUMAN_TASK_QUEUE:

            let humanTaskQueueClone = deepCopy(state.humanTaskQueue)

            delete humanTaskQueueClone[action.payload]

            return {
                ...state,
                humanTaskQueue: humanTaskQueueClone
            }

        default:
            return state;
    }
}

export default humanTaskQueueReducer