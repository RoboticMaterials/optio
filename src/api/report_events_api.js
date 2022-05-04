import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import { getHeaders, handleError } from './helpers';
const operator = 'report_events'


export async function postReportEvent(reportEvent) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: reportEvent
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}