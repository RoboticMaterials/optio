// import for logging
import * as log from "loglevel";

// import the amplify modules needed
import { API } from 'aws-amplify'

import getUserOrgId from './user_api'

// import the GraphQL queries, mutations and subscriptions
import { processesByOrgId } from '../graphql/queries';
import { createProcess, updateProcess } from '../graphql/mutations';
import { deleteProcess as deleteProcessByID } from '../graphql/mutations';
import errorLog from "./errorLogging";

export async function getProcesses() {
  try {

    const userOrgId = await getUserOrgId()

    // get the data
    const res = await API.graphql({
      query: processesByOrgId,
      variables: {
        organizationId: userOrgId 
      }
    })

    const GQLdata = []

    // change the data into json
    res.data.ProcessesByOrgId.items.forEach(process => {
        GQLdata.push( {
          ...process,
          routes: JSON.parse(process.routes),
          broken: JSON.parse(process.broken),
        })
    });

    return GQLdata;
  } catch (error) {
    errorLog(error)
  }
}

export async function deleteProcess(ID) {
  try {

    await API.graphql({
      query: deleteProcessByID,
      variables: { input: {id: ID} }
    })

    return 'All Deleted';
  } catch (error) {
    errorLog(error)
  }
}

export async function postProcesses(process) {
  try {
    let input = process

    const userOrgId = await getUserOrgId()
   
    input = {
      ...process,
      organizationId: userOrgId,
      id: process.id,
      routes: JSON.stringify(process.routes),
      broken: JSON.stringify(process.broken),
    }
  
    delete input.neame

    let dataJSON = await API.graphql({
      query: createProcess,
      variables: { input: input }
    })

    dataJSON = {
      ...dataJSON.data.createProcess,
      routes: JSON.parse(dataJSON.data.createProcess.routes),
      broken: JSON.parse(dataJSON.data.createProcess.broken),
    }

    return dataJSON;
  } catch (error) {
    errorLog(error)
  }
}

export async function putProcesses(process, ID) {
  try {
    let input = process

    input = {
      ...process,
      id: process.id,
      routes: JSON.stringify(process.routes),
      broken: JSON.stringify(process.broken),
    }

    let dataJSON = await API.graphql({
      query: updateProcess,
      variables: { input: input }
    })

    dataJSON = {
        ...dataJSON.data.updateProcess,
        routes: JSON.parse(dataJSON.data.updateProcess.routes),
        broken: JSON.parse(dataJSON.data.updateProcess.broken),
    }

    return dataJSON;
  } catch (error) {
    errorLog(error)
  }
}
