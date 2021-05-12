import {gql} from "@apollo/client";


export const createRoute = gql`mutation createRoute($input: RouteInput!) {
    createRoute(input: $input) {
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

export const updateRoute = gql`mutation updateRoute($input: RouteUpdateInput!) {
    updateRoute(input: $input) {
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

export const deleteRoute = gql`mutation deleteRoute($id: ID!, $organizationId: ID!) {
    deleteRoute(id: $id, organizationId: $organizationId) {
        name
    }
}
`