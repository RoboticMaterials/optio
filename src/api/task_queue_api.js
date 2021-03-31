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
import { API, input } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { taskQueueByOrgId } from '../graphql/queries'
import { createTaskQueue, deleteTaskQueue, updateTaskQueue, manageTaskQueue } from '../graphql/mutations'

import {putCard, getCard} from './cards_api'

// to get user org id
import getUserOrgId from './user_api'
import { getTask } from './tasks_api'

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


export async function deleteTaskQueueItem(id, taskQueueItem) {
    try {

        if(taskQueueItem === undefined){
            taskQueueItem = await getTaskQueueItem(id)
        }

        if(taskQueueItem !== 'load'){
            
            taskQueueItem.end_time = Math.round(Date.now() / 1000)

            delete taskQueueItem.createdAt
            delete taskQueueItem.updatedAt
            delete taskQueueItem.id
            delete taskQueueItem._id

            // DO CHECKS HERE

            // let lot = await getCard(taskQueueItem.lot_id) // get lot
            // let task = await getTask(taskQueueItem.task_id) // get task

            await API.graphql({
                query: manageTaskQueue,
                variables: { 
                    id: taskQueueItem.id,
                    quantity: taskQueueItem.quantity,
                    task_id: taskQueueItem.task_id,
                    lot_id: taskQueueItem.lot_id,
                }
              });
        }

        //     if(lot && task){
        //         // are we moving the whole lot?
        //         if(taskQueueItem.quantity === lot.totalQuantity){
        //             // move the whole lot 
        //             delete lot.bins[task.load.station]

        //             lot.bins[task.unload.station] = {
        //                 count: taskQueueItem.quantity
        //             }  

        //         }else{
        //             //check how much they want to move and update it accordingly
        //             const diff = lot.bins[task.load.station].count - taskQueueItem.quantity

        //             if(diff === 0){

        //                 // move the res of the lot 
        //                 delete lot.bins[task.load.station]

        //                 lot.bins[task.unload.station].count = lot.bins[task.unload.station] ? taskQueueItem.quantity + lot.bins[task.unload.station].count : taskQueueItem.quantity
                        
        //             }else{
        //                 lot.bins[task.load.station].count = diff

        //                 if(lot.bins[task.unload.station]){
        //                     lot.bins[task.unload.station].count +=  taskQueueItem.quantity
        //                 }else{
        //                     lot.bins[task.unload.station] = {
        //                         count: taskQueueItem.quantity
        //                     }
        //                 }
        //             }
        //         }
                
        //         // update to the card
        //         await putCard(lot)

        //     }
        // }

        // // Add item to task events
        // await API.graphql({
        //     query: createTaskQueueEvents,
        //     variables: { input: taskQueueItem }
        // })


        // // Delete item after adding it to the event
        // await API.graphql({
        //     query: deleteTaskQueue,
        //     variables: { input: {id: id} }
        // })

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
        
        return dataJson.data.updateTaskQueue
        
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
