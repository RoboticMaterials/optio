import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import store from '../redux/store'
import { getHeaders, handleError } from './helpers';

export async function clearMap(password='R0boticmaterials!') {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId

        const response = await axios({
            method: 'delete',
            url: apiIPAddress() + `development/clear/${currMapId}?password=${password}`,
            headers: getHeaders(),
        });
        // Success 🎉
        const data = response.data;
        console.log(response)
        // const dataJson = JSON.parse(data)
        return data;


    } catch (error) {
        console.log(error)
        handleError(error)
    }

}