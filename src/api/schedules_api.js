import { TEMP_NEW_SCHEDULE_ID, DEFAULT_TASK_ID } from '../constants/scheduler_constants';
import axios from 'axios';
import * as log from 'loglevel';

import {apiIPAddress} from '../settings/settings'
const operator = 'schedules'

export async function getSchedules() {
  try {
    const response = await axios({
      method: 'get',
      url: apiIPAddress() + operator,
      headers: {
        'X-API-Key': '123456'
    }
    });
    // Success 🎉
    // log.debug('res',response);
    const data = response.data;
    const dataJson = JSON.parse(data)
    // log.debug('dataJson', dataJson)
    // log.debug('getSchedulesdataJson', dataJson[0]._id.$oid)
    return dataJson;


} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        log.debug('error.response.data', error.response.data);
        log.debug('error.response.status',error.response.status);
        log.debug('error.response.headers',error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        log.debug('error.request', error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        log.debug('error.message', error.message);
    }
    throw error
    log.debug('error', error);
  }


}

export async function getSchedule(scheduleId) {
  try {
    const response = await axios({
      method: 'get',
      url: apiIPAddress() + operator + '/' + scheduleId,
    });
    // Success 🎉
    // log.debug('res',response);
    const data = response.data;
    const dataJson = JSON.parse(data)
    // log.debug('dataJson', dataJson)
    // log.debug('getSchedulesdataJson', dataJson[0]._id.$oid)
    return dataJson;


} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        log.debug('error.response.data', error.response.data);
        log.debug('error.response.status',error.response.status);
        log.debug('error.response.headers',error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        log.debug('error.request', error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        log.debug('error.message', error.message);
    }
    throw error
    log.debug('error', error);
  }


}

export async function postSchedule(schedule) {
  // log.debug('createSchedule start:',schedule)
  try {
    const response = await axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      url: apiIPAddress() + operator,
      data: schedule
    });

    // Success 🎉
    // log.debug('createSchedule: response',response);
    const data = response.data;
    const dataJson = JSON.parse(data)
    // log.debug('createSchedule: dataJson', dataJson)

    return dataJson;

} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        log.debug('error.response.data', error.response.data);
        log.debug('error.response.status',error.response.status);
        log.debug('error.response.headers',error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        log.debug('error.request', error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        log.debug('error.message', error.message);
    }
    throw error
    log.debug('error', error);
  }


}

export async function deleteSchedule(scheduleId) {
  // log.debug('deleteSchedule start:',scheduleId)

  try {
    const response = await axios({
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      url: apiIPAddress() + operator + '/' + scheduleId
    });

    // Success 🎉
    // log.debug('deleteSchedule: response',response);
    const data = response.data;

    return response;

} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        log.debug('error.response.data', error.response.data);
        log.debug('error.response.status',error.response.status);
        log.debug('error.response.headers',error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        log.debug('error.request', error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        log.debug('error.message', error.message);
    }
    throw error
    log.debug('error', error);
  }


}

export async function putSchedule(scheduleId, schedule) {
  // log.debug('updateSchedule start:',scheduleId, schedule)

  try {
    const response = await axios({
      method: 'put',
      headers: {
        'Content-Type': 'application/json',

      },
      url: apiIPAddress() + operator + '/' + scheduleId,
      data: JSON.stringify(schedule)
    });

    // Success 🎉
    // log.debug('updateSchedule: response',response);
    const data = response.data;
    const dataJson = JSON.parse(data)
    // log.debug('getSchedulesdataJson', dataJson._id.$oid)
    return dataJson;

    //return response;

} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        log.debug('error.response.data', error.response.data);
        log.debug('error.response.status',error.response.status);
        log.debug('error.response.headers',error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        log.debug('error.request', error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        log.debug('error.message', error.message);
    }
    throw error
    log.debug('error', error);
  }


}
