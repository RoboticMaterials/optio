import axios from 'axios';
import { apiIPAddress } from '../../settings/settings'
import * as log from 'loglevel';

import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";
import {parseItem, RESOURCE_JSON_KEYS, stringifyItem} from "../../methods/utils/data_utils";
import {logError} from "../error_log";
import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";

const parser = (item) => parseItem(item, RESOURCE_JSON_KEYS[dataTypes.TASK])
const stringifier = (item) => stringifyItem(item, RESOURCE_JSON_KEYS[dataTypes.TASK])

export async function getRoutes() {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listRoutes,
            null,
            parser
        )

    } catch (error) {
        logError(error)
    }
};

export async function postRoute(task) {
    try {

        const {
            id,
            ...rest
        } = task || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createRoute,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
};

export async function deleteRoute(id) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.deleteRoute,
            {id, organizationId: "Baca Inc"},
            parser
        )

    } catch (error) {
        logError(error)
    }
};

export async function putRoute(task, id) {
    try {
        const {
            __typename,
            ...rest
        } = task || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.updateRoute,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}
