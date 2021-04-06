import React, { useEffect, useState, useRef, useContext, memo } from 'react';
import { useDispatch, useSelector } from "react-redux";

// Import Components
import ThroughputChart from '../../../../../widgets/widget_pages/statistics_page/statistics_overview/charts/throughput_chart/throughput_chart'

// Import Styles
import * as styled from './station_column.style'

// Import Actions
import { getStationAnalytics } from '../../../../../../redux/actions/stations_actions'


const StationColumn = (props) => {

    const {
        timeSpan,
        dateIndex,
        setDateTitle,
        stationId = '',
    } = props

    const stations = useSelector(state => state.stationsReducer.stations)

    const [throughputData, setThroughputData] = useState(null)
    const [isThroughputLoading, setIsThroughputLoading] = useState(false)

    const currentStation = stations[stationId] || {}

    // On page load, load in the data for today
    useEffect(() => {

        // TEMP
        // If the page has been loaded in (see widget pages) then don't delay chart load, 
        // else delay chart load because it slows down the widget page opening animation.
        // if (widgetPageLoaded) {
        //     setDelayChartRender('flex')
        // } else {
        //     setTimeout(() => {
        //         setDelayChartRender('flex')
        //     }, 300);
        // }


        // TEMP
        const body = { timespan: timeSpan, index: dateIndex }
        const dataPromise = getStationAnalytics(stationId, body)
        dataPromise.then(response => {
            if (response === undefined) return
            setThroughputData(response)
            setDateTitle(response.date_title)
        })

    }, [timeSpan, dateIndex])

    // This function is similar to 'onTimeSpan' which is found in statistics_overview
    const onChangeChartType = (newTimeSpan, newDateIndex) => {

        const body = { timespan: newTimeSpan, index: newDateIndex }
        const dataPromise = getStationAnalytics(stationId, body)

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
            }

            setThroughputData(response)
            setIsThroughputLoading(false)
        })

    }


    return (
        <styled.StationColumnContainer>
            <p>{currentStation.name}</p>
            <ThroughputChart
                data={throughputData}
                isThroughputLoading={isThroughputLoading}
                timeSpan={timeSpan}
                loadLineChartData={() => {
                    onChangeChartType('line', dateIndex)
                }}
                loadBarChartData={() => {
                    onChangeChartType('day', dateIndex)

                }}
                disableTimeSpan={(bool) => {
                    // setTimespanDisabled(bool)
                }}
            />
        </styled.StationColumnContainer>
    )
}

export default StationColumn