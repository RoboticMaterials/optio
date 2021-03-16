import axios from 'axios';
import {apiIPAddress} from '../settings/settings'
import * as log from 'loglevel';

const operator = 'analysis'

export async function getTasksAnalysis() {
  try {
    const response = await axios({
      method: 'GET',
      url: apiIPAddress() + operator,
      headers: {
        'X-API-Key': '123456',
        'Access-Control-Allow-Origin': '*'
    }
    });

    // Success 🎉
    // log.debug('getTasks :res:',response);
    const data = response.data;
    // const dataJson = JSON.parse(data)
    // log.debug('getTasks: dataJson: ', dataJson)

    return data;

} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.error('error.response.data', error.response.data);
        console.error('error.response.status',error.response.status);
        console.error('error.response.headers',error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.error('error.request', error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        console.error('error.message', error.message);
    }
    throw error
    console.error('error', error);
  }


};

export async function getTaskAnalysis(id) {
  // log.debug('getTask: id: ', id)
  try {
    const response = await axios({
      method: 'GET',
      url: apiIPAddress() + operator + '/' + id,
      headers: {
        'X-API-Key': '123456',
        'Access-Control-Allow-Origin': '*'
    }
    });
    // Success 🎉
    // log.debug('getTask: response: ', response);
    const data = response.data;
    // log.debug('getTask: dataJson:', dataJson)
    return data;


} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.error('getTask: error.response.data', error.response.data);
        console.error('getTask: error.response.status',error.response.status);
        console.error('getTask: error.response.headers',error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.error('getTask: error.request', error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        console.error('getTask: error.message', error.message);
    }
    throw error
    console.error('getTask: error', error);
  }


};
