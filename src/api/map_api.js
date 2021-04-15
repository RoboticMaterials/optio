/** 
 * All of the API calls for Map 
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
import {cardsByOrgId, mapsByOrgId} from '../graphql/queries.ts'

import getUserOrgId from './user_api'
import {streamlinedGraphqlCall, TRANSFORMS} from "../methods/utils/api_utils";
import {parseLot} from "../methods/utils/data_utils";

export async function getMaps() {
  try {
    const userOrgId = await getUserOrgId()
      console.log("getMaps userOrgId",userOrgId)

    const maps = await streamlinedGraphqlCall(TRANSFORMS.QUERY, mapsByOrgId, { organizationId: userOrgId })

    return maps

} catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function getMap(mapId) {
  try {

    const userOrgId = await getUserOrgId()

    const res = await API.graphql({
        query: mapsByOrgId,
        variables: { 
          organizationId: userOrgId,
          filter: {id: {eq: mapId}}
         }
      })

    return res.data.MapsByOrgId.items[0] ? res.data.MapsByOrgId.items[0] : {}

  } catch (error) {
      // Error 😨
      errorLog(error)
    }
}
