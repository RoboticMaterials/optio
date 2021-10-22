import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import { getHeaders, handleError } from './helpers';
const operator = 'report_events'

export async function getReportEvents() {
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

export async function deleteReportEvent(ID) {
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

export async function postReportEvent(reportEvent) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: reportEvent
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function putReportEvent(reportEvent, ID) {
    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders(),
            data: reportEvent
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}

export async function getReportAnalytics(stationId, timeSpan) {
    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + stationId + '/stats',
            headers: getHeaders(),
            // A timespan is {time_span: 'day', index: 0}
            data: timeSpan
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }


}
