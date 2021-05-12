import {gql} from "@apollo/client";

export const listProcesses = gql`query listProcesses {
    listProcesss {
        id
        organizationId
        name
        broken
        routes
        mapId
        showSummary
        showStatistics
    }
}`