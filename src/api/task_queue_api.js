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
import { createTaskQueue, deleteTaskQueue, updateTaskQueue } from '../graphql/mutations'

// to get user org id
import getUserOrgId from './user_api'

export async function getTaskQueue() {
    try {
        
        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: taskQueueByOrgId,
            variables: { organizationId: userOrgId }
          })

        return res.data.TaskQueueByOrgId.items;
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
            id: taskQueueItem._id
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
            API.graphql({
                query: deleteTaskQueue,
                variables: { input: {id: element.id} }
            })
        });
        return 'Deleted TQ';

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}


export async function deleteTaskQueueItem(id) {
    try {

        await API.graphql({
            query: deleteTaskQueue,
            variables: { input: {id: id} }
        })

        return 'data';

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
          
        return dataJson.data.updateTaskQueue;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}