import * as log from "loglevel";

import { getTaskQueue } from './task_queue_api'

import { getDevices } from './devices_api'

import { getStatus } from './status_api'


export async function getDataStream() {
  try {

    const getThoseDevices = await getDevices()

    const getThoseStatuses = await getStatus()

    const getThoseQs = await getTaskQueue()


    const dataJSON = await {
      devices: getThoseDevices,
      status: getThoseStatuses,
      task_queue: getThoseQs
    }

    // console.log(dataJSON)

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
    throw error;
  }
}
