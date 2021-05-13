import {gql} from "@apollo/client";

export const listLot = gql`query listLot {
    listLot {
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