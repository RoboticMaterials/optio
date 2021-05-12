import {gql} from "@apollo/client";

export const listLot = gql`query listLot {
    listLot {
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