import axios from 'axios';
import { apiIPAddress } from '../../settings/settings'
import {parsePosition, RESOURCE_JSON_KEYS, stringifyItem} from "../../methods/utils/data_utils";
import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";
import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";
import {logError} from "../error_log";

const operator = 'positions'

export const getPositions =  async () => {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listPositions,
            null,
            parsePosition
        )

    } catch (error) {
        logError(error)
    }
}

export async function deletePosition(ID: string) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.deletePosition,
            {id: ID},
            parsePosition
        )

    } catch (error) {
        logError(error)
    }
}

export async function postPosition(station: any) {
    try {

        const {
            id,
            __typename,
            ...rest
        } = station || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createPosition,
            {input: stringifyItem(rest, RESOURCE_JSON_KEYS[dataTypes.STATION])},
            parsePosition
        )

    } catch (error) {
        logError(error)
    }
}

export async function putPosition(station: any, ID: string) {
    try {
        const {
            __typename,
            ...rest
        } = station || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.updatePosition,
            {input: stringifyItem(rest, RESOURCE_JSON_KEYS[dataTypes.STATION])},
            parsePosition
        )

    } catch (error) {
        logError(error)
    }
}