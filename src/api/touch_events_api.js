import axios from 'axios';
// import * as log from 'loglevel';

import logger from '../logger'

import { apiIPAddress } from '../settings/settings'
import { getHeaders, handleError } from './helpers';
const operator = 'touch_events'
const log = logger.getLogger('Api')

export async function getLotTouchEvents(lotID) {
    try {
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + operator + '/lot/' + lotID, 
            headers: getHeaders(),
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }

}

export async function deleteTouchEvent(ID) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders(),
        });

        // Success 🎉
        // log.debug('response',response);
        // const data = response.data;
        // const dataJson = JSON.parse(data)
        return response;


    } catch (error) {
        handleError(error);
    }
}

export async function postTouchEvent(touchEvent) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: touchEvent
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}