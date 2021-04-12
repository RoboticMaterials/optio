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
import { createReportEvent, reportStats } from '../graphql/mutations.ts'
import { reportEventByOrgId } from '../graphql/queries.ts'

// to get user org id
import getUserOrgId from './user_api'

import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
const operator = 'report_events'

export async function getReportEvents() {
    try {
        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: reportEventByOrgId,
            variables: { organizationId: userOrgId }
          })

        return res.data.ReportEventByOrgId.items

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function deleteReportEvent(ID) {
    // report events should not be deleted
}

export async function postReportEvent(reportEvent) {
    try {

        const userOrgId = await getUserOrgId()

        const input = {
            ...reportEvent,
            organizationId: userOrgId,
            date: Math.round(Date.now() / 1000)
        }

        const dataJson = await API.graphql({
            query: createReportEvent,
            variables: { input: input }
        })

        return dataJson;


    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function putReportEvent(reportEvent, ID) {
    // This never gets used
    // No need to actually add this call
}

export async function getReportAnalytics(stationId, timeSpan) {
    try {

        const input = {
            stationId,
            timeSpan,
            index: 0
        }
        
        const dataJson = await API.graphql({
            query: reportStats,
            variables: { input: input }
        })

        return dataJson;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
