import axios from 'axios';
// import * as log from 'loglevel';

import logger from '../../logger'

import { apiIPAddress } from '../../settings/settings'

import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";
import {parseItem, RESOURCE_JSON_KEYS, stringifyItem} from "../../methods/utils/data_utils";
import {logError} from "../error_log";
import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";

const parser = (item) => parseItem(item, RESOURCE_JSON_KEYS[dataTypes.CARD])
const stringifier = (item) => stringifyItem(item, RESOURCE_JSON_KEYS[dataTypes.CARD])


const operator = 'cards'
const log = logger.getLogger('Api')

export async function getCard(cardId) {

}

export async function getCardsCount() {
    try {
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + operator + "/count",
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
        log.debug('error', error);
    }

}

export async function getCards() {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listLot,
            null,
            parser
        )

    } catch (error) {
        logError(error)
    }
}


export async function getProcessCards(processId) {
    try {
        const response = await axios({
            method: 'get',
            url: apiIPAddress() + "processes/" + processId + "/cards",
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
        log.debug('error', error);
    }

}

export async function deleteCard(id) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.deleteLot,
            {id, organizationId: "Baca Inc"},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function postCard(card) {
    try {

        const {
            id,
            ...rest
        } = card || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createLot,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function putCard(card, id) {
    try {
        const {
            __typename,
            ...rest
        } = card || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.updateLot,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}
