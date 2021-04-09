import React, { useEffect, useState, useRef, useContext, memo } from 'react';
import { useDispatch, useSelector } from "react-redux";

// Import Components
import ThroughputChart from '../../../../../widgets/widget_pages/statistics_page/statistics_overview/charts/throughput_chart/throughput_chart'
import ReportChart from '../../../../../widgets/widget_pages/statistics_page/statistics_overview/charts/report_chart'

// Import Styles
import * as styled from './station_column.style'

// Import Actions
import { getStationAnalytics } from '../../../../../../redux/actions/stations_actions'
import { getReportAnalytics, getReportEvents } from "../../../../../../redux/actions/report_event_actions";

// Import utils
import { convertArrayToObject } from '../../../../../../methods/utils/utils'


const StationColumn = (props) => {

    const {
        timeSpan,
        dateIndex,
        setDateTitle,
        stationId = '',
        showReport,
    } = props

    const stations = useSelector(state => state.stationsReducer.stations)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)

    const dispatch = useDispatch()
    const dispatchGetReportEvents = () => dispatch(getReportEvents());

    const [throughputData, setThroughputData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [reportButtons, setReportButtons] = useState([])
    const [reportData, setReportData] = useState(null)

    const currentStation = stations[stationId] || {}

    // get report buttons
    useEffect(() => {

        const dashboardId = currentStation.dashboards && Array.isArray(currentStation.dashboards) && currentStation.dashboards[0]
        const dashboard = dashboards[dashboardId] ? dashboards[dashboardId] : {}
        const currReportButtons = dashboard.report_buttons ? dashboard.report_buttons : []
        setReportButtons(convertArrayToObject(currReportButtons, "_id"))

    }, [currentStation, stations, dashboards])

    // On page load, load in the data for today
    useEffect(() => {
        if (!!showReport) {
            dispatchGetReportEvents() // load report events

            const body = { timespan: timeSpan, index: dateIndex }

            getReportData(body)
        }
    }, [showReport, timeSpan, dateIndex])

    const getReportData = async (body) => {
        setIsLoading(true)
        const reportAnalyticsResponse = await getReportAnalytics(stationId, body)

        if (reportAnalyticsResponse && !(reportAnalyticsResponse instanceof Error)) {
            setReportData(reportAnalyticsResponse)
        }
        setIsLoading(false)

    }




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
            // Convert Throughput
            if (timeSpan === 'line') {
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
            setDateTitle(response.date_title)
        })

    }, [timeSpan, dateIndex])

    return (

        collapsed ?
            <styled.StationCollapsedContainer>
                <styled.CollapseIcon
                    className="fa fa-chevron-right"
                    aria-hidden="true"
                    onClick={() => setCollapsed(false)}
                />
                <styled.StationTitle rotated={true}>
                    {currentStation.name}
                </styled.StationTitle>
            </styled.StationCollapsedContainer >
            :
            <styled.StationColumnContainer >
                <styled.StationColumnHeader>
                    <styled.CollapseIcon
                        className="fa fa-chevron-down"
                        aria-hidden="true"
                        onClick={() => setCollapsed(true)} />
                    <styled.StationTitle>{currentStation.name}</styled.StationTitle>
                </styled.StationColumnHeader >

                {showReport ?
                    <ReportChart
                        reportButtons={reportButtons}
                        reportDate={reportData}
                        isThroughputLoading={isLoading}
                        timeSpan={timeSpan}
                        reportData={reportData}
                    />
                    :
                    <ThroughputChart
                        data={throughputData}
                        isWidget={false}
                        isThroughputLoading={isLoading}
                        timeSpan={timeSpan}
                        disableTimeSpan={(bool) => {
                            // setTimespanDisabled(bool)
                        }}
                    />
                }

            </styled.StationColumnContainer >



    )
}

export default StationColumn