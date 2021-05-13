import {gql} from "@apollo/client";

export const createLotEvent = gql`mutation createLotEvent($input: LotEventInput!) {
    createLotEvent(input: $input) {
        id
        organizationId
        cardId
        userId
        username
        delta
    }
}`

export const updateLotEvent = gql`mutation updateLotEvent($input: LotEventUpdateInput!) {
    updateLotEvent(input: $input) {
        id
        cardId
        userId
        username
        delta
    }
}`

export const deleteLotEvent = gql`mutation deleteLotEvent($id: ID!, $organizationId: ID) {
    deleteLotEvent(id: $id, organizationId: $organizationId) {
        id
        organizationId
    }
}
`