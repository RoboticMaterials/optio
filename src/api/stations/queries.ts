import {gql} from "@apollo/client";

export const listStations = gql`query MyQuery {
    listStations {
        dashboards
        id
        children
        mapId
        organizationId
        pos_x
        pos_y
        rotation
        schema
        type
        x
        y
    }
}`