import axios from 'axios';


import { apiIPAddress } from '../settings/settings'
const operator = 'work_instructions'


export async function getWorkInstruction(id) {
    try {
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + operator + "/" + id,
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

            console.error('error.response.data', error.response.data);
            console.error('error.response.status', error.response.status);
            console.error('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.error('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.error('error.message', error.message);
        }
        console.error('error', error);
    }

}

export async function getWorkInstructions() {
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

            console.error('error.response.data', error.response.data);
            console.error('error.response.status', error.response.status);
            console.error('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.error('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.error('error.message', error.message);
        }
        console.error('error', error);
    }

}

export async function deleteWorkInstruction(ID) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: apiIPAddress() + operator + '/' + ID,
            headers: {
                'Accept': 'application/json',
                'X-API-Key': '123456',
                'Access-Control-Allow-Origin': '*'
            },
        });

        return response;

    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            console.error('error.response.data', error.response.data);
            console.error('error.response.status', error.response.status);
            console.error('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.error('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.error('error.message', error.message);
        }
        console.error('error', error);
    }
}

export async function postWorkInstruction(workInstruction) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': '123456',
                'Access-Control-Allow-Origin': '*'
            },
            data: workInstruction
        });

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
            console.error('error.response.data', error.response.data);
            console.error('error.response.status', error.response.status);
            console.error('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.error('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.error('error.message', error.message);
        }
        console.error('error', error);
    }
}

export async function putWorkInstruction(workInstruction, ID) {
    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '123456',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            data: workInstruction
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
            console.error('error.response.data', error.response.data);
            console.error('error.response.status', error.response.status);
            console.error('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.error('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            console.error('error.message', error.message);
        }
        console.error('error', error);
    }
}
