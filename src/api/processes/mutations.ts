import {gql} from "@apollo/client";

// const typeDefs = gql`
//     # Your schema will go here
// `;

export const createProcess = gql`mutation createProcess($input: ProcessInput!) {
    createProcess(input: $input) {
        id
        organizationId
        name
        broken
        routes
        mapId
    }
}`

export const updateProcess = gql`mutation updateProcess($input: ProcessUpdateInput!) {
    updateProcess(input: $input) {
        id
        organizationId
        name
        broken
        routes
        mapId
    }
}`

export const deleteProcess = gql`mutation deleteProcess($id: ID!, $organizationId: ID!) {
    deleteProcess(id: $id, organizationId: $organizationId) {
        name
    }
}
`