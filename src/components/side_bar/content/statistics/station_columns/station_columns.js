import React, { useMemo, useState } from 'react';
import { useSelector } from "react-redux";

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
        showReport,
        dataLoading,
        sortLevel,
    } = props || {}

    const processes = useSelector(state => state.processesReducer.processes)
    const routes = useSelector(state => state.tasksReducer.tasks)
    // const stations = useSelector(state => state.stationsReducer.stations)

    const [collapsed, setCollapsed] = useState(false)

    const renderStationColumn = useMemo(() => {
        const processStations = getProcessStations(processes[processId], routes)
        return Object.keys(processStations).map((stationId) => {
            return (
                <StationColumn
                    key={stationId}
                    dateIndex={dateIndex}
                    timeSpan={timeSpan}
                    stationId={stationId}
                    showReport={showReport}
                    setDateTitle={(title => setDateTitle(title))}
                    dataLoading={loading => dataLoading(loading)}
                    sortLevel={sortLevel}
                />
            )
        })

    }, [dateIndex, timeSpan, showReport, sortLevel])

    return (
        collapsed ?
            <styled.RowContainer>
                <styled.NameContainer>
                    <styled.ProcessName>{processes[processId]?.name}</styled.ProcessName>
                    <styled.CollapseIcon
                        className="fa fa-chevron-right"
                        aria-hidden="true"
                        onClick={() => setCollapsed(false)}
                    />
                </styled.NameContainer>

            </styled.RowContainer>
            :
            <styled.RowContainer>
                <styled.NameContainer>
                    <styled.ProcessName>{processes[processId]?.name}</styled.ProcessName>
                    <styled.CollapseIcon
                        className="fa fa-chevron-down"
                        aria-hidden="true"
                        onClick={() => setCollapsed(true)}
                    />
                </styled.NameContainer>

                <styled.ChartsContainer>

                    {renderStationColumn}
                </styled.ChartsContainer>
            </styled.RowContainer>
    )
}

export default StationColumns