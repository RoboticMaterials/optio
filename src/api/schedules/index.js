import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";
import {parseItem, RESOURCE_JSON_KEYS, stringifyItem} from "../../methods/utils/data_utils";
import {logError} from "../error_log";
import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";

const parser = (item) => parseItem(item, RESOURCE_JSON_KEYS[dataTypes.TASK])
const stringifier = (item) => stringifyItem(item, RESOURCE_JSON_KEYS[dataTypes.TASK])

export async function getSchedules() {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.QUERY,
            queries.listSchedules,
            null,
            parser
        )

    } catch (error) {
        logError(error)
    }
};

export async function postSchedule(task) {
    try {

        const {
            id,
            ...rest
        } = task || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.createSchedule,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
};

export async function deleteSchedule(id) {
    try {

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.deleteSchedule,
            {id, organizationId: "Baca Inc"},
            parser
        )

    } catch (error) {
        logError(error)
    }
};

export async function putSchedule(task, id) {
    try {
        const {
            __typename,
            ...rest
        } = task || {}

        return await streamlinedGraphqlCall(
            TRANSFORMS.MUTATION,
            mutations.updateSchedule,
            {input: stringifier(rest)},
            parser
        )

    } catch (error) {
        logError(error)
    }
}
