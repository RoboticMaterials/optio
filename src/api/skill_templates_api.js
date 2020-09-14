import axios from 'axios';
import * as log from 'loglevel';

import {apiIPAddress} from '../settings/settings'
const operator = 'templates'


export async function getSkillTemplates() {
  try {
    const response = await axios({
      method: 'get',
      url: apiIPAddress() + operator,
    });
    // Success 🎉
    const data = response.data;
    const dataJson = JSON.parse(data)
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
    log.debug('error', error);
  }
}


export async function postSkillTemplate(condition) {
  try {
    const response = await axios({
      method: 'POST',
      url: apiIPAddress() + operator,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: JSON.stringify(condition)
  });
  // Success 🎉
  const data = response.data;
  return data;


  } catch (error) {

      // Error 😨
      if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          log.debug('QQQQ error.response.data', error.response.data);
          log.debug('QQQQ error.response.status',error.response.status);
          log.debug('QQQQ error.response.headers',error.response.headers);
      } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          log.debug('QQQQ error.request', error.request);
      } else {
          // Something happened in setting up the request and triggered an Error
          log.debug('QQQQ error.message', error.message);
      }
      log.debug('error', error);
    }
}