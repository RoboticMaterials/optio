import axios from 'axios';
// import * as log from 'loglevel';

import logger from '../../logger'

import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";
import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";

import {parseItem, RESOURCE_JSON_KEYS, stringifyItem} from "../../methods/utils/data_utils";
import {logError} from "../error_log";

const parser = (item) => parseItem(item, RESOURCE_JSON_KEYS[dataTypes.PROCESS])
const stringifier = (item) => stringifyItem(item, RESOURCE_JSON_KEYS[dataTypes.PROCESS])

export async function getProcesses() {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listProcesses,
            null,
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function deleteProcess(id) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.deleteProcess,
            {id, organizationId: "Baca Inc"},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function postProcesses(process) {
    try {

        const {
            id,
            showSummary,
            showStatistics,
            ...rest
        } = process || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createProcess,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}

export async function putProcesses(process, ID) {
    try {
        const {
            __typename,
            ...rest
        } = process || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.updateProcess,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}
