import axios from 'axios';
// import * as log from 'loglevel';

import logger from '../logger'

import { apiIPAddress } from '../settings/settings'
const operator = 'devices'
const log = logger.getLogger('Api')

export async function getDevices() {
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
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
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

export async function deleteDevices(ID) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: apiIPAddress() + operator + '/' + ID,
            headers: {
                'Accept': 'application/json',
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
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
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

export async function postDevices(devices) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: devices
        });

        // Success 🎉
        // log.debug('response',response);
        const data = response.data;
        const dataJson = JSON.parse(data)
        // log.debug('response data json',dataJson);


        return dataJson;


    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
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

export async function putDevices(device, ID) {
    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/html'
            },
            data: device
        });

        // Success 🎉
        // log.debug('response',response);
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
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
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
