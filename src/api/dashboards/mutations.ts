import {gql} from "@apollo/client";

export const createDashboard = gql`mutation createDashboard($input: DashboardInput!) {
    createDashboard(input: $input) {
        id
        organizationId
        data
    }
}`

export const updateDashboard = gql`mutation updateDashboard($input: DashboardUpdateInput!) {
    updateDashboard(input: $input) {
        id
        data
    }
}`

export const deleteDashboard = gql`mutation deleteDashboard($id: ID!, $organizationId: ID!) {
    deleteDashboard(id: $id, organizationId: $organizationId) {
        id
        organizationId
    }
}
`