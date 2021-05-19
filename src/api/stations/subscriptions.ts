import {gql} from "@apollo/client";

export const onDelta = gql `subscription onDeltaStation {
    onDeltaStation {
        y
        x
        type
            schema
        rotation
        pos_y
        pos_x
        organizationId
        name
        mapId
        id
        dashboards
        children
    }
}
`

export const onDelete = gql `subscription onDeleteStation {
    onDeleteStation {
        y
        x
        type
        schema
        rotation
        pos_y
        pos_x
        organizationId
        name
        mapId
        id
        dashboards
        children
    }
}
`