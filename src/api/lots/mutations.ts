import {gql} from "@apollo/client";

export const createLot = gql`mutation createLot($input: LotInput!) {
    createLot(input: $input) {
        id
        bins
        fields
        flags
        lotNumber
        lotTemplateId
        name
        processId
        syncWithTemplate
    }
}`

export const updateLot = gql`mutation updateLot($input: LotUpdateInput!) {
    updateLot(input: $input) {
        id
        bins
        fields
        flags
        lotNumber
        lotTemplateId
        name
        processId
        syncWithTemplate
    }
}`

export const deleteLot = gql`mutation deleteLot($id: ID!, $organizationId: ID!) {
    deleteLot(id: $id, organizationId: $organizationId) {
        id
        organizationId
    }
}
`