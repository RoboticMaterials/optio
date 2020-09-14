import axios from 'axios';

import {apiIPAddress} from '../settings/settings';

import log from '../logger';
const logger = log.getLogger('Map_Api', "Map");

const operator = 'site_maps';

export async function getMaps() {
  try {
    const response = await axios({
      method: 'GET',
      url: apiIPAddress() + operator,
    });

    // Success 🎉
    // log.debug('res',response);

    const data = response.data;
    const dataJson = JSON.parse(data);
    logger.debug('getMaps: dataJson', dataJson);

    return dataJson;


} catch (error) {

    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        logger.debug('error.response.data', error.response.data);
        logger.debug('error.response.status',error.response.status);
        logger.debug('error.response.headers',error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        logger.debug('error.request', error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        logger.debug('error.message', error.message);
    }

    logger.debug('error', error);
    throw error;
  }


}

export async function getMap(map_id) {
  try {
    const response = await axios({
      method: 'GET',
      url: apiIPAddress() + operator + '/' + map_id,
      headers: {
        'Accept': 'application/json',
      },
  });

  // Success 🎉
  logger.debug('getMap: response',response);

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
          logger.debug('error.response.data', error.response.data);
          logger.debug('error.response.status',error.response.status);
          logger.debug('error.response.headers',error.response.headers);
      } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          logger.debug('error.request', error.request);
      } else {
          // Something happened in setting up the request and triggered an Error
          logger.debug('error.message', error.message);
      }
      logger.debug('error', error);
    }
}
