import {gql} from "@apollo/client";
import {idType} from "aws-sdk/clients/iam";


export const createStation = gql`mutation createStation($input: StationInput!) {
    createStation(input: $input) {
        dashboards
        id
        name
        children
        mapId
        organizationId
        pos_x
        pos_y
        rotation
        schema
        type
        x
        y
    }
}`

export const updateStation = gql`mutation updateStation($input: StationUpdateInput!) {
    updateStation(input: $input) {
        children
        y
        x
        type
        schema
        rotation
        pos_y
        pos_x
        organizationId
        name
        mapId
        id
        dashboards
    }
}
`
export const deleteStation = gql`mutation deleteStation($id: ID!, $organizationId: ID!) {
    deleteStation(id: $id, organizationId: $organizationId) {
        id
        organizationId
    }
}
`

