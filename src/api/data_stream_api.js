import axios from 'axios';
import * as log from 'loglevel';

import { apiIPAddress } from '../settings/settings'

import https from 'https'

const operator = 'data_stream'

const logger = log.getLogger('Positions_Api', "Position");

// https.globalAgent.options.rejectUnauthorized = false;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  })

export async function getDataStream() {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator,
            headers: {
                'X-API-Key': '123456',
                'Access-Control-Allow-Origin': '*'
            },
            httpsAgent: httpsAgent
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
        throw error
    }


}
