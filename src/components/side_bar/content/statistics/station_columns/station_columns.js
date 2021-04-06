import React, { useEffect, useState, useRef, useContext, memo } from 'react';
import { useDispatch, useSelector } from "react-redux";

// Import Styles
import * as styled from './station_columns.style'

// Import Component
import StationColumn from './station_column/station_column'

// Import Utils
import { getProcessStations } from '../../../../../methods/utils/processes_utils'


const StationColumns = (props) => {

    const {
        processId,
        setDateTitle,
        dateIndex,
        timeSpan,
    } = props || {}

    const processes = useSelector(state => state.processesReducer.processes)
    const routes = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.stationsReducer.stations)


    const renderStationColumn = () => {
        const processStations = getProcessStations(processes[processId], routes)
        console.log('QQQQ current process', processStations)
        return Object.keys(processStations).map((stationId) => {
            console.log('QQQQ station id', stationId)
            return (
                <StationColumn
                    key={stationId}
                    dateIndex={dateIndex}
                    timeSpan={timeSpan}
                    stationId={stationId}
                    setDateTitle={(title => setDateTitle(title))}
                />
            )
        })

    }

    return (
        <styled.RowContainer>
            {renderStationColumn()}
        </styled.RowContainer>
    )
}

export default StationColumns