import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';

// Import Styles
import * as styled from '../charts.style'
import { ThemeContext } from 'styled-components';

// Import components
import LineThroughputChart from './line_throughput_chart/line_throughput_chart'

// Import Actions
import { getStationAnalytics } from '../../../../../../../redux/actions/stations_actions'

// Import Charts
import BarChart from '../../../chart_types/bar_chart'
import { useSelector } from "react-redux";
import { isObject } from "../../../../../../../methods/utils/object_utils";
import { capitalizeFirstLetter } from "../../../../../../../methods/utils/string_utils";
import { TIME_SPANS } from "../../statistics_overview";

const minHeight = 0

const ThroughputChart = (props) => {

    const themeContext = useContext(ThemeContext);

    const {
        data,
        isThroughputLoading,
        timeSpan,
        loadLineChartData,
        loadBarChartData,
        disableTimeSpan,
        isWidget,
    } = props

    // redux state
    const objects = useSelector(state => state.objectsReducer.objects)

    const [showBar, setShowBar] = useState(true)
    const [throughputData, setThroughputData] = useState([])
    const [lineData, setLineData] = useState([])
    const [isData, setIsData] = useState(false)
    const [chartKeys, setChartKeys] = useState(false)
    // const [chartColors, setChartColors] = useState(false)

    useEffect(() => {
        let tempChartKeys = []  // keys for chart = object names
        // let tempChartColors = {}
        let tempFilteredData = []
        let deletedObjKeys = []

        if (showBar) {
            data?.throughPut.forEach((currItem) => {
                const {
                    lable,
                    ...objectIds
                } = currItem || {}

                let updatedItem = { lable }   // used for changing keys from object ids to object names, keep label the same

                Object.entries(objectIds)
                    .filter((currEntry) => {
                        const [currKey, currVal] = currEntry

                        // remove entry if value is 0 to prevent showing a bunch of 0's on the axis
                        return currVal > 0
                    })
                    .forEach((currEntry, currIndex) => {
                        const [currKey, currVal] = currEntry

                        // for null key, set default name and use value. This is for objectless routes
                        if (currKey === null || currKey === "null") {

                            // default name
                            const currObjectName = "No Object"

                            // if name isn't in chart keys, add it, or else it won't show up on the chart
                            if (!tempChartKeys.includes(currObjectName)) {
                                tempChartKeys.push(currObjectName)
                            }
                            // add key,value pair to data item
                            updatedItem[currObjectName] = currVal
                        }

                        // route does have object id
                        else {
                            const currObject = objects[currKey]

                            // object with id was found
                            if (isObject(currObject)) {

                                // get object name
                                const {
                                    name: currObjectName = `Unnamed`
                                } = currObject || {}

                                // format
                                const currObjectNameCapitalized = capitalizeFirstLetter(currObjectName)

                                // add curr object to chartKeys if it isn't already in there
                                if (!tempChartKeys.includes(currObjectNameCapitalized)) {
                                    tempChartKeys.push(currObjectNameCapitalized)
                                }

                                // set updateItems value to current value for this object name
                                updatedItem[currObjectNameCapitalized] = currVal
                            }

                            // object with id was NOT found
                            else {
                                // if this id isn't already in deletedObjs array, add it
                                if (!deletedObjKeys.includes(currKey)) {
                                    deletedObjKeys.push(currKey)
                                }

                                // get index of id in deletedObjs arr
                                const deletedObjKeyIndex = deletedObjKeys.indexOf(currKey)

                                // create name using index
                                const currObjectName = `Deleted Object ${deletedObjKeyIndex + 1}`

                                // if name isn't in keys, add it, or else it won't show up on the chart
                                if (!tempChartKeys.includes(currObjectName)) {
                                    tempChartKeys.push(currObjectName)
                                }

                                // add key,value pair to data item
                                updatedItem[currObjectName] = currVal
                            }
                        }
                    })

                tempFilteredData.push(updatedItem)

            })

            // setChartColors(tempChartColors)
            setChartKeys(tempChartKeys)
            setIsData((throughputData && Array.isArray(throughputData) && throughputData.length > 0))
            setThroughputData(tempFilteredData)
            setLineData([])

        }
        else {
            console.log('QQQQ setting line data')
            setLineData(data.throughPut)
            setThroughputData([])
        }
    }, [data, showBar])

    useEffect(() => {
        if (showBar) {
            disableTimeSpan(false)
        } else {
            disableTimeSpan(true)
        }
    }, [showBar])

    // UseEffect for when to show a line chart or a bar chart
    useEffect(() => {
        if (timeSpan === 'line') {
            setShowBar(false)
        } else {
            setShowBar(true)
        }
    }, [timeSpan])

    return (
        <styled.SinglePlotContainer
            minHeight={minHeight}
        >
            {isWidget &&
                <styled.PlotHeader>
                    <styled.PlotTitle>Throughput</styled.PlotTitle>
                    {/* <styled.ChartButton onClick={() => setShowBar(!showBar)} >Compare Expected output</styled.ChartButton> */}

                    {(timeSpan === 'day' || timeSpan === 'line') &&
                        <>
                            <styled.ChartTypeButton
                                style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                                onClick={() => {
                                    loadBarChartData()
                                }}
                                selected={showBar}
                            >
                                Bar
                        </styled.ChartTypeButton>
                            <styled.ChartTypeButton
                                style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                                onClick={() => {
                                    loadLineChartData()
                                }}
                                selected={!showBar}
                            >
                                Line
                        </styled.ChartTypeButton>
                        </>
                    }
                </styled.PlotHeader>
            }

            {isThroughputLoading ?
                <styled.PlotContainer>
                    <styled.LoadingIcon className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem', marginTop: '5rem' }} />
                </styled.PlotContainer>
                :

                <styled.PlotContainer
                    minHeight={!!showBar ? minHeight : 27}
                >

                    {!showBar ?
                        <LineThroughputChart
                            themeContext={themeContext}
                            data={lineData ? lineData : []}
                            isData={isData}
                            date={data.date_title}
                        />
                        :
                        <BarChart
                            data={throughputData ? throughputData : []}
                            enableGridY={isData ? true : false}
                            mainTheme={themeContext}
                            timeSpan={timeSpan}

                            axisBottom={{
                                legend: TIME_SPANS[timeSpan]?.displayName || TIME_SPANS.day.displayName,
                                tickRotation: 45,
                            }}
                            axisLeft={{
                                enable: true,
                            }}
                            keys={chartKeys}
                            indexBy={'lable'}
                            colorBy={"id"}
                        />

                    }

                    {!data &&
                        <styled.NoDataText>No Data</styled.NoDataText>
                    }
                </styled.PlotContainer>
            }
        </styled.SinglePlotContainer>
    )
}

export default ThroughputChart