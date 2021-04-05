import React, { useEffect, useState, useRef, useContext, memo } from 'react';
import { useDispatch, useSelector } from "react-redux";

// Import Styles
import * as styled from './station_column.style'

const StationColumn = (props) => {

    const {
        stationId = ''
    } = props

    const stations = useSelector(state => state.stationsReducer.stations)

    const currentStation = stations[stationId] || {}

    

    return (
        <styled.StationColumnContainer>
            <p>{currentStation.name}</p>
        </styled.StationColumnContainer>
    )
}

export default StationColumn