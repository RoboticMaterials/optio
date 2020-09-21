import axios from 'axios';
import * as log from 'loglevel';

import {apiIPAddress} from '../settings/settings'
const operator = 'skills'

export async function getSkills() {
  try {
    const response = await axios({
      method: 'get',
      url: apiIPAddress() + operator,
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

export async function postSkill(skill) {
  try {
    const response = await axios({
      method: 'POST',
      url: apiIPAddress() + operator,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/html'
      },
      data: JSON.stringify(skill)
  });

  // Success 🎉
  const data = response.data;
  const dataJson = JSON.parse(data)
  console.log('Post Skill Success', dataJson)
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

export async function putSkill(skill, ID) {
  try {
    const response = await axios({
      method: 'PUT',
      url: apiIPAddress() + operator+ '/' + ID,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/html'
      },
      data: JSON.stringify(skill)
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

export async function deleteSkill(skillId) {
  log.debug('deleteSkills start:',skillId)

  try {
    const response = await axios({
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/html',
      },
      url: apiIPAddress() + operator + '/' + skillId
    });

    // Success 🎉
    const data = response.data;

    return response;

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
    log.debug('error', error);
  }


}
