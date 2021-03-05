import axios from "axios";
// import * as log from 'loglevel';

import logger from "../logger";

import { apiIPAddress } from "../settings/settings";

import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { listDevices } from '../graphql/queries';
import { createDevice, updateDevice } from '../graphql/mutations';
import { deleteDevice as deleteDeviceByID } from '../graphql/mutations';

const operator = "devices";
const log = logger.getLogger("Api");

export async function getDevices() {
  try {

    const res = await API.graphql({
      query: listDevices
    })

    const GQLdata = []

    res.data.listDevices.items.forEach(device => {
      GQLdata.push( {
        ...device,
        dashboards: JSON.parse(device.dashboards),
        position: JSON.parse(device.position)
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

export async function deleteDevices(ID) {
  try {
    const id = {id: ID}

    const dataJson = await API.graphql({
      query: deleteDeviceByID,
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

export async function postDevices(devices) {
  try {
    const input = {
        ...devices,
        dashboards: JSON.stringify(devices.dashboards),
        position: JSON.stringify(devices.position)
    }

    delete input.neame

    const dataJSON = await API.graphql({
      query: createDevice,
      variables: { input: input }
    })

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

export async function putDevices(device, ID) {
  try {
    const input = {
        ...device,
        dashboards: JSON.stringify(device.dashboards),
        position: JSON.stringify(device.position)
    }

    const dataJson = await API.graphql({
      query: updateDevice,
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
