import * as log from "loglevel";

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { listPositions } from '../graphql/queries'
import { 
  createPosition, 
  updatePosition 
} from '../graphql/mutations'

import { deletePosition as deletePositionbyID } from '../graphql/mutations'

export async function getPositions() {
  try {

    const res = await API.graphql({
      query: listPositions
    })
    
    const GQLdata = res.data.listPositions.items

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
    throw error;
  }
}

export async function deletePosition(ID) {
  try {

    const id = {id: ID}

    const dataJson = await API.graphql({
      query: deletePositionbyID,
      variables: { input: id }
    })

    return dataJson;
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

export async function postPosition(position) {
  try {

    // Amplify!

    const input = {
      ...position,
      pos_x: parseFloat(position.pos_x),
      pos_y: parseFloat(position.pos_y),
      _id: position._id.toString(),
      id: position._id
    }

    delete input.neame

    const pos = await API.graphql({
      query: createPosition,
      variables: { input: input }
    })

    return pos;
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

export async function putPosition(position, ID) {
  try {
    const input = {
      ...position,
      pos_x: parseFloat(position.pos_x),
      pos_y: parseFloat(position.pos_y),
      x: parseInt(position.x),
      y: parseInt(position.y),
      _id: position._id.toString()
    }

    // delete input.id
    delete input.createdAt
    delete input.updatedAt

    console.log(input)

    const dataJson = await API.graphql({
      query: updatePosition,
      variables: { input: input }
    })

    return dataJson;
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
