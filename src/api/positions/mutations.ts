import {gql} from "@apollo/client";
import {idType} from "aws-sdk/clients/iam";


export const createPosition = gql`mutation createPosition($input: PositionInput!) {
    createPosition(input: $input) {
        id
        change_key
        name
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

export const updatePosition = gql`mutation updatePosition($input: PositionUpdateInput!) {
    updatePosition(input: $input) {
        id
        change_key
        name
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
}
`
export const deletePosition = gql`mutation deletePosition($id: ID!, $organizationId: ID!) {
    deletePosition(id: $id, organizationId: $organizationId) {
        id
        organizationId
    }
}
`

