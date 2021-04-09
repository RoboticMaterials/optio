import React, { useEffect, useState, useRef, useContext, memo } from 'react';
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

// Import Styles
import * as styled from './statistics.style'

// Import Components 
import StationColumns from './station_columns/station_columns'
import Header from '../cards/summary_header/summary_header'

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
    const [timeSpan, setTimeSpan] = useState('day')
    const [showReport, setShowReport] = useState(false)
    const [date, setDate] = useState('')
    const [loading, setLoading] = useState(false)

    console.log('QQQQ date', date)

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
        setTimeSpan(newTimeSpan)

    }

    const renderStationColumns = () => {

        let processesToRender = []

        // If just in process page, push the current process
        if (page === 'processes') {
            processesToRender.push(id)
        }
        // Else push all processes
        else {
            Object.keys(processes).forEach(processId => {
                processesToRender.push(processId)
            });

        }

        return processesToRender.map((processId) => {
            return (
                <StationColumns
                    key={processId}
                    processId={processId}
                    setDateTitle={(title) => setDate(title)}
                    dataLoading={loading => setLoading(loading)}
                    dateIndex={dateIndex}
                    timeSpan={timeSpan}
                    showReport={showReport}
                />
            )
        })
    }

    return (
        <styled.Container>
            <Header
                title={'Statistics Summary'}
            />
            <styled.HeaderBar>
                <styled.HeaderSection style={{ marginLeft: '2rem' }}>
                    <styled.ColumnContainer>

                        <TimeSpaneSelector
                            // timespanDisabled={timespanDisabled}
                            setTimeSpan={(timeSpan) => onTimeSpan(timeSpan, 0)}
                            timeSpan={timeSpan}
                            timespanDisabled={timeSpan === 'line'}
                        />
                        <DaySelector
                            date={date}
                            dateIndex={dateIndex}
                            loading={loading}
                            onChange={(newIndex) => {
                                onTimeSpan(timeSpan, newIndex)
                            }}
                        />
                    </styled.ColumnContainer>
                    <styled.ColumnContainer>
                        <styled.RowContainer>
                            <styled.ChartTypeButton
                                selected={!showReport && timeSpan !== 'line'}
                                onClick={() => {
                                    setShowReport(false)
                                    onTimeSpan(timeSpan === 'line' ? 'day' : timeSpan, dateIndex)
                                }}
                            >
                                Bar
                        </styled.ChartTypeButton>

                            <styled.ChartTypeButton
                                selected={!showReport && timeSpan === 'line'}
                                onClick={() => {
                                    setShowReport(false)
                                    onTimeSpan('line', dateIndex)
                                }}
                            >
                                Line
                        </styled.ChartTypeButton>

                            <styled.ChartTypeButton
                                selected={!!showReport && timeSpan !== 'line'}
                                onClick={() => {
                                    setShowReport(true)
                                    onTimeSpan(timeSpan === 'line' ? 'day' : timeSpan, dateIndex)
                                }}
                            >
                                Reports
                        </styled.ChartTypeButton>
                        </styled.RowContainer>
                    </styled.ColumnContainer>
                </styled.HeaderSection>
                <styled.HeaderSection style={{ marginLeft: '2rem' }}>

                </styled.HeaderSection>
            </styled.HeaderBar>
            <styled.StationColumnsContainer>
                {renderStationColumns()}
            </styled.StationColumnsContainer>
        </styled.Container>
    )


}

export default Statistics