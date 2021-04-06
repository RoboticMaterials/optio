import axios from 'axios';
import log from "../logger"

import { apiIPAddress } from '../settings/settings'
const operator = 'task_queue'

const logger = log.getLogger("TaskQueue")

export async function getTaskQueue() {
    try {
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + operator,
            headers: {
                'X-API-Key': '123456',
                'Access-Control-Allow-Origin': '*'
            }
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        return dataJson;

    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            log.debug('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            log.debug('error.message', error.message);
        }
        throw error
        log.debug('error', error);
    }


}

export async function postTaskQueue(taskQueueItem) {
    try {
        const response = await axios({
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '123456',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            data: taskQueueItem,
            url: apiIPAddress() + operator,
        });

        // Success 🎉
        log.debug('postTaskQueue: response', response);
        const data = response.data;
        const dataJson = JSON.parse(data)
        log.debug('dataJson', dataJson)
        log.debug('getSchedulesdataJson', dataJson)
        return dataJson;

    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            console.error('postTaskQueue: error.response.data', error.response.data);
            console.error('postTaskQueue: error.response.status', error.response.status);
            console.error('postTaskQueue: error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.error('postTaskQueue: error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.error('postTaskQueue: error.message', error.message);
        }
        throw error
        console.error('postTaskQueue: error', error);
    }


}

export async function deleteTaskQueueAll() {
    try {
        const response = await axios({
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '123456',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            url: apiIPAddress() + operator,
        });

        // Success 🎉
        // log.debug('deleteTaskQueueAll: response',response);
        const data = response.data;

        return data;

    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            console.error('deleteTaskQueueAll: error.response.data', error.response.data);
            console.error('deleteTaskQueueAll: error.response.status', error.response.status);
            console.error('deleteTaskQueueAll: error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.error('deleteTaskQueueAll: error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.error('deleteTaskQueueAll: error.message', error.message);
        }
        throw error
        console.error('deleteTaskQueueAll: error', error);
    }


}


export async function deleteTaskQueueItem(id) {
    try {
        const response = await axios({
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '123456',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            url: apiIPAddress() + operator + '/' + id,
        });

        // Success 🎉
        // log.debug('deleteTaskQueueItem: response',response);
        const data = response.data;

        return data;

    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            console.error('deleteTaskQueueItem: error.response.data', error.response.data);
            console.error('deleteTaskQueueItem: error.response.status', error.response.status);
            console.error('deleteTaskQueueItem: error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.error('deleteTaskQueueItem: error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.error('deleteTaskQueueItem: error.message', error.message);
        }
        throw error
    }
}

export async function putTaskQueueItem(item, ID) {
    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '123456',
                'Accept': 'text/html',
                'Access-Control-Allow-Origin': '*'
            },
            data: item
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        return dataJson;


    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            log.debug('error.request', error.request);

        } else {
            // Something happened in setting up the request and triggered an Error
            log.debug('error.message', error.message);
        }
        log.debug('error', error);
    }
}
