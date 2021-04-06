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
    const [format, setFormat] = useState('%m-%d %H:%M')
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
                setFormat('%I:%M:%S %p')
                setTimeSpan('live')
                break
            case 'day':
                setFormat('%I:%M %p')
                setTimeSpan('day')
                break
            case 'week':
                setFormat('%m-%d %I:%M %p')
                setTimeSpan('week')
                break
            case 'month':
                setFormat('%m-%d')
                setTimeSpan('month')
                break
            case 'year':
                setFormat('%Y-%m-%d')
                setTimeSpan('year')
                break
            case 'all':
                setFormat('%Y-%m-%d')
                setTimeSpan('all')
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
            </styled.HeaderBar>
            {renderStationColumns()}
        </styled.Container>
    )


}

export default Statistics