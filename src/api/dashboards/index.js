import axios from 'axios';
// import * as log from 'loglevel';

import logger from '../../logger'

import { apiIPAddress } from '../../settings/settings'

import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";
import {
    parseDashboard,
    parseItem,
    RESOURCE_JSON_KEYS,
    stringifyDashboard,
    stringifyItem
} from "../../methods/utils/data_utils";
import {logError} from "../error_log";
import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";

const parser = parseDashboard
const stringifier = stringifyDashboard

const operator = 'dashboards'

const log = logger.getLogger('Api')

export async function getDashboards() {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listDashboards,
            null,
            parser
        )

    } catch (error) {
        logError(error)
    }

}

export async function deleteDashboards(id) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.deleteDashboard,
            {id},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function postDashboards(dashboard) {
    try {

        const {
            id,
            ...rest
        } = dashboard || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createDashboard,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function putDashboards(dashboard, id) {
    try {
        const {
            __typename,
            ...rest
        } = dashboard || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.updateDashboard,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}
