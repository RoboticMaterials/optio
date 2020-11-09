import React from 'react';
import { useHistory } from 'react-router-dom'
import {useSelector} from "react-redux";

import * as styled from './cards.style'

const TEMP_STATIONS = {


}

const StationsColumn = (props) => {
    const {
        id
    } = props

    const station = useSelector(state => { return state.locationsReducer.stations[id] })
    console.log("station",station)

    const {
        name
    } = station

    return(
        <styled.RouteContainer>
            <styled.RouteName>{name}</styled.RouteName>

        </styled.RouteContainer>
    )
}

const StationsList = (props) => {
    const {
        routes
    } = props

    let stations = []
    routes.forEach((route) => {
        const {
            load: {station: loadStationId},
            unload: {station: unloadStationId},
        } = route

        stations.push(loadStationId)
        stations.push(unloadStationId)

    })

    const renderStations = () => {
        return(
            <styled.RoutesListContainer>
                {
                    stations.map((stationId) => {

                        return (
                            <StationsColumn
                                id={stationId}
                            />
                        )
                    })
                }
            </styled.RoutesListContainer>

        )
    }

    return(
        renderStations()
    )
}

const Cards = (props) => {

    const {
        id
    } = props

    const currentProcess = useSelector(state => { return state.processesReducer.processes[id] })
    const routes = useSelector(state => { return Object.values(state.tasksReducer.tasks).filter((route) => currentProcess.routes.includes(route._id)) })

    console.log("currentProcess",currentProcess)
    console.log("routes",routes)
    console.log("id",id)


    return (
        <styled.Container>
            <StationsList routes={routes}/>
        </styled.Container>
    )
}

export default Cards