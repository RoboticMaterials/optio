import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import store from '../redux/store'
import { getHeaders, handleError } from './helpers';

const operator = 'stations'

export async function getStations() {
    
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + `site_maps/${currMapId}/${operator}`,
            headers: getHeaders()
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }


}

export async function deleteStation(ID) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders()
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson

    } catch (error) {
        handleError(error);
    }
}


export async function postStation(station) {

    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        station.map_id = currMapId

        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: JSON.stringify(station)
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function putStation(station, ID) {

    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders(),
            data: station
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function getStationAnalytics(id, timeSpan) {
    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + id + '/stats',
            headers: getHeaders(),
            // A timespan is {time_span: 'day', index: 0}
            data: timeSpan
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function updateStationCycleTime(id) {
    try {
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + operator + '/' + id + '/cycle_time',
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