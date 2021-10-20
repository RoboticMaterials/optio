
// Authentication
import configData from '../settings/config'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import logger from '../logger'
const log = logger.getLogger('Api')

var poolData = {
    UserPoolId: configData.UserPoolId,
    ClientId: configData.ClientId,
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();

var token = null;
if (cognitoUser != null) {
    token = cognitoUser.getSession(function (err, session) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return null;
        }

        return session?.idToken?.jwtToken || null
    });
}


export const getHeaders = () => {

    let headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token
    }

    return headers;
}

export const handleError = (error) => {
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