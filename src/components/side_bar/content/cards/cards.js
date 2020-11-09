import React from 'react';
import { useHistory } from 'react-router-dom'
import {useSelector} from "react-redux";

import * as styled from './cards.style'

const TEMP_STATIONS = {


}



const Cards = (props) => {

    const {
        id
    } = props

    const currentProcess = useSelector(state => { return state.processesReducer.processes[id] })
    const TEMP_STATIONS = useSelector(state => { return state.locationsReducer.stations })
    const TEMP_STATIONS_ARR = Object.values(TEMP_STATIONS).slice(0,3)
    console.log("currentProcess",currentProcess)
    console.log("TEMP_STATIONS",TEMP_STATIONS)
    console.log("TEMP_STATIONS_ARR",TEMP_STATIONS_ARR)
    console.log("id",id)


    return (
        <styled.Container>

        </styled.Container>
    )
}

export default Cards