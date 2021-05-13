import {gql} from "@apollo/client";

export const listLotTemplates = gql`query listLotTemplates {
    listLotTemplates {
        id
        organizationId
        name
        displayNames
        fields
    }
}`


export const getLotTemplateById = gql`query getLotTemplateById($id: String!) {
    getLotTemplateById(id: $id) {
        id
        organizationId
        name
        displayNames
        fields
    }
}`