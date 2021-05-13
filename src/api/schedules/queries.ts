import {gql} from "@apollo/client";

export const listSchedules = gql`query listSchedules {
    listSchedules {
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