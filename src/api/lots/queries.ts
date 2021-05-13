import {gql} from "@apollo/client";

export const listLot = gql`query listLot {
    listLots {
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