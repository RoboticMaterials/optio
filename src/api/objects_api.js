/** 
 * All of the API calls for Objects
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
import { listObjects } from '../graphql/queries'
import { createObject, updateObject } from '../graphql/mutations'
import { deleteObject as deleteObjectByID } from '../graphql/mutations'

export async function getObjects() {
  try {

    const res = await API.graphql({
      query: listObjects
    })

    console.log(res.data.listObjects.items)

    return res.data.listObjects.items
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

    console.log(object)

    const input =  {
      ...object,
      id: object._id
    }
    const dataJson = await API.graphql({
        query: createObject,
        variables: { input: input }
    })

    return dataJson;

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