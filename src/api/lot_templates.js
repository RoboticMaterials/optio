import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import store from '../redux/store'
import { getHeaders, handleError } from './helpers'

const operator = 'cards/templates'

export async function getLotTemplate(id) {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator + "/" + id,
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

export async function getLotTemplates() {
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

export async function deleteLotTemplate(ID) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders()
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

export async function postLotTemplate(lotTemplate) {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        lotTemplate.map_id = currMapId

        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: lotTemplate
        });

        // Success 🎉
        // log.debug('response',response);
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        // log.debug('response data json',dataJson);


        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function putLotTemplate(lotTemplate, ID) {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        lotTemplate.map_id = currMapId

        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders(),
            data: JSON.stringify(lotTemplate)
        });

        // Success 🎉
        // log.debug('response',response);
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}
