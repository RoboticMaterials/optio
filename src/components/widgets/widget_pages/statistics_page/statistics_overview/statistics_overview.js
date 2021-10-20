import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import styles
import * as styled from './statistics_overview.style'
import { ThemeContext } from 'styled-components';

// Import Charts
import ThroughputChart from './charts/throughput_chart/throughput_chart'
import ReportChart from './charts/report_chart'

// Import Components
import DataSelector from './data_selector/data_selector.js'
import ApexGaugeChart from './apex_gauge_chart'
import DaySelector from '../../../../basic/day_selector/day_selector'
import TimeSpanSelector from '../../../../basic/timespan_selector/time_span_selector'

// Import Actions
import { getStationAnalytics } from '../../../../../redux/actions/stations_actions'

// Import Utils
import { getDateName, getDateFromString, convertArrayToObject } from '../../../../../methods/utils/utils'
import { getReportAnalytics, getReportEvents } from "../../../../../redux/actions/report_event_actions";

export const TIME_SPANS = {
    live: {
        name: "live",
        displayName: "Live",
    },
    day: {
        name: "day",
        displayName: "Time",
    },
    week: {
        name: "week",
        displayName: "Day"
    },
    month: {
        name: "month",
        displayName: "Week"
    },
    year: {
        name: "year",
        displayName: "Month"
    },
    all: {
        name: "all",
        displayName: "All"
    }
}

