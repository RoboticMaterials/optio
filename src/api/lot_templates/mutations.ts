import {gql} from "@apollo/client";

export const createLotTemplate = gql`mutation createLotTemplate($input: LotTemplateInput!) {
    createLotTemplate(input: $input) {
        id
        organizationId
        name
        displayNames
        fields
    }
}`

export const updateLotTemplate = gql`mutation updateLotTemplate($input: LotTemplateUpdateInput!) {
    updateLotTemplate(input: $input) {
        id
        name
        displayNames
        fields
    }
}`

export const deleteLotTemplate = gql`mutation deleteLotTemplate($id: ID!, $organizationId: ID) {
    deleteLotTemplate(id: $id, organizationId: $organizationId) {
        id
        organizationId
    }
}
`