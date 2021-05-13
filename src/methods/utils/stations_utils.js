import store from '../../redux/store/index'
import { BIN_IDS } from "../../constants/lot_contants";
import { isNonEmptyArray } from "./array_utils";
import { callOnStations } from "./processes_utils";
import { getLoadStationId, getUnloadStationId } from './route_utils'

export const getChildPositions = (stationID) => {
    const positionsState = store.getState().positionsReducer
    const positions = positionsState.positions_actions

    let childrenArray = []

    positions.forEach(position => {
        !!position.parent && position.parent === stationID && childrenArray.push(position.id)
    })

}

export const getStationName = (stationId) => {

    if (stationId === BIN_IDS.QUEUE) {
        return "Queue"
    }
    else if (stationId === BIN_IDS.FINISH) {
        return "Finish"
    }

    const stations = store.getState().stationsReducer.stations || {}
    const station = stations[stationId] || {}
    const {
        name = ""
    } = station

    return name
}

export const getPositionAttributes = (positionId, attributes) => {
    const storeState = store.getState()
    const positions = storeState.positionsReducer.positions || {}

    let positionAttributes = {}

    const isAttributesNotEmpty = isNonEmptyArray(attributes)

    const position = positions[positionId] || {}

    if (isAttributesNotEmpty) {
        attributes.forEach((currAttribute) => {
            positionAttributes[currAttribute] = position[currAttribute]
        })
    }
    else {
        positionAttributes = { ...position }
    }

    return positionAttributes
}

// Returns a list of processes this station belongs to
export const getStationProcesses = (stationID) => {

    const storeState = store.getState()
    const processes = storeState.processesReducer.processes
    const routes = storeState.tasksReducer.tasks
    const stationProcesses = []
    Object.values(processes).forEach((currProcess) => {
        if (currProcess && currProcess.routes && Array.isArray(currProcess.routes)) {
            for (let i = 0; i < currProcess.routes.length; i++) {
                const routeID = currProcess.routes[i]
                const route = routes[routeID]
                const unloadStationId = getUnloadStationId(route)
                const loadStationId = getLoadStationId(route)

                if (unloadStationId === stationID && !stationProcesses.includes(stationID)) {
                    stationProcesses.push(currProcess.id)
                    break
                }
                else if (loadStationId === stationID && !stationProcesses.includes(stationID)) {
                    stationProcesses.push(currProcess.id)
                    break
                }
            }
        }
    }
    )
    return stationProcesses
}