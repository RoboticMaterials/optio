import {
    GET_INTEGRATIONS,
    DISABLE_INTEGRATION,
    GET_INTEGRATION_CARDS,
    AUTH_INTEGRATION,
    SHOPIFY_INTEGRATION_TOKEN,

    STARTED,
    SUCCESS,
    FAILURE
  } from '../types/integrations_types';


import { deepCopy } from '../../methods/utils/utils';

import * as api from '../../api/integrations_api'

// get
// ******************************
export const getIntegrations = () => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: GET_INTEGRATIONS + STARTED });
        }
        function onSuccess(integrations) {
            dispatch({ type: GET_INTEGRATIONS + SUCCESS, payload: integrations });
            return integrations;
        }
        function onError(error) {
            dispatch({ type: GET_INTEGRATIONS + FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const integrations = await api.getIntegrations();

            return onSuccess(integrations);
        } catch (error) {
            return onError(error);
        }
    };
};

export const disableIntegration = (integrationId) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: DISABLE_INTEGRATION + STARTED });
        }
        function onSuccess(integrations) {
            dispatch({ type: DISABLE_INTEGRATION + SUCCESS, payload: integrations });
            return integrations;
        }
        function onError(error) {
            dispatch({ type: DISABLE_INTEGRATION + FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const integrations = await api.disableIntegration(integrationId);

            return onSuccess(integrations);
        } catch (error) {
            return onError(error);
        }
    };
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getIntegrationCards = (endpoint) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: GET_INTEGRATION_CARDS + STARTED });
        }
        function onSuccess(endpoint, cards) {
            dispatch({ type: GET_INTEGRATION_CARDS + SUCCESS, payload: {endpoint, cards} });
            return cards;
        }
        function onError(error) {
            dispatch({ type: GET_INTEGRATION_CARDS + FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const cards = await api.getIntegrationCards(endpoint);
            console.log(cards)

            return onSuccess(endpoint, cards);
        } catch (error) {
            return onError(error);
        }
    };
};

export const authIntegration = (endpointId, credentials) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: AUTH_INTEGRATION + STARTED });
        }
        function onSuccess(redirect_link, integrations) {
            dispatch({ type: AUTH_INTEGRATION + SUCCESS, payload: integrations });
            return redirect_link;
        }
        function onError(error) {
            dispatch({ type: AUTH_INTEGRATION + FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const response = await api.authIntegration(endpointId, credentials);

            return onSuccess(response.redirectLink, response.integrations);
        } catch (error) {
            return onError(error);
        }
    };
};

export const shopifyIntegrationToken = (request_params) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: SHOPIFY_INTEGRATION_TOKEN + STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: SHOPIFY_INTEGRATION_TOKEN + SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: SHOPIFY_INTEGRATION_TOKEN + FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const response = await api.shopifyIntegrationToken(request_params);

            return onSuccess(response);
        } catch (error) {
            return onError(error);
        }
    };
};