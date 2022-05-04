import axios from 'axios';


import { apiIPAddress } from '../settings/settings'
import store from '../redux/store'
import { getHeaders, handleError } from './helpers';

const operator = 'processes'


export async function getProcesses() {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + `site_maps/${currMapId}/${operator}`,
            headers: getHeaders()
        });
        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error)
    }

}

export async function deleteProcess(ID) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders(),
        });

        // Success 🎉
        return response;


    } catch (error) {
        handleError(error);
    }
}

export async function postProcesses(process) {

    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        process.map_id = currMapId
        
        process.created_at = (new Date()).getTime();

        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: process
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function putProcesses(process, ID) {

    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders(),
            data: process
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function getProcessStatistics(id, startDate, endDate) {
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
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)

        return dataJson;


    } catch (error) {
        handleError(error);
    }
}