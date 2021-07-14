import axios from 'axios';
import * as log from 'loglevel';

import { apiIPAddress } from '../settings/settings'
const operator = 'integrations'

const logger = log.getLogger('Integrations_Api', "Integrations");

export async function getIntegrations() {
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
        log.debug('error.response.status',error.response.status);
        log.debug('error.response.headers',error.response.headers);
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
  }


}

export async function disableIntegration(integrationId) {
    try {
      const response = await axios({
        method: 'POST',
        url: apiIPAddress() + operator + '/disable/' + integrationId,
        headers: {
            'X-API-Key': '123456',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    });
  
    // Success 🎉
    const data = response.data;
    const dataJson = JSON.parse(data)

    return dataJson
  
    } catch (error) {
  
        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status',error.response.status);
            log.debug('error.response.headers',error.response.headers);
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


export async function getIntegrationCards(endpoint) {
  try {
    const response = await axios({
      method: 'GET',
      url: apiIPAddress() + operator + '/cards/' + endpoint,
      headers: {
        'X-API-Key': '123456',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
  });

  // Success 🎉
  const data = response.data;
  const dataJson = JSON.parse(data)

  return dataJson

  } catch (error) {

      // Error 😨
      if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          log.debug('error.response.data', error.response.data);
          log.debug('error.response.status',error.response.status);
          log.debug('error.response.headers',error.response.headers);
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


export async function authIntegration(endpointId, credentials) {

  try {
    const response = await axios({  
      method: 'POST',
      url: apiIPAddress() + operator + '/auth?endpointId=' + endpointId,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '123456',
        'Access-Control-Allow-Origin': '*'
      },
      data: JSON.stringify(credentials)
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
          log.debug('error.response.status',error.response.status);
          log.debug('error.response.headers',error.response.headers);
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

export async function shopifyIntegrationToken(params) {

    try {
      const response = await axios({  
        method: 'POST',
        url: apiIPAddress() + operator + '/shopify/token',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': '123456',
          'Access-Control-Allow-Origin': '*'
        },
        data: JSON.stringify(params)
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
            log.debug('error.response.status',error.response.status);
            log.debug('error.response.headers',error.response.headers);
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
  