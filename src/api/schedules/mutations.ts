import {gql} from "@apollo/client";


export const createSchedule = gql`mutation createSchedule($input: ScheduleInput!) {
    createSchedule(input: $input) {
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

export const updateSchedule = gql`mutation updateSchedule($input: ScheduleUpdateInput!) {
    updateSchedule(input: $input) {
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

export const deleteSchedule = gql`mutation deleteSchedule($id: ID!, $organizationId: ID!) {
    deleteSchedule(id: $id, organizationId: $organizationId) {
        id
        organizationId
    }
}
`