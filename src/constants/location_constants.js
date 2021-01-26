import uuid from 'uuid'

export const LocationDefaultAttributes = {
    name: null,
    schema: null,
    type: null,
    pos_x: 0,
    pos_y: 0,
    rotation: 0,
    x: 0,
    y: 0,
    _id: uuid.v4(),
    map_id: null,
    temp: true
}