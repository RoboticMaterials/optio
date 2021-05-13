import {gql} from "@apollo/client";

export const listObjects = gql`query listObjects {
    listObjects {
    description
    dimensions
    id
    modelName
    organizationId
    name
    mapId
    quantity
  }
}`