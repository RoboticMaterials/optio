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

const ThroughputChart = (props) => {

    const themeContext = useContext(ThemeContext);

    const {
        throughputData,
        isThroughputLoading,
        timeSpan,
        loadLineChartData,
        loadBarChartData,
        disableTimeSpan,
    } = props

    const [showBar, setShowBar] = useState(true)

    const filteredData = throughputData?.throughPut.map((currItem) => {
        if(!showBar) return currItem // bar chart breaks if y's are removed

        // get x and y
        const {
            x,y
        } = currItem

        // if y === 0, remove so a bunch of 0's don't show
        if(y === 0) return {x}

        // otherwise leave data unaltered
        return currItem
    })

    const minHeight = 0

    const isData = (filteredData && Array.isArray(filteredData) && filteredData.length > 0)

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
                            data={filteredData ? filteredData : []}
                            isData={isData}
                            date={throughputData.date_title}
                        />
                        :
                        <BarChart
                            data={filteredData ? filteredData : []}
                            enableGridY={isData ? true : false}
                            mainTheme={themeContext}
                            timeSpan={timeSpan}
                            axisBottom={{
                                tickRotation: -90,
                            }}
                            colors={themeContext.charts}
                            axisLeft={{
                                enable: true,
                            }}
                        />

                    }


                    {!throughputData &&
                        <styled.NoDataText>No Data</styled.NoDataText>
                    }
                </styled.PlotContainer>
            }

        </styled.SinglePlotContainer>
    )
}

export default ThroughputChart