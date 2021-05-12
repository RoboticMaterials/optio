import {gql} from "@apollo/client";

export const createLot = gql`mutation createLot($input: LotInput!) {
    createLot(input: $input) {
        id
        organizationId
        bins
        flags
        templateValues
        lotNumber
        lotTemplateId
        name
        processId
        count
    }
}`

export const updateLot = gql`mutation updateLot($input: LotUpdateInput!) {
    updateLot(input: $input) {
        id
        organizationId
        bins
        flags
        templateValues
        lotNumber
        lotTemplateId
        name
        processId
        count
    }
}`

export const deleteLot = gql`mutation deleteLot($id: ID!, $organizationId: ID!) {
    deleteLot(id: $id, organizationId: $organizationId) {
        id
        organizationId
        bins
        flags
        templateValues
        lotNumber
        lotTemplateId
        name
        processId
        count
    }
}
`