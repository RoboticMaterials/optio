/** 
 * All of the API calls for Objects
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 18 20201
 * Edited by: Daniel Castillo
 * 
 **/

// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { objectsByOrgId } from '../graphql/queries'
import { createObject, updateObject } from '../graphql/mutations'
import { deleteObject as deleteObjectByID } from '../graphql/mutations'

import getUserOrgId from './user_api'

export async function getObjects() {
  try {

    const userOrgId = await getUserOrgId()

    const res = await API.graphql({
      query: objectsByOrgId,
      variables: { organizationId: userOrgId }
    })

    return res.data.ObjectsByOrgId.items
} catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function deleteObject(ID) {
  try {
    const id = {id: ID}

    const dataJson = await API.graphql({
      query: deleteObjectByID,
      variables: { input: id }
    })

    return dataJson;

  } catch (error) {
      // Error 😨
      errorLog(error)
    }
} 

export async function postObject(object) {
  try{

    const userOrgId = await getUserOrgId()

    const input =  {
      ...object,
      id: object.id,
      organizationId: userOrgId
    }
    const dataJson = await API.graphql({
        query: createObject,
        variables: { input: input }
    })

    return dataJson.data.createObject;

  } catch (error) {
    console.log(error)
      // Error 😨
      errorLog(error)
  }
}

export async function putObject(object, ID) {
  try {
  
    const dataJson = await API.graphql({
        query: updateObject,
        variables: { input: object }
    })

    return dataJson

  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}