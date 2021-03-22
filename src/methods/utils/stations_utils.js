import store from '../../redux/store/index'
import {BIN_IDS} from "../../constants/lot_contants";

export const getChildPositions = (stationID) => {
    const positionsState = store.getState().positionsReducer
    const positions = positionsState.positions_actions

    let childrenArray = []

    positions.forEach(position => {
        !!position.parent && position.parent === stationID && childrenArray.push(position._id)
    })

}

export const getStationName = (stationId) => {

    if(stationId === BIN_IDS.QUEUE) {
        return "Queue"
    }
    else if(stationId === BIN_IDS.FINISH) {
        return "Finish"
    }

    const stations = store.getState().stationsReducer.stations || {}
    const station = stations[stationId] || {}
    const {
        name = ""
    } = station

    return name
}