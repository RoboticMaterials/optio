import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';

// Import Styles
import * as styled from '../charts.style'
import { ThemeContext } from 'styled-components';

// Import components
import LineThroughputChart from './line_throughput_chart'

// Import Actions
import { getStationAnalytics } from '../../../../../../../redux/actions/stations_actions'

// Import Charts
import BarChart from '../../../chart_types/bar_chart'
import {useSelector} from "react-redux";
import {isObject} from "../../../../../../../methods/utils/object_utils";

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
        let tempLineData = []  // keys for chart = object names
        // let tempChartColors = {}
        let tempFilteredData = []

        data?.throughPut.forEach((currItem) => {
            // if(!showBar) return currItem // bar chart breaks if y's are removed

            const {
                lable,
                ...objectIds
            } = currItem

            let updatedItem = {lable}   // used for changing keys from object ids to object names, keep label the same
            let lineItem = {
                x: lable,
                y: 0
            }

            Object.entries(objectIds)
                .filter((currEntry) => {
                    const [currKey, currVal] = currEntry

                    // remove entry if key is invalid, there is no corresponding object, or the value is not greater than 0
                    return currKey && isObject(objects[currKey]) && currVal > 0
                })
                .forEach((currEntry) => {
                    const [currKey, currVal] = currEntry

                    // handle throughput data
                    {
                        const currObject = objects[currKey]
                        const {
                            name: currObjectName = ""
                        } = currObject || {}

                        // add curr object to chartKeys if it isn't already in there
                        if (!tempChartKeys.includes(currObjectName)) {
                            tempChartKeys.push(currObjectName)
                        }

                        // set updateItems value to current value for this object name
                        updatedItem[currObjectName] = currVal


                    }

                    // handle line data
                    {
                        lineItem.y = lineItem.y + currVal
                    }
                })

            tempFilteredData.push(updatedItem)
            tempLineData.push(lineItem)

        })

        // setChartColors(tempChartColors)
        setChartKeys(tempChartKeys)
        setIsData((throughputData && Array.isArray(throughputData) && throughputData.length > 0))
        setThroughputData(tempFilteredData)
        setLineData(tempLineData)
    }, [data])

    useEffect(() => {
        if (showBar) {
            disableTimeSpan(false)
        } else {
            disableTimeSpan(true)
        }
    }, [showBar])

    return (
        <styled.SinglePlotContainer
            minHeight={minHeight}
        >
            <styled.PlotHeader>
                <styled.PlotTitle>Throughput</styled.PlotTitle>
                {/* <styled.ChartButton onClick={() => setShowBar(!showBar)} >Compare Expected output</styled.ChartButton> */}

                {(timeSpan === 'day' || timeSpan === 'line') &&
                    <>
                        <styled.ChartTypeButton
                            style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                            onClick={() => {
                                setShowBar(true)
                                loadBarChartData()
                            }}
                            selected={showBar}
                        >
                            Bar
                        </styled.ChartTypeButton>
                        <styled.ChartTypeButton
                            style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                            onClick={() => {
                                setShowBar(false)
                                loadLineChartData()
                            }}
                            selected={!showBar}
                        >
                            Line
                </styled.ChartTypeButton>
                    </>
                }
            </styled.PlotHeader>

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
                                tickRotation: -90,
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