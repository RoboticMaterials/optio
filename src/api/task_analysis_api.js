/** 
 * All of the API calls for Task Analysis
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: April 5 2021
 * Edited by: Daniel Castillo
 * 
 **/

// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { taskStats } from '../graphql/mutations'

// to get user org id
import getUserOrgId from './user_api'

export async function getTasksAnalysis() {
  try {
    const userOrgId = await getUserOrgId()

    const res = await API.graphql({
      query: taskStats,
      variables: { organizationId: userOrgId }
    })

    // Success 🎉
    return JSON.parse(res.data.taskStats.custom_task)

} catch (error) {
    // Error 😨
    errorLog(error)
  }
};

export async function getTaskAnalysis(id) {
  try{
    const userOrgId = await getUserOrgId()

    const res = await API.graphql({
      query: taskStats,
      variables: { organizationId: userOrgId }
    })

    // Success 🎉
    return JSON.parse(res.data.taskStats.custom_task)
} catch (error) {
    // Error 😨
    errorLog(error)
  }
};
