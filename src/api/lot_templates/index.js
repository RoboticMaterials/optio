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

const parser = (item) => parseItem(item, RESOURCE_JSON_KEYS[dataTypes.LOT_TEMPLATE])
const stringifier = (item) => stringifyItem(item, RESOURCE_JSON_KEYS[dataTypes.LOT_TEMPLATE])


const operator = 'cards/templates'
const log = logger.getLogger('Api')

export async function getLotTemplate(id) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.getLotTemplateById,
            {id},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function getLotTemplates() {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listLotTemplates,
            null,
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function deleteLotTemplate(id) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.deleteLotTemplate,
            {id},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function postLotTemplate(lotTemplate) {
    try {

        const {
            id,
            ...rest
        } = lotTemplate || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createLotTemplate,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function putLotTemplate(lotTemplate, ID) {
    try {
        const {
            __typename,
            ...rest
        } = lotTemplate || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.updateLotTemplate,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}
