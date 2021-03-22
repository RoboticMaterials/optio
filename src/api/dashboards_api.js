/**
 * All of the API calls for Dashboards
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 9 20201
 * Edited by: Daniel Castillo
 * 
 */

// logging for error in API
import errorLog from './errorLogging'

import getUserOrgId from './user_api'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { dashboardsByOrgId } from '../graphql/queries'
import { createDashboard, updateDashboard } from '../graphql/mutations'
import { deleteDashboard as deleteDashboardByID } from '../graphql/mutations'

// For creating a card
import { uuidv4 } from '../methods/utils/utils'

export async function getDashboards() {
    try {

        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: dashboardsByOrgId,
            variables: { organizationId: userOrgId }
        })

        let GQLdata = []

        res.data.DashboardsByOrgId.items.forEach(dash => {
            let data = JSON.parse(dash.data)

            GQLdata.push( {
                id: dash.id,
                organizationId: dash.organizationId,
                ...data
            })
        });
        
        // Success 🎉
        return GQLdata;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function deleteDashboards(ID) {
    try {
        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
        query: dashboardsByOrgId,
        variables:{
            organizationId: userOrgId,
            filter: {id: {eq: ID}}
        }
        })

        await API.graphql({
            query: deleteDashboardByID,
            variables: { input: {id: res.data.DashboardsByOrgId.items[0].id} }
        })

        return 'Deleted'

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function postDashboards(dashboards) {
    try {
        const userOrgId = await getUserOrgId()

        const fakeID = uuidv4();

        let dashboardInput = {
            organizationId: userOrgId,
            data: JSON.stringify(dashboards),
            id: fakeID,
        }

        await API.graphql({
            query: createDashboard,
            variables: { input: dashboardInput }
        })

        return {
            ...dashboards,
            organizationId: userOrgId,
            id: fakeID,
        }

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function putDashboards(dashboard, ID) {
    try {

        let dashboardInput = {
            id: ID ? ID : dashboard.id,
            organizationId: dashboard.organizationId,
        }

        delete dashboard.id
        delete dashboard.organizationId

        dashboardInput = {
            ...dashboardInput,
            data: JSON.stringify(dashboard),
        }

        await API.graphql({
            query: updateDashboard,
            variables: { input: dashboardInput }
        })

        return dashboardInput

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
