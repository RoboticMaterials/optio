/** 
 * All of the API calls for Cards
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 9 20201
 * Edited by: Daniel Castillo
 * 
 **/

// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { createStationEvent } from '../graphql/mutations'

// to get user org id
import getUserOrgId from './user_api'
import { getTask } from './tasks_api'

export default async function postStationEvent(stationData) {
    try {
        console.log(stationData);

        const userOrgId = await getUserOrgId()

        const task = await getTask(stationData.task_id)

        const input = {
            organizationId: userOrgId,
            object: task.obj ? task.obj : null,
            outgoing: true,
            quantity: stationData.quantity,
            station: task.load.station,
            time: Math.round(Date.now() / 1000)
        }
        
        const dataJson = await API.graphql({
            query: createStationEvent,
            variables: { input: input }
        })

        return dataJson.data.createStationEvent;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}