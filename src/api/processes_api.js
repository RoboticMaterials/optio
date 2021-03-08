import axios from "axios";
// import * as log from 'loglevel';

import logger from "../logger";

import { apiIPAddress } from "../settings/settings";


// import the amplify modules needed
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { listProcesss } from '../graphql/queries';
import { createProcess, updateProcess } from '../graphql/mutations';
import { deleteProcess as deleteProcessByID } from '../graphql/mutations';
import { LeakAddTwoTone } from "@material-ui/icons";

const operator = "processes";
const log = logger.getLogger("Api");

export async function getProcesses() {
  try {

    // get the data
    const res = await API.graphql({
      query: listProcesss
    })

    const GQLdata = []

    // change the data into json
    res.data.listProcesss.items.forEach(process => {
        GQLdata.push( {
          ...process,
          routes: JSON.parse(process.routes),
        })
    });

    return GQLdata;
  } catch (error) {
    // Error 😨
    if (error.response) {
      console.log(error)
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

export async function deleteProcesses(ID) {
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
   
    input = {
      ...process,
      id: process._id,
      routes: JSON.stringify(process.routes)
    }
  
    delete input.neame

    let dataJSON = await API.graphql({
      query: createProcess,
      variables: { input: input }
    })

    console.log(dataJSON.data.createProcess)

    dataJSON = {
      ...dataJSON.data.createProcess,
      routes: JSON.parse(dataJSON.data.createProcess.routes)
    }

    return dataJSON;
  } catch (error) {
    console.log(error)
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
      id: process._id,
      routes: JSON.stringify(process.routes)
    }
  
    console.log(input)

    const dataJSON = await API.graphql({
      query: updateProcess,
      variables: { input: input }
    })

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
