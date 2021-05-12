import {gql} from "@apollo/client";

export const listStations = gql`query listStations {
    listStations {
        dashboards
        name
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