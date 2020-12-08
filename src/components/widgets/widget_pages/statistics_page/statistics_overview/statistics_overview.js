import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import styles
import * as styled from './statistics_overview.style'
import { ThemeContext } from 'styled-components';

// Import Components
import TimeSpans from './timespans/timespans'
import DataSelector from './data_selector/data_selector.js'
import ApexGaugeChart from './apex_gauge_chart'
import BarChart from '../statistics_charts/statistics_charts_types/bar_chart'

import { ResponsiveLine } from '@nivo/line'

// Import Actions
import { getStationAnalytics } from '../../../../../redux/actions/stations_actions'


import { ResponsiveBar } from '@nivo/bar';

// Import Utils
import { getDateName, getDateFromString } from '../../../../../methods/utils/utils'
import {getReportEvents} from "../../../../../redux/actions/report_event_actions";

const tempColors = ['#FF4B4B', '#56d5f5', '#50de76', '#f2ae41', '#c7a0fa']

// TODO: Commented out charts for the time being (See comments that start with TEMP)
const StatisticsOverview = (props) => {

    const themeContext = useContext(ThemeContext);

    const dispatch = useDispatch()
    const onGetReportEvents = () => dispatch(getReportEvents());

    const [delayChartRender, setDelayChartRender] = useState('none')
    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const locations = useSelector(state => state.locationsReducer.locations)
    const devices = useSelector(state => state.devicesReducer.devices)
    const reportEvents = useSelector(state => { return state.reportEventsReducer.reportEvents }) || {}

    const [data, setData] = useState(null)
    const [timeSpan, setTimeSpan] = useState('day')
    const [dateIndex, setDateIndex] = useState(0)
    const [format, setFormat] = useState('%m-%d %H:%M')
    const [selector, setSelector] = useState('throughPut')
    const [slice, setSlice] = useState(null)
    const [defaultTicks, setDefaultTicks] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [isDevice, setIsDevice] = useState(false)

    const params = useParams()
    const stationID = params.stationID
    let plotRef = useRef()


    const locationName = locations[params.stationID].name

    const colors = {
        taktTime: '#42e395',
        pYield: '#59dbff',
        throughPut: '#d177ed'
    }

    // On page load, load in the data for today
    useEffect(() => {
        onGetReportEvents() // load report events


        if (locations[params.stationID].device_id !== undefined) {
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
            setData(response)

        })
    }, [])

    const handleDeviceStatistics = () => {

        const device = devices[locations[params.stationID].device_id]
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
    const handleTimeSpan = async (newTimeSpan, newDateIndex) => {

        setTimeSpan(newTimeSpan)
        setDateIndex(newDateIndex)

        setIsLoading(true)

        const body = { timespan: newTimeSpan, index: newDateIndex }
        const dataPromise = getStationAnalytics(stationID, body)
        dataPromise.then(response => {

            if (response === undefined) return setIsLoading(false)

            setData(response)
            setIsLoading(false)
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

    const renderReportChart = () => {
        // stationID = params.stationID
        var stationReportEventIds = reportEvents.station_id && reportEvents.station_id[stationID]

        let data = []

        stationReportEventIds && Array.isArray(stationReportEventIds) && stationReportEventIds.forEach((currId, ind) => {
            const currentEvent = reportEvents._id && reportEvents._id[currId]

            const {
                _id,
                dashboard_id,
                station_id,
                report_button_id,
                event_count,
                description,
                label,
            } = currentEvent || {}

            if(label && event_count) data.push({
                x: label,
                y: event_count,
            })
        })

        const isData = data.length > 0

        if(isData) {
            // add blank entries if there are less than 5 so the chart looks better
            let blankLabel = ""
            for(let i = data.length; i < 5; i++) {
                data.push({
                    x: blankLabel,
                    y: 0
                })
                blankLabel += " "
            }

            // sort by event_count, which is stored under the key 'y'
            data.sort(function(a, b) {
                var keyA = a.y,
                    keyB = b.y;
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
        }

        else {
            data.push({
                x: "",
                y: 0
            })
        }
        return(
            <styled.SinglePlotContainer>
                <styled.DateSelectorTitle>Reports</styled.DateSelectorTitle>

                <BarChart
                    layout={isData ? "horizontal" : "vertical"}
                    data={data}
                    // selector={"day"}
                    enableGridX={ isData ? true : false}
                    enableGridY={ !isData ? true : false}
                    mainTheme={themeContext}
                    axisBottom={{
                        legend: 'Count',
                    }}
                    axisLeft={{
                        legend: 'Event'
                    }}
                />

                {!isData &&
                    <styled.NoDataText>No Data</styled.NoDataText>
                }
            </styled.SinglePlotContainer>
        )
    }

    // Handles the date selector at the top of the charts
    const handleDateSelector = () => {

        if (data === null) return null

        const throughPut = data.throughPut

        let dateSelectorTitle = ''
        let date
        const today = new Date()

        switch (timeSpan) {
            case 'day':
                // date = getDateFromString(Object.values(throughPut)[0].x)
                dateSelectorTitle = today.toDateString()
                break;

            case 'week':
                const firstDate = getDateFromString(Object.values(throughPut)[0].x)
                const lastDate = getDateFromString(Object.values(throughPut)[Object.values(throughPut).length - 1].x)
                dateSelectorTitle = `${firstDate.toDateString()} - ${lastDate.toDateString()}`
                break;

            case 'month':
                date = getDateFromString(Object.values(throughPut)[0].x)
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                dateSelectorTitle = `${months[date.getMonth()]} ${date.getFullYear()}`
                break;

            case 'year':
                date = getDateFromString(Object.values(throughPut)[0].x)
                dateSelectorTitle = `${date.getFullYear()}`
                break;

            default:
                break;
        }


        return (
            <styled.RowContainer>
                <styled.DateSelectorIcon
                    className='fas fa-chevron-left'
                    onClick={() => {
                        const index = dateIndex + 1
                        handleTimeSpan(timeSpan, index)
                    }}
                />
                {isLoading ?
                    <styled.LoadingIcon className="fas fa-circle-notch fa-spin" />
                    :
                    <styled.DateSelectorTitle>{data.date_title}</styled.DateSelectorTitle>

                }

                {/* If the current dateIndex is 0, hide go to next day button. Can't go to the future now can we dummy */}
                {dateIndex !== 0 &&
                    <styled.DateSelectorIcon
                        className='fas fa-chevron-right'
                        onClick={() => {
                            const index = dateIndex - 1
                            handleTimeSpan(timeSpan, index)
                        }}
                    />

                }
            </styled.RowContainer>
        )

    }

    const handleGaugeCharts = () => {
        return (
            <styled.StatsSection>
                <ApexGaugeChart max={Math.min(...data.taktTime.map(point => point.y))} min={Math.max(...data.taktTime.map(point => point.y))} value={data.taktTime[data.taktTime.length - 1].y}
                    formatValue={() => {
                        // const val = data.taktTime[data.taktTime.length - 1].y
                        // return String(Math.floor(val)) + ':' + String(Math.round((val % 1) * 60))
                        return '1:23'
                    }}
                    name='Takt Time' color={colors.taktTime} onClick={() => setSelector('taktTime')} selected={selector == 'taktTime'} />
                <ApexGaugeChart min={Math.min(...data.pYield.map(point => point.y))} max={Math.max(...data.pYield.map(point => point.y))} value={data.pYield[data.pYield.length - 1].y}
                    formatValue={() =>
                        Math.round(10 * data.pYield[data.pYield.length - 1].y) / 10
                    }
                    name='Quality' color={colors.pYield} onClick={() => setSelector('pYield')} selected={selector == 'pYield'} />
                <ApexGaugeChart min={Math.min(...data.throughPut.map(point => point.y))} max={Math.max(...data.throughPut.map(point => point.y))} value={data.throughPut[data.throughPut.length - 1].y}
                    formatValue={() =>
                        data.throughPut[data.throughPut.length - 1].y
                    }
                    name='Throughput' color={colors.throughPut} onClick={() => setSelector('throughPut')} selected={selector == 'throughPut'} />
            </styled.StatsSection>
        )
    }

    return (

        <styled.OverviewContainer>
            <styled.StationName>{locationName}</styled.StationName>

            {/* {isDevice &&
                handleDeviceStatistics()
            } */}

            {!!data &&
                <>
                    <TimeSpans color={colors[selector]} setTimeSpan={(timeSpan) => handleTimeSpan(timeSpan, 0)} timeSpan={timeSpan}></TimeSpans>

                    {/* Commented out for now, only need through put bar chart */}
                    {/* {handleGaugeCharts()} */}
                </>
            }

            {/* Commented out for now, only need through put bar chart */}
            {/* <DataSelector selector={selector} setSelector={setSelector} /> */}

            {handleDateSelector()}


            {isLoading ?
                <styled.LoadingIcon className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem', marginTop: '5rem' }} />
                :

                // <BarChart data={data} selector={selector} />

                <styled.PlotsContainer
                    ref={pc => plotRef = pc}
                    // onMouseMove={findSlice}
                    onMouseLeave={() => { setSlice(null) }}
                >

                    <styled.SinglePlotContainer>
                    <styled.DateSelectorTitle>Throughput</styled.DateSelectorTitle>

                    <BarChart
                        data={data ? data : {
                            // default fake data
                            throughPut:[{
                                x: "",
                                y: 0
                            }]}
                        }
                        enableGridY={true}
                        selector={selector}
                        mainTheme={themeContext}
                        timeSpan={timeSpan}
                    />
                        {!data &&
                        <styled.NoDataText>No Data</styled.NoDataText>
                        }
                    </styled.SinglePlotContainer>
                    {/* <BarChart data={data} selector={selector} /> */}


                    {renderReportChart()}


                </styled.PlotsContainer>



            }



        </styled.OverviewContainer>
    )
}

export default StatisticsOverview