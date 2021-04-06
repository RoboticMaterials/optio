import axios from 'axios';

import log from '../logger';

import {apiIPAddress} from '../settings/settings';
const operator = 'safe_move_arm';
const logger = log.getLogger('Safe_arm_move', 'Safe_arm_move');

export async function postSafeArmMove(poseId) {
  try {

    const response = await axios({
      method: 'post',
      url: apiIPAddress() + operator,
      data: {pose_id: poseId},
      headers:{
        'X-API-Key': '123456',
      }
    });

    // Success
    const data = response.data;
    logger.debug("postSafeArmMove data", data)

    const dataJson = JSON.parse(data);
    logger.debug("postSafeArmMove dataJson", dataJson)
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
