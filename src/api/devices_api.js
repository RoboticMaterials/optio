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

    // GQLdata.push({
    //   battery_percentage: 20,
    //   current_task_queue_id: null,
    //   dashboards: ["602d6f66a1c90f57ca2109f5"],
    //   device_model: "MiR100",
    //   device_name: "MiR_SIM_2",
    //   distance_to_next_target: 0,
    //   idle_location: "481ea550-671b-4b99-9ee5-e524a97fa570",
    //   map_id: "a7524472-22a1-11ea-aeda-94c691a739e9",
    //   position: {orientation: 0, x: 0.6762762998431764, y: 0.9549511633386146, pos_x: 0.6762762998431764, pos_y: 0.9549511633386146},
    //   shelf_attached: 0,
    //   state_text: "Ready",
    //   id: "5daf07c8-f866-11ea-adc1-0242ac120002",
    // })
    
    // // return GQLdata;
    
    // const response = await axios({
    //   method: "get",
    //   url: apiIPAddress() + operator,
    //   headers: {
    //     "X-API-Key": "123456",
    //     "Access-Control-Allow-Origin": "*",
    //   },
    //   // token: token.username
    // });
    // // Success 🎉
    // const data = response.data;
    // const dataJson = JSON.parse(data);

    console.log( GQLdata)

    if (GQLdata.length === 0){
      postDevices({
        battery_percentage: 20,
        current_task_queue_id: null,
        dashboards: ["602d6f66a1c90f57ca2109f5"],
        device_model: "MiR100",
        device_name: "MiR_SIM_2",
        distance_to_next_target: 0,
        idle_location: "481ea550-671b-4b99-9ee5-e524a97fa570",
        map_id: "a7524472-22a1-11ea-aeda-94c691a739e9",
        position: {orientation: 0, x: 0.6762762998431764, y: 0.9549511633386146, pos_x: 0.6762762998431764, pos_y: 0.9549511633386146},
        shelf_attached: 0,
        state_text: "Ready",
        _id: "5daf07c8-f866-11ea-adc1-0242ac120002",
      })
    }

    return GQLdata;
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

export async function deleteDevices(ID) {
  try {
    const response = await axios({
      method: "DELETE",
      url: apiIPAddress() + operator + "/" + ID,
      headers: {
        Accept: "application/json",
        "X-API-Key": "123456",
      },
    });

    // Success 🎉
    // log.debug('response',response);
    // const data = response.data;
    // const dataJson = JSON.parse(data)
    return response;
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

    // Amplify!

    console.log('post device')

    const input = {
        ...devices,
        dashboards: JSON.stringify(devices.dashboards),
        position: JSON.stringify(devices.position)
    }

    delete input.neame

    const dataJ = await API.graphql({
      query: createDevice,
      variables: { input: input }
    })

    console.log(dataJ)

    // return dataJson;
    const response = await axios({
      method: "POST",
      url: apiIPAddress() + operator,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Key": "123456",
      },
      data: devices,
    });

    // Success 🎉
    // log.debug('response',response);
    const data = response.data;
    const dataJson = JSON.parse(data);
    // log.debug('response data json',dataJson);

    return dataJson;
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
    const response = await axios({
      method: "PUT",
      url: apiIPAddress() + operator + "/" + ID,
      headers: {
        "Content-Type": "application/json",
        Accept: "text/html",
        "X-API-Key": "123456",
      },
      data: device,
    });

    // Success 🎉
    // log.debug('response',response);
    const data = response.data;
    const dataJson = JSON.parse(data);
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
