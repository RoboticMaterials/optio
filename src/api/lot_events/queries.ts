import {gql} from "@apollo/client";

export const listLotEvents = gql`query listLotEvents {
    listLotEvents {
        id
        organizationId
        cardId
        userId
        username
        delta
    }
}`


export const getLotEventById = gql`query getLotEventById($id: String!) {
    getLotEventById(id: $id) {
        id
        organizationId
        cardId
        userId
        username
        delta
    }
}`