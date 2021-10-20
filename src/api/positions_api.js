import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import { getHeaders, handleError } from './helpers';

const operator = 'positions'


export async function getPositions() {
    try {
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + operator,
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

export async function deletePosition(ID) {
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


export async function postPosition(position) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: JSON.stringify(position)
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function putPosition(position, ID) {

    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders(),
            data: position
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

