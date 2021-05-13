import {gql} from "@apollo/client";

export const listSettings = gql`query listSettings {
    listSettings {
        id
        organizationId
        loggers
        shiftDetails
        currentMapId
        deviceEnabled
        timezone
    }
}`


export const getSettingById = gql`query getSettingById($id: String!) {
    getSettingById(id: $id) {
        id
        organizationId
        loggers
        shiftDetails
        currentMapId
        deviceEnabled
        timezone
    }
}`