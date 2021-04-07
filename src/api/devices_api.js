/** 
 * All of the API calls for Devices
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
import { devicesByOrgId } from '../graphql/queries'
import { createDevice, updateDevice } from '../graphql/mutations'
import { deleteDevice as deleteDeviceByID } from '../graphql/mutations'

// to get user org id
import getUserOrgId from './user_api'

export async function getDevices() {
    try {
        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: devicesByOrgId,
            variables: { organizationId: userOrgId }
          })

        let GQLdata = []

        res.data.DevicesByOrgId.items.forEach(device => {
            GQLdata.push( {
                ...device,
                dashboards: JSON.parse(device.dashboards),
                position: JSON.parse(device.position)
            })
        });
        
        return GQLdata;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function deleteDevices(ID) {
    try {
        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
        query: devicesByOrgId,
        variables:{
            organizationId: userOrgId,
            filter: {id: {eq: ID}}
        }
        })

        const dataJson = await API.graphql({
            query: deleteDeviceByID,
            variables: { input: {id: res.data.TasksByOrgId.items[0].id} }
        })

        return dataJson;

    } catch (error) {
         // Error 😨
         errorLog(error)
    }
}

export async function postDevices(device) {
    try {

        const dataJson = await API.graphql({
            query: createDevice,
            variables: { input: device }
          })
          
        return dataJson.data.createDevice;


    } catch (error) {
         // Error 😨
         errorLog(error)
    }
}

export async function putDevices(device, ID) {
    try {

        const dataJson = await API.graphql({
            query: updateDevice,
            variables: { input: device }
          })
          
        return dataJson.data.updateDevice;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
