import axios from 'axios';
// import * as log from 'loglevel';
import logger from '../../logger'

import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";
import {parseItem, RESOURCE_JSON_KEYS, stringifyItem} from "../../methods/utils/data_utils";
import {logError} from "../error_log";
import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";

const parser = (item) => parseItem(item, RESOURCE_JSON_KEYS[dataTypes.SETTINGS])
const stringifier = (item) => stringifyItem(item, RESOURCE_JSON_KEYS[dataTypes.SETTINGS])

const operator = 'settings'

const log = logger.getLogger('Api')

export async function getSettings() {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listSettings,
            null,
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function postSettings(settings) {
    try {

        const {
            id,
            ...rest
        } = settings || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createSetting,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function putSettings(settings) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.updateSetting,
            {input: stringifier(settings)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}
