import axios from 'axios';
import * as log from 'loglevel';

import { apiIPAddress } from '../settings/settings'


import store from '../redux/store'
const token = store.getState().cognotoUserSession

const operator = 'status'

export async function getStatus() {
    try {
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + operator,
            headers: {
                'X-API-Key': '123456',
                'Access-Control-Allow-Origin': '*'
            }
            // token: token.username
        });
        // Success 🎉
        //  log.debug('THE STATE OF PLAY IS!!! on get status',response);
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
        throw error;

    }


}

export async function postStatus(status) {
    // log.debug("postStatus: started: status", status)
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '123456',
                'Accept': 'application/json'
            },
            data: status
        });

        // Success 🎉
        // log.debug('postStatus: response: ',response);
        // const data = response.data;
        // const dataJson = JSON.parse(data)
        // log.debug('response data json',dataJson);

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
        throw error;
    }
}
