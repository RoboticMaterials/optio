import axios from 'axios';
import { apiIPAddress } from '../../settings/settings'
import {parseStation, RESOURCE_JSON_KEYS, stringifyItem} from "../../methods/utils/data_utils";
import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";
import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";
import {logError} from "../error_log";

const operator = 'stations'

export const getStations =  async () => {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listStations,
            null,
            parseStation
        )

    } catch (error) {
        logError(error)
    }
}

export async function deleteStation(ID: string) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.deleteStation,
            {id: ID, organizationId: "Baca Inc"},
            parseStation
        )

    } catch (error) {
        logError(error)
    }
}

export async function postStation(station: any) {
    try {

        const {
            id,
            __typename,
            ...rest
        } = station || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createStation,
            {input: stringifyItem(rest, RESOURCE_JSON_KEYS[dataTypes.STATION])},
            parseStation
        )

    } catch (error) {
        logError(error)
    }
}

export async function putStation(station: any, ID: string) {
    try {
        const {
            __typename,
            ...rest
        } = station || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.updateStation,
            {input: stringifyItem(rest, RESOURCE_JSON_KEYS[dataTypes.STATION])},
            parseStation
        )

    } catch (error) {
        logError(error)
    }
}

export async function getStationAnalytics(id, timeSpan) {
    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + id + '/stats',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '123456',
                'Accept': 'text/html',
                'Access-Control-Allow-Origin': '*'
            },
            // A timespan is {time_span: 'day', index: 0}
            data: timeSpan
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        return dataJson;


    } catch (error) {
        logError(error)
    }
}