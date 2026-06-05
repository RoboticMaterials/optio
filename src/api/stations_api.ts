// @ts-nocheck
import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import store from '../redux/store'
import { getHeaders, handleError } from './helpers';

const operator = 'stations'

const parseResponseData = (data) => {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data)
        } catch (e) {
            return data
        }
    }
    return data
}

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
        return parseResponseData(data);


    } catch (error) {
        handleError(error);
    }


}

export async function getStation(id) {
    
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + `${operator}/${id}`,
            headers: getHeaders()
        });
        // Success 🎉
        const data = response.data;
        return parseResponseData(data);


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
        return parseResponseData(data)

    } catch (error) {
        handleError(error);
    }
}


export async function postStation(station) {

    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        station.map_id = currMapId
        station.created_at = (new Date()).getTime();

        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: JSON.stringify(station)
        });

        // Success 🎉
        const data = response.data;
        return parseResponseData(data);


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
        return parseResponseData(data);


    } catch (error) {
        handleError(error);
    }
}

export async function getStationStatistics(id, startDate, endDate) {
    const startUTC = startDate.getTime();
    const endUTC = !!endDate ? endDate.getTime() : null;

    let url = apiIPAddress() + operator + '/' + id + `/statistics`
    url += `?start_date=${startUTC}`
    if (!!endUTC) {
        url += `&end_date=${endUTC}`
    }

    try {
        const response = await axios({
            method: 'GET',
            url,
            headers: getHeaders(),
        });
        
        // Success 🎉
        const data = response.data;
        return parseResponseData(data);


    } catch (error) {
        handleError(error);
    }
}