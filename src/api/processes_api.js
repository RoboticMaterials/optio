// import for logging
import * as log from "loglevel";

// import the amplify modules needed
import { API } from 'aws-amplify'

import getUserOrgId from './user_api'

// import the GraphQL queries, mutations and subscriptions
import { processesByOrgId } from '../graphql/queries';
import { createProcess, updateProcess } from '../graphql/mutations';
import { deleteProcess as deleteProcessByID } from '../graphql/mutations';

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
        })
    });

    return GQLdata;
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */

      log.debug("error.response.data", error.response.data);
      log.debug("error.response.status", error.response.status);
      log.debug("error.response.headers", error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      log.debug("error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      log.debug("error.message", error.message);
    }
    log.debug("error", error);
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
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      log.debug("error.response.data", error.response.data);
      log.debug("error.response.status", error.response.status);
      log.debug("error.response.headers", error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      log.debug("error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      log.debug("error.message", error.message);
    }
    log.debug("error", error);
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
      routes: JSON.stringify(process.routes)
    }
  
    delete input.neame

    let dataJSON = await API.graphql({
      query: createProcess,
      variables: { input: input }
    })

    dataJSON = {
      ...dataJSON.data.createProcess,
      routes: JSON.parse(dataJSON.data.createProcess.routes)
    }

    return dataJSON;
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      log.debug("error.response.data", error.response.data);
      log.debug("error.response.status", error.response.status);
      log.debug("error.response.headers", error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      log.debug("error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      log.debug("error.message", error.message);
    }
    log.debug("error", error);
  }
}

export async function putProcesses(process, ID) {
  try {
    let input = process
   
    input = {
      ...process,
      id: process.id,
      routes: JSON.stringify(process.routes)
    }
  
    let dataJSON = await API.graphql({
      query: updateProcess,
      variables: { input: input }
    })

    dataJSON = {
        ...dataJSON.data.updateProcess,
        routes: JSON.parse(dataJSON.data.updateProcess.routes)
    }  

    return dataJSON;
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      log.debug("error.response.data", error.response.data);
      log.debug("error.response.status", error.response.status);
      log.debug("error.response.headers", error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      log.debug("error.request", error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      log.debug("error.message", error.message);
    }
    log.debug("error", error);
  }
}
