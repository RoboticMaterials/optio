import axios from 'axios';
// import * as log from 'loglevel';

import logger from '../logger'

import store from '../redux/store'
import { apiIPAddress } from '../settings/settings'
import { getHeaders, handleError } from './helpers';
const operator = 'touch_events'
const log = logger.getLogger('Api')

export async function getLotTouchEvents(lotID) {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator + '/lot/' + lotID, 
            headers: getHeaders(),
        });
        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }

}

export async function getOpenTouchEvents() {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator + '/site_maps/' + currMapId + '/open_events', 
            headers: getHeaders(),
        });
        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }

}

export async function getOpenStationTouchEvents(stationId) {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator + '/station/' + stationId + '/open_events', 
            headers: getHeaders(),
        });
        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
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

export async function openTouchEvent(touchEvent) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator + '?option=open',
            headers: getHeaders(),
            data: touchEvent
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function closeTouchEvent(touchEvent) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator + '?option=close',
            headers: getHeaders(),
            data: touchEvent
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


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
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}