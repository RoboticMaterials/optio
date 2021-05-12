/** 
 * All of the API calls for Cards
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 9 20201
 * Edited by: Daniel Castillo
 * 
 **/

import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";
import {parseItem, RESOURCE_JSON_KEYS, stringifyItem} from "../../methods/utils/data_utils";
import {logError} from "../error_log";
import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";

const parser = (item) => parseItem(item, RESOURCE_JSON_KEYS[dataTypes.REPORT_EVENT])
const stringifier = (item) => stringifyItem(item, RESOURCE_JSON_KEYS[dataTypes.REPORT_EVENT])

export async function getReportEvents() {
    try {
        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listReportEvents,
            null,
            parser
        )

    } catch (error) {
        // Error 😨
        logError(error)
    }
}

export async function deleteReportEvent(ID) {
    // report events should not be deleted
}

export async function postReportEvent(reportEvent) {
    try {
        const {
            id,
            ...rest
        } = reportEvent || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createReportEvent,
            {input: stringifier(rest)},
            parser
        )


    } catch (error) {
        // Error 😨
        logError(error)
    }
}

export async function putReportEvent(reportEvent, ID) {
    // This never gets used
    // No need to actually add this call
}

export async function getReportAnalytics(stationId, timeSpan) {
    try {

        // need to create the settings before this can work
        // const settings = {} //await getSettings()

        // const timeZone = settings.timezone ? settings.timezone.label : await moment.tz.guess()

        // const dataJson = await API.graphql({
        //     query: reportStats,
        //     variables: { 
        //         stationId: stationId,
        //         timeSpan: timeSpan.timespan,
        //         timeZone: timeZone.label ? timeZone.label : timeZone,
        //         index: 0
        //      }
        // })

        // let data = {
        //     reports: JSON.parse(dataJson.data.reportStats.throughPut),
        //     date_title: dataJson.data.reportStats.date
        //   }

        // return data;

    } catch (error) {
        // Error 😨
        logError(error)
    }
}
