import {gql} from "@apollo/client";

export const listRoutes = gql`query listRoutes {
    listRoutes {
        id
        organizationId
        device_types
        handoff
        load
        mapId
        name
        processes
        quantity
        track_quantity
        type
        unload
        obj
        route_object
    }
}`