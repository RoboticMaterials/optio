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

// Import API
import { getLocationAnalytics } from '../../../../../api/analytics_api'
import theme from '../../../../../theme';
import { ResponsiveBar } from '@nivo/bar';

// Import Utils
import { getDateName, getDateFromString } from '../../../../../methods/utils/utils'

// TODO: Commented out charts for the time being (See comments that start with TEMP)
const StatisticsOverview = (props) => {

    const theme = useContext(ThemeContext);

    const [delayChartRender, setDelayChartRender] = useState('none')
    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const locations = useSelector(state => state.locationsReducer.locations)
    const devices = useSelector(state => state.devicesReducer.devices)

    const [data, setData] = useState(null)
    const [timeSpan, setTimeSpan] = useState('day')
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

    useEffect(() => {

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
        const dataPromise = getLocationAnalytics(params.locationID, 'day')
        dataPromise.then(response => {

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
    useEffect(() => {
        if (data !== null) {
            const N = Math.round(Math.max(data[selector].length, 80) / 6)
            const ticks = everyN(data[selector], N).map(datapoint => datapoint.x)
            setDefaultTicks(ticks)
        }
    }, [data])

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

    const handleTimeSpan = (timeSpan) => {

        setIsLoading(true)
        const dataPromise = getLocationAnalytics(params.locationID, timeSpan)
        dataPromise.then(response => {
            setData(response)
            setIsLoading(false)
        })

        switch (timeSpan) {
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

    // Handles the date selector at the top of the charts
    const handleDateSelector = () => {

        if (data === null) return null

        const throughPut = data.throughPut

        let dateSelectorTitle = ''
        let date

        switch (timeSpan) {
            case 'day':
                date = getDateFromString(Object.values(throughPut)[0].x)
                dateSelectorTitle = date.toDateString()
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
                <styled.DateSelectorIcon className='fas fa-chevron-left' />
                {isLoading ? 
                    <i className="fas fa-circle-notch fa-spin"/>
                :
                    <h2>{dateSelectorTitle}</h2>

                }
                <styled.DateSelectorIcon className='fas fa-chevron-right' />
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
                    <TimeSpans color={colors[selector]} setTimeSpan={(ts) => handleTimeSpan(ts)} timeSpan={timeSpan}></TimeSpans>

                    {/* Commented out for now, only need through put bar chart */}
                    {/* {handleGaugeCharts()} */}
                </>
            }

            {/* Commented out for now, only need through put bar chart */}
            {/* <DataSelector selector={selector} setSelector={setSelector} /> */}

            {handleDateSelector()}


            <styled.PlotContainer
                ref={pc => plotRef = pc}
                // onMouseMove={findSlice}
                onMouseLeave={() => { setSlice(null) }}
            >
                {isLoading ? <i className="fas fa-circle-notch fa-spin"/> : <BarChart data={data} selector={selector}/>}

            </styled.PlotContainer>


        </styled.OverviewContainer>
    )
}

export default StatisticsOverview