import {gql} from "@apollo/client";

export const createSetting = gql`mutation createSetting($input: SettingsInput!) {
    createSetting(input: $input) {
        id
        organizationId
        loggers
        shiftDetails
        currentMapId
        deviceEnabled
        timezone
    }
}`

export const updateSetting = gql`mutation updateSetting($input: SettingsUpdateInput!) {
    updateSetting(input: $input) {
        id
        loggers
        shiftDetails
        currentMapId
        timezone
        deviceEnabled
    }
}`

export const deleteSetting = gql`mutation deleteSetting($id: ID!, $organizationId: ID) {
    deleteSetting(id: $id, organizationId: $organizationId) {
        id
        organizationId
    }
}
`