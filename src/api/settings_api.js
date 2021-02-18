import axios from 'axios';
// import * as log from 'loglevel';
import logger from '../logger'

import { apiIPAddress } from '../settings/settings'

import store from '../redux/store'
const token = '123456'//store.getState().cognotoUserSession

const operator = 'settings'

const log = logger.getLogger('Api')

export async function getSettings() {
    try {
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + operator,
            headers:{
                'X-API-Key': '123456'
            }
            // token: token.username
        });
        // Success 🎉
        log.debug('getSettings response', response);
        const data = response.data;

        const dataJson = JSON.parse(data)
        log.debug('getSettings dataJson', dataJson);
        return dataJson;

        // const settings = {
        //   mir_ip: '10.1.12.136',
        //   idle_task: 'Bring me beer',
        //   charge_location: 'Station'
        // }
        // return settings;

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

export async function postSettings(settings) {
    console.log(settings)
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': '123456'
            },
            data: settings
        });

        // Success 🎉
        log.debug('response', response);
        const data = response.data;
        const dataJson = JSON.parse(data)
        log.debug('response data json', dataJson);
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