// TODO: Commented out charts for the time being (See comments that start with TEMP)
const StatisticsOverview = (props) => {

    const themeContext = useContext(ThemeContext);

    const params = useParams()
    const stationID = params.stationID
    let plotRef = useRef()

    const dispatch = useDispatch()
    const dispatchGetReportEvents = () => dispatch(getReportEvents());

    const [delayChartRender, setDelayChartRender] = useState('none')
    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const stations = useSelector(state => state.stationsReducer.stations)
    const reportEvents = useSelector(state => { return state.reportEventsReducer.reportEvents }) || {}
    const dashboards = useSelector(state => { return state.dashboardsReducer.dashboards }) || {}

    const [lineData, setLineData] = useState(null)
    const [barData, setBarData] = useState(null)
    const [reportData, setReportData] = useState(null)

    const [timeSpan, setTimeSpan] = useState('day')
    const [dateIndex, setDateIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [timespanDisabled, setTimespanDisabled] = useState(false)
    const [parentSortLevel, setParentSortLevel] = useState({ label: 'Product Group', value: 'product_group_id' })
    const [reportButtons, setReportButtons] = useState([])

    // update location properties
    useEffect(() => {

        const location = stations[stationID]

        // get report buttons
        const dashboardId = location.dashboards && Array.isArray(location.dashboards) && location.dashboards[0]
        const dashboard = dashboards[dashboardId] ? dashboards[dashboardId] : {}
        const currReportButtons = dashboard.report_buttons ? dashboard.report_buttons : []

        // store as object of ids to prevent excessive looping
        setReportButtons(convertArrayToObject(currReportButtons, "_id"))

    }, [stationID, dashboards, stations])


    const colors = {
        taktTime: '#42e395',
        pYield: '#59dbff',
        throughPut: '#d177ed'
    }

    // On page load, load in the data for today
    useEffect(() => {
        getAllData()
        const dataInterval = setInterval(() => getAllData(), 30000)
        return () => {
            clearInterval(dataInterval)
        }
    }, [timeSpan])

    const getAllData = () => {
        dispatchGetReportEvents() // load report events

        // If the page has been loaded in (see widget pages) then don't delay chart load, 
        // else delay chart load because it slows down the widget page opening animation.
        if (widgetPageLoaded) {
            setDelayChartRender('flex')
        } else {
            setTimeout(() => {
                setDelayChartRender('flex')
            }, 300);
        }

        const body = { timespan: timeSpan, index: dateIndex, sort_index: parentSortLevel.value }
        const dataPromise = getStationAnalytics(stationID, body)
        dataPromise.then(response => {
            if (response === undefined) return setLoading(false)
            // Convert Throughput

            if (timeSpan === 'line') {
                let convertedThroughput = response.throughPut.map(dataPoint => {
                    let convertedTime = dataPoint.x * 1000
                    convertedTime = Math.round(convertedTime)
                    return { x: convertedTime, y: dataPoint.y }
                })
                setLineData({
                    ...response,
                    throughPut: convertedThroughput
                })
                setTimeSpan('line')
            } else {
                setBarData(response)
            }
            
            setLoading(false)

            return response;
        })

        getReportData(body)
    }

    const getReportData = async (body) => {
        setLoading(true)
        const reportAnalyticsResponse = await getReportAnalytics(stationID, body)

        if (reportAnalyticsResponse && !(reportAnalyticsResponse instanceof Error)) {
            setReportData(reportAnalyticsResponse)
        }
        setLoading(false)
    }

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
    const onTimeSpan = async (newTimeSpan, newDateIndex, newSortLevel) => {

        setTimeSpan(newTimeSpan)
        setDateIndex(newDateIndex)
        setParentSortLevel(newSortLevel)

        setLoading(true)

        const body = { timespan: newTimeSpan, index: newDateIndex, sort_index: newSortLevel.value }
        const dataPromise = getStationAnalytics(stationID, body)

        // If the timespan changes to line, then dont change what the report chart is showing
        if (newTimeSpan !== 'line') {
            const reportAnalyticsResponse = await getReportAnalytics(stationID, body)
            if (reportAnalyticsResponse && !(reportAnalyticsResponse instanceof Error)) {
                setReportData(reportAnalyticsResponse)
            }
        }

        return dataPromise.then(response => {
            if (response === undefined) return setLoading(false)
            // Convert Throughput

            if (newTimeSpan === 'line') {
                let convertedThroughput = response.throughPut.map(dataPoint => {
                    let convertedTime = dataPoint.x * 1000
                    convertedTime = Math.round(convertedTime)
                    return { x: convertedTime, y: dataPoint.y }
                })
                setLineData({
                    ...response,
                    throughPut: convertedThroughput
                })
                setTimeSpan('line')
            } else {
                setBarData(response)
            }

            setLoading(false)

            return response;
        })
    }

    const renderHeader = () => {
        return (
            <div style={{ marginBottom: '1rem', alignItems: "center", display: "flex", flexDirection: "column" }}>
                {
                    <>
                        <TimeSpanSelector
                            timespanDisabled={timespanDisabled}
                            setTimeSpan={(timeSpan) => onTimeSpan(timeSpan, 0, parentSortLevel)}
                            timeSpan={timeSpan}
                        />
                        {/* Commented out for now, only need through put bar chart */}
                        {/* {handleGaugeCharts()} */}
                    </>
                }
                {renderDateSelector()}
            </div>
        )
    }

    // Handles the date selector at the top of the charts
    const renderDateSelector = () => {

        let date_title
        if (timeSpan === 'line') {
            date_title = lineData?.date_title || null
        } else {
            date_title = barData?.date_title || null
        }

        if (date_title === null) return null

        return (
            <DaySelector
                date={date_title}
                dateIndex={dateIndex}
                loading={loading}
                onChange={(newIndex) => {
                    onTimeSpan(timeSpan, newIndex, parentSortLevel)
                }}
            />
        )

    }



    return (

        <styled.OverviewContainer>
            {/* {isDevice &&
                handleDeviceStatistics()
            } */}


            {/* Commented out for now, only need through put bar chart */}
            {/* <DataSelector selector={selector} setSelector={setSelector} /> */}

            <styled.PlotsContainer
                ref={pc => plotRef = pc}
            // onMouseMove={findSlice}
            >
                {renderHeader()}
                <ThroughputChart
                    lineData={lineData}
                    barData={barData}

                    loading={loading}
                    timeSpan={timeSpan}
                    isWidget={true}
                    loadLineChartData={(sortLevel) => onTimeSpan('line', dateIndex, parentSortLevel)}
                    loadBarChartData={(sortLevel) => onTimeSpan('day', dateIndex, parentSortLevel)}
                    disableTimeSpan={(bool) => {
                        setTimespanDisabled(bool)
                    }}
                    setParentSortLevel={(val) => {
                        onTimeSpan(timeSpan, dateIndex, val)
                    }}
                    sortLevel={parentSortLevel}
                />
                <ReportChart
                    reportButtons={reportButtons}
                    reportDate={reportData}
                    isThroughputLoading={loading}
                    timeSpan={timeSpan}
                    reportData={reportData}
                    isWidget={true}
                />
            </styled.PlotsContainer>

        </styled.OverviewContainer>
    )
}

export default StatisticsOverview