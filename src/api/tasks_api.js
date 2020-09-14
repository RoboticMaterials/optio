import axios from 'axios';
import {apiIPAddress} from '../settings/settings'
import * as log from 'loglevel';

const operator = 'tasks'

export async function getTasks() {
  try {
    const response = await axios({
      method: 'get',
      url: apiIPAddress() + operator,
    });

    // Success 🎉
    // log.debug('getTasks :res:',response);
    const data = response.data;
    const dataJson = JSON.parse(data)
    // log.debug('getTasks: dataJson: ', dataJson)

    return dataJson;

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

export async function getTask(id) {
  // log.debug('getTask: id: ', id)
  try {
    const response = await axios({
      method: 'get',
      url: apiIPAddress() + operator + '/' + id,
    });
    // Success 🎉
    // log.debug('getTask: response: ', response);
    const data = response.data;
    const dataJson = JSON.parse(data)
    // log.debug('getTask: dataJson:', dataJson)
    return dataJson;


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

export async function postTask(task) {
  // log.debug('postTask task:',task, JSON.stringify(task));
  // console.log('QQQQ Posting this task in API', task)

  try {
    const response = await axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/html',
      },
      url: apiIPAddress() + operator,
      data: JSON.stringify(task)
    });

    // Success 🎉
    // log.debug('postTask: response: ', response);
    const data = response.data;
    const dataJson = JSON.parse(data)
    // log.debug('postTask: dataJson: ', dataJson)

    return dataJson;

} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.error('postTask: error.response.data', error.response.data);
        console.error('postTask: error.response.status',error.response.status);
        console.error('postTask: error.response.headers',error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.error('postTask: error.request', error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        console.error('postTask: error.message', error.message);
    }
    throw error
    console.error('postTask: error', error);
  }


};

export async function deleteTask(id) {
  // log.debug('deleteTask: id:',id)

  try {
    const response = await axios({
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      url: apiIPAddress() + operator + '/' + id
    });

    // Success 🎉
    // log.debug('deleteTask: response',response);
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


};

export async function putTask(task, id) {
  try {
    const response = await axios({
      method: 'put',
      headers: {
        'Content-Type': 'application/json',

      },
      url: apiIPAddress() + operator + '/' + id,
      data: JSON.stringify(task)
    });

    // Success 🎉
    // log.debug('putTask: response: ',response);
    const data = response.data;
    const dataJson = JSON.parse(data)
    // log.debug('putTask: dataJson:', dataJson)
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
