import React, { useEffect, useState, useRef, useContext, memo } from 'react';
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

// Import Styles
import * as styled from './statistics.style'

// Import Components 
import StationColumns from './station_columns/station_columns'

// Import Basic Components
import DaySelector from '../../../basic/day_selector/day_selector'
import TimeSpaneSelector from '../../../basic/timespan_selector/time_span_selector'

const Statistics = () => {


    let params = useParams()
    const {
        page,
        subpage,
        id
    } = params

    const processes = useSelector(state => state.processesReducer.processes)

    const [dateIndex, setDateIndex] = useState(0)
    const [isThroughputLoading, setIsThroughputLoading] = useState(false)
    const [timeSpan, setTimeSpan] = useState('day')
    const [date, setDate] = useState('')

    // useEffect(() => {
    //     const newDate = deepCopy(date)

    //     newDate.setDate(date.getDate() + dateIndex)
    // }, [dateIndex])

    /**
     * Gets the new data based on the selected time span and dateIndex
     * 
     * TimeSpan:
     * Can be either Day, Week, Month or Year
     * 
     * DateIndex:
     * The current date (today) index is 0, if you want to go back to the past date, the index would be 1 
     * 
     * @param {*} newTimeSpan 
     * @param {*} newDateIndex 
     */
    const onTimeSpan = async (newTimeSpan, newDateIndex) => {

        setTimeSpan(newTimeSpan)
        setDateIndex(newDateIndex)

        // Usses a regex to take all characters before a '['
        // switch (timeSpan(/^(.*?)(?=\[|$)/)) {
        switch (newTimeSpan) {
            case 'live':
                setTimeSpan('live')
                break
            case 'day':
                setTimeSpan('day')
                break
            case 'week':
                setTimeSpan('week')
                break
            case 'month':
                setTimeSpan('month')
                break
            case 'year':
                setTimeSpan('year')
                break
            case 'all':
                setTimeSpan('all')
                break
            case 'line':
                setTimeSpan('line')
                break
        }
    }

    const renderStationColumns = () => {

        let processesToRender = []

        // If just in process page, push the current process
        if (page === 'processes') {
            processesToRender.push(id)
        }
        // Else push all processes
        else {

        }

        return processesToRender.map((processId) => {
            return (
                <StationColumns
                    processId={processId}
                    setDateTitle={(title) => setDate(title)}
                    dateIndex={dateIndex}
                    timeSpan={timeSpan}
                />
            )
        })
    }

    return (
        <styled.Container>
            <styled.HeaderBar>
                <styled.HeaderSection style={{ marginLeft: '2rem' }}>
                    <TimeSpaneSelector
                        // timespanDisabled={timespanDisabled}
                        setTimeSpan={(timeSpan) => onTimeSpan(timeSpan, 0)}
                        timeSpan={timeSpan}
                    />
                    <DaySelector
                        date={date}
                        dateIndex={dateIndex}
                        loading={isThroughputLoading}
                        onChange={(newIndex) => {
                            onTimeSpan(timeSpan, newIndex)
                        }}
                    />
                </styled.HeaderSection>
                <styled.HeaderSection style={{ marginLeft: '2rem' }}>
                        <button onClick={() => onTimeSpan('day', dateIndex)}>Bar</button>
                        <button onClick={() => onTimeSpan('line', dateIndex)}>Line</button>
                </styled.HeaderSection>
            </styled.HeaderBar>
            {renderStationColumns()}
        </styled.Container>
    )


}

export default Statistics