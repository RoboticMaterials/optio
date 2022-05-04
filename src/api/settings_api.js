import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import { getHeaders, handleError } from './helpers';

const operator = 'settings'


export async function getSettings() {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator,
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

export async function postSettings(settings) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: settings
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
