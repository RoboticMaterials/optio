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


import { ResponsiveBar } from '@nivo/bar';

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
    const devices = useSelector(state => state.devicesReducer.devices)
    const reportEvents = useSelector(state => { return state.reportEventsReducer.reportEvents }) || {}
    const dashboards = useSelector(state => { return state.dashboardsReducer.dashboards }) || {}

    const [throughputData, setThroughputData] = useState(null)
    const [reportData, setReportData] = useState(null)

    const [timeSpan, setTimeSpan] = useState('day')
    const [dateIndex, setDateIndex] = useState(0)
    const [format, setFormat] = useState('%m-%d %H:%M')
    const [selector, setSelector] = useState('throughPut')
    const [slice, setSlice] = useState(null)
    const [defaultTicks, setDefaultTicks] = useState([])
    const [isThroughputLoading, setIsThroughputLoading] = useState(false)
    const [isReportsLoading, setIsReportsLoading] = useState(false)
    const [timespanDisabled, setTimespanDisabled] = useState(false)

    const [isDevice, setIsDevice] = useState(false)
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
        dispatchGetReportEvents() // load report events


        if (stations[params.stationID].device_id !== undefined) {
            setIsDevice(true)
        }

        // TEMP
        // If the page has been loaded in (see widget pages) then don't delay chart load, 
        // else delay chart load because it slows down the widget page opening animation.
        if (widgetPageLoaded) {
            setDelayChartRender('flex')
        } else {
            setTimeout(() => {
                setDelayChartRender('flex')
            }, 300);
        }

        // TEMP
        const body = { timespan: timeSpan, index: dateIndex }
        const dataPromise = getStationAnalytics(stationID, body)
        dataPromise.then(response => {
            if (response === undefined) return
            setThroughputData(response)

        })

        getReportData(body)
    }, [])

    const getReportData = async (body) => {
        const reportAnalyticsResponse = await getReportAnalytics(stationID, body)

        if (reportAnalyticsResponse && !(reportAnalyticsResponse instanceof Error)) {
            setReportData(reportAnalyticsResponse)
            setIsReportsLoading(false)
        }
    }

    const handleDeviceStatistics = () => {

        const device = devices[stations[params.stationID].device_id]
        if (device === undefined) return
        return (

            <>
                {/* <p>{Object.keys(device.real_data)}</p> */}
                <styled.StatLabel>{device.real_data}</styled.StatLabel>
            </>
        )
    }

    // TEMP
    // useEffect(() => {
    //     if (data !== null) {
    //         const N = Math.round(Math.max(data[selector].length, 80) / 6)
    //         const ticks = everyN(data[selector], N).map(datapoint => datapoint.x)
    //         setDefaultTicks(ticks)
    //     }
    // }, [data])

    const findSlice = e => {
        // console.log(e.clientX, plotRef.getBoundingClientRect())
    }

    const everyN = (array, N) => {
        return array.filter(function (value, index) {
            return index % N == 0 || index == array.length - 1;
        });
    }

    const pickN = (array, N) => {
        const linspace = Math.round(array.length / N)
        return everyN(array, linspace)
    }

    const ToolTipCallback = (props) => {
        setSlice(props.slice.points[0].data)
        return null
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
    const onTimeSpan = async (newTimeSpan, newDateIndex) => {

        setTimeSpan(newTimeSpan)
        setDateIndex(newDateIndex)

        setIsThroughputLoading(true)
        setIsReportsLoading(true)

        const body = { timespan: newTimeSpan, index: newDateIndex }
        const dataPromise = getStationAnalytics(stationID, body)

        // If the timespan changes to line, then dont change what the report chart is showing
        if (newTimeSpan !== 'line') {
            const reportAnalyticsResponse = await getReportAnalytics(stationID, body)
            if (reportAnalyticsResponse && !(reportAnalyticsResponse instanceof Error)) {
                setReportData(reportAnalyticsResponse)
                setIsReportsLoading(false)
            }
        }

        dataPromise.then(response => {

            if (response === undefined) return setIsThroughputLoading(false)
            // Convert Throughput
            if (newTimeSpan === 'line') {
                let convertedThroughput = []
                response.throughPut.forEach((dataPoint) => {
                    // Round Epoch time and multiply by 1000 to match front end times
                    let convertedTime = dataPoint.x * 1000
                    convertedTime = Math.round(convertedTime)
                    convertedThroughput.push({ x: convertedTime, y: dataPoint.y })
                })
                response = {
                    ...response,
                    throughPut: convertedThroughput
                }
                setTimeSpan('line')
            }

            setThroughputData(response)
            setIsThroughputLoading(false)
        })

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

    const renderHeader = () => {
        return (
            <div style={{ marginBottom: '1rem', alignItems: "center", display: "flex", flexDirection: "column" }}>
                {
                    <>
                        <TimeSpanSelector
                            timespanDisabled={timespanDisabled}
                            setTimeSpan={(timeSpan) => onTimeSpan(timeSpan, 0)}
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

        if (throughputData === null) return null

        return (
            <DaySelector
                date={throughputData.date_title}
                dateIndex={dateIndex}
                loading={isThroughputLoading}
                onChange={(newIndex) => {
                    onTimeSpan(timeSpan, newIndex)
                }}
            />
        )

    }

    const handleGaugeCharts = () => {
        return (
            <styled.StatsSection>
                <ApexGaugeChart max={Math.min(...throughputData.taktTime.map(point => point.y))} min={Math.max(...throughputData.taktTime.map(point => point.y))} value={throughputData.taktTime[throughputData.taktTime.length - 1].y}
                    formatValue={() => {
                        // const val = data.taktTime[data.taktTime.length - 1].y
                        // return String(Math.floor(val)) + ':' + String(Math.round((val % 1) * 60))
                        return '1:23'
                    }}
                    name='Takt Time' color={colors.taktTime} onClick={() => setSelector('taktTime')} selected={selector == 'taktTime'} />
                <ApexGaugeChart min={Math.min(...throughputData.pYield.map(point => point.y))} max={Math.max(...throughputData.pYield.map(point => point.y))} value={throughputData.pYield[throughputData.pYield.length - 1].y}
                    formatValue={() =>
                        Math.round(10 * throughputData.pYield[throughputData.pYield.length - 1].y) / 10
                    }
                    name='Quality' color={colors.pYield} onClick={() => setSelector('pYield')} selected={selector == 'pYield'} />
                <ApexGaugeChart min={Math.min(...throughputData.throughPut.map(point => point.y))} max={Math.max(...throughputData.throughPut.map(point => point.y))} value={throughputData.throughPut[throughputData.throughPut.length - 1].y}
                    formatValue={() =>
                        throughputData.throughPut[throughputData.throughPut.length - 1].y
                    }
                    name='Throughput' color={colors.throughPut} onClick={() => setSelector('throughPut')} selected={selector == 'throughPut'} />
            </styled.StatsSection>
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
                onMouseLeave={() => { setSlice(null) }}
            >
                {renderHeader()}
                <ThroughputChart
                    data={throughputData}
                    isThroughputLoading={isThroughputLoading}
                    timeSpan={timeSpan}
                    isWidget={true}
                    loadLineChartData={() => {
                        onTimeSpan('line', dateIndex)
                    }}
                    loadBarChartData={() => {
                        onTimeSpan('day', dateIndex)

                    }}
                    disableTimeSpan={(bool) => {
                        setTimespanDisabled(bool)
                    }}
                />
                <ReportChart
                    reportButtons={reportButtons}
                    reportDate={reportData}
                    isThroughputLoading={isThroughputLoading}
                    timeSpan={timeSpan}
                    reportData={reportData}
                    isWidget={true}
                />
            </styled.PlotsContainer>

        </styled.OverviewContainer>
    )
}

export default StatisticsOverview