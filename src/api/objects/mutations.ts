import {gql} from "@apollo/client";


export const createObject = gql`mutation createObject($input: ObjectInput!) {
    createObject(input: $input) {
        description
        dimensions 
        mapId
        modelName
        name
        quantity
    }
}`

export const updateObject = gql`mutation updateObject($input: ObjectUpdateInput!) {
    updateObject(input: $input) {
        id
        description
        dimensions 
        mapId
        modelName
        name
        quantity
    }
}`

export const deleteObject = gql`mutation deleteObject($id: ID!) {
    deleteObject(id: $id, organizationId: $organizationId) {
        id
    }
}
`