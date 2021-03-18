/** 
 * All of the API calls for Cards
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
import { statusByOrgId } from '../graphql/queries'
import { createStatus } from '../graphql/mutations'

// to get user org id
import getUserOrgId from './user_api'


export async function getStatus() {
    try {
        const userOrgId = await getUserOrgId()

        const dataJson = await API.graphql({
            query: statusByOrgId,
            variables: { organizationId: userOrgId }
          })
          
        return dataJson.data.statusByOrgId;

    } catch (error) {

        // Error 😨
        errorLog(error)

    }
}

export async function postStatus(status) {
    try {

        const userOrgId = await getUserOrgId()
        
        status = {
            ...status,
            organizationId: userOrgId
        }
        const dataJson = await API.graphql({
            query: createStatus,
            variables: { input: status }
          })
          
        return dataJson.data.createDevice;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
