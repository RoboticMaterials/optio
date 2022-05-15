import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import { getHeaders, handleError } from './helpers';
import throttle from "lodash.throttle"


const operator = 'settings'


export const getSettings = throttle(async function () {
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

},1000,{leading:true,trailing:false});

export const postSettings = throttle(async function (settings) {
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
},1000,{leading:true,trailing:true});

