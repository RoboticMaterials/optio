import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import store from '../redux/store'
import { getHeaders, handleError } from './helpers';

const operator = 'dashboards'

export async function getDashboards() {
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
        handleError(error);
    }

}

export async function deleteDashboards(ID) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders()
        });

        // Success 🎉
        return response;


    } catch (error) {
        handleError(error);
    }
}

export async function postDashboards(dashboard) {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        dashboard.map_id = currMapId

        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: dashboard
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        console.log(error)
        handleError(error);
    }
}

export async function putDashboards(dashboard, ID) {

    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders(),
            data: dashboard
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}
