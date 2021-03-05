import * as log from "loglevel";

// import the amplify modules needed
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { listStatuss } from '../graphql/queries';
import { createStatus } from '../graphql/mutations';

export async function getStatus() {
  try {

    // get the data
    const res = await API.graphql({
      query: listStatuss
    })

    return res.data.listStatuss.items[0];
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
    throw error;
  }
}

export async function postStatus(status) {
  // log.debug("postStatus: started: status", status)
  try {
    const input = {
        ...status
      }

    delete input.neame

    const dataJSON = await API.graphql({
      query: createStatus,
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
    throw error;
  }
}
