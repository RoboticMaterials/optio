import {gql} from "@apollo/client";

export const createStation = gql`mutation CreateStation {
    createStation {
        id
        organizationId
        name
        schema
        type
        pos_x
        pos_y
        rotation
        x
        y
        mapId
        children
        dashboards
    }
}
`;