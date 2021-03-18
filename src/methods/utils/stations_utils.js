import store from '../../redux/store/index'

export const getChildPositions = (stationID) => {
    const positionsState = store.getState().positionsReducer
    const positions = positionsState.positions_actions

    childrenArray = []

    positions.forEach(position => {
        !!position.parent && position.parent === stationID && childrenArray.push(position._id)
    })

}

export const getStationName = (stationId) => {
    const stations = store.getState().stationsReducer.stations || {}
    const station = stations[stationId] || {}
    const {
        name = ""
    } = station

    return name
}