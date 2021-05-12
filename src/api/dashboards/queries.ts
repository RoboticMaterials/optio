import {gql} from "@apollo/client";

export const listDashboards = gql`query listDashboards {
    listDashboards {
        id
        organizationId
        data
    }
}`