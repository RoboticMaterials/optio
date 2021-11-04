import axios from 'axios';


import { apiIPAddress } from '../settings/settings'
import store from '../redux/store'
import { getHeaders, handleError } from './helpers';

const operator = 'processes'


export async function getProcesses() {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + `site_maps/${currMapId}/${operator}`,
            headers: getHeaders()
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
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
        const data = response.data;
        const dataJson = JSON.parse(data)
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
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}
