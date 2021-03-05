import * as log from "loglevel";

import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
const operator = 'data_stream'

// import API from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
// import { listDevices } from '../graphql/queries';

export async function getDataStream() {
  try {

    const response = await axios({
          method: 'get',
          url: apiIPAddress() + operator,
      });

    // Success 🎉
    const data = response.data;
    const dataJson = JSON.parse(data)

    // console.log(dataJson)

    // const res = await API.graphql({
    //   query: listDevices
    // })

    // let GQLdata = []

    // res.data.listDevices.items.forEach(device => {
    //   GQLdata.push( {
    //     ...device,
    //     dashboards: JSON.parse(device.dashboards),
    //     position: JSON.parse(device.processes)
    //   })
    // });

    // console.log(res)

    // const devices = {
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
    // }

    // const status = {
    //   active_map: null,
    //   mir_connection: "connected",
    //   pause_status: false,
    //   _id: {$oid: "6040fa3d76935861d7d305e0"}
    // }

    // const taskQueue = []

    // const dataJson = {
    //   devices: devices,
    //   status: status,
    //   task_queue: taskQueue
    // }

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
    throw error;
  }
}
