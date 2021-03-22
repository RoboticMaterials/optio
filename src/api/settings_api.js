/**
 * All of the API calls for Settings
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 18 20201
 * Edited by: Daniel Castillo
 * 
 *  NEEDS TO BE FIXED
 *  WORKS FOR NOW
 * 
 * Add flow for when there are no settings
 * 
 */

// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

import getUserOrgId from './user_api'

// import the GraphQL queries, mutations and subscriptions
import { settingsByOrgId } from '../graphql/queries';
import { createSettings, updateSettings } from '../graphql/mutations';

export async function getSettings() {
    try {

        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: settingsByOrgId,
            variables: { organizationId: userOrgId }
        })

        let settings = res.data.SettingsByOrgId.items[0]

        let GQLdata = {
            ...settings,
            loggers: JSON.parse(settings.loggers),
            shiftDetails: JSON.parse(settings.shiftDetails),
            timezone: JSON.parse(settings.timezone)
        }
        
        return GQLdata;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function postSettings(settings) {
    try {

        const input = {
            ...settings,
            loggers: JSON.stringify(settings.loggers),
            shiftDetails: JSON.stringify(settings.shiftDetails),
            timezone: JSON.stringify(settings.timezone)
        }

        delete input.createdAt
        delete input.updatedAt

        let dataJson = await API.graphql({
            query: createSettings,
            variables: { input: input }
        })

        return dataJson.data.createTask;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function putSettings(settings) {
    try {

        const input = {
            ...settings,
            loggers: JSON.stringify(settings.loggers),
            shiftDetails: JSON.stringify(settings.shiftDetails),
            timezone: JSON.stringify(settings.timezone)
        }

        delete input.createdAt
        delete input.updatedAt

        let dataJson = await API.graphql({
            query: updateSettings,
            variables: { input: input }
        })

        return dataJson.data.createTask;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
