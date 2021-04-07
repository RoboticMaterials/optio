import uuid from 'uuid'

const RouteTask = {
    name: '',
    obj: null,
    type: 'push',
    quantity: 1,
    // device_type: !!MiRMapEnabled ? 'MiR_100' : 'human',
    handoff: true,
    track_quantity: true,
    // map_id: currentMap._id,
    new: true,
    process: false,
    load: {
        position: null,
        station: null,
        sound: null,
        instructions: 'Load',
        timeout: '01:00'
    },
    unload: {
        position: null,
        station: null,
        sound: null,
        instructions: 'Unload'
    },
    id: uuid.v4(),
}

export default RouteTask