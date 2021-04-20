/** 
 * All of the API calls for Task Queue
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 18 20201
 * Edited by: Daniel Castillo
 * 
 * TODO: Actually stringify and parse the JSON
 * CANT TEST NOW BECAUSE ITLL BREAK THE PAGE
 * 
 **/

// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { taskQueueByOrgId } from '../graphql/queries'
import { createTaskQueue, updateTaskQueue, manageTaskQueue } from '../graphql/mutations'

// import {putCard, getCard} from './cards_api'

// to get user org id
import getUserOrgId from './user_api'
// import { getTask } from './tasks_api'

import store from '../redux/store/index'

import { parseTaskQueue } from "../methods/utils/data_utils";

import {
    streamlinedGraphqlCall,
    TRANSFORMS
} from "../methods/utils/api_utils";

export async function getTaskQueue() {
    try {
        const userOrgId = await getUserOrgId()

        const taskQueue = await streamlinedGraphqlCall(
                            TRANSFORMS.QUERY,
                            taskQueueByOrgId, 
                            { organizationId: userOrgId }, 
                            parseTaskQueue
                        )

        return taskQueue;
    } catch (error) {
        // Error 😨
        errorLog(error)
        return []
    }
}

export async function getTaskQueueItem(id) {
    try {
        
        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: taskQueueByOrgId,
            variables: { 
                organizationId: userOrgId,
                filter: {id: {eq: id}}
             }
          })

        return res.data.TaskQueueByOrgId.items[0];
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function postTaskQueue(taskQueueItem) {
    try {
        const orgId = await getUserOrgId()

        const input = {
            ...taskQueueItem,
            organizationId: orgId,
            id: taskQueueItem.id
        }

        const dataJson = await API.graphql({
            query: createTaskQueue,
            variables: { input: input }
          })
          
        return dataJson.data.createTaskQueue;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function deleteTaskQueueAll() {
    try {
        let data = await getTaskQueue()

        data.forEach(element => {
            deleteTaskQueueItem(element.id, element)
        });
        return 'Deleted TQ';

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}


export async function deleteTaskQueueItem(id, taskQueueItem) {
    try {

        if(taskQueueItem === undefined){
            taskQueueItem = await getTaskQueueItem(id)
        }
            
        taskQueueItem.end_time = Math.round(Date.now() / 1000)

        await API.graphql({
            query: manageTaskQueue,
            variables: { 
                taskQueueItem: JSON.stringify(taskQueueItem)
            }
        });

        store.dispatch({ type: 'DELETE_TASK_QUEUE_ITEM_SUCCESS', id });

        return 'Deleted TQ';

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function putTaskQueueItem(item, ID) {
    try {
        
        delete item.createdAt
        delete item.updatedAt

        const dataJson = await API.graphql({
            query: updateTaskQueue,
            variables: { input: item }
        })
        
        return dataJson.data.updateTaskQueue
        
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
