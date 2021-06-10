import axios from 'axios';


import {apiIPAddress} from '../settings/settings';
const operator = 'pdf';


export async function getPdfs() {
  try {

    const response = await axios({
      method: 'get',
      url: apiIPAddress() + operator,
      headers: {
        'X-API-Key': '123456',
      }
    });

    // Success
    const data = response.data;
    console.error("getImage data", data)

    const dataJson = JSON.parse(data);
    console.error("getImage dataJson", dataJson)
    return dataJson;


} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.error('error.response.data', error.response.data);
        console.error('error.response.status',error.response.status);
        console.error('error.response.headers',error.response.headers);
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

export async function getPdf(id) {
    try {

        console.log('getPdf called',id)
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
        console.log('getPdf',dataJson)
        return dataJson;


    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
			 * The request was made and the server responded with a
			 * status code that falls out of the range of 2xx
			 */
            console.error('error.response.data', error.response.data);
            console.error('error.response.status',error.response.status);
            console.error('error.response.headers',error.response.headers);
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

export async function postPdf(pdf) {
    try {

        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'X-API-Key': '123456',
                // 'Accept': 'application/json',
                // 'Access-Control-Allow-Origin': '*'
            },
            body: {pdf},
            pdf,
            data: pdf,
        });

        // Success
        const responseData = response.data;


        const responseDataJson = JSON.parse(responseData);
        console.log('responseDataJson',responseDataJson)
        return responseDataJson;

    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
			 * The request was made and the server responded with a
			 * status code that falls out of the range of 2xx
			 */
            console.error('error.response.data', error.response.data);
            console.error('error.response.status',error.response.status);
            console.error('error.response.headers',error.response.headers);
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
