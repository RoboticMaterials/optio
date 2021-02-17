import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';

// Import Styles
import * as styled from '../charts.style'
import { ThemeContext } from 'styled-components';

// Import components
import LineThroughputChart from './line_throughput_chart'


// Import Charts
import BarChart from '../../../chart_types/bar_chart'

const testData = [
    {
        "x": "8 am",
        "y": 0
    },
    {
        "x": "9 am",
        "y": 251
    },
    {
        "x": "10 am",
        "y": 83
    },
    {
        "x": "11 am",
        "y": 0
    },
    {
        "x": "12 am",
        "y": 85
    },
    {
        "x": "1 pm",
        "y": 0
    },
    {
        "x": "2 pm ",
        "y": 75
    },
    {
        "x": "3 pm ",
        "y": 73
    },
    {
        "x": "4 pm ",
        "y": 75
    },
    {
        "x": "5 pm",
        "y": 0
    },
    {
        "x": "6 pm",
        "y": 69
    },
    {
        "x": "7 pm",
        "y": 212
    },
    {
        "x": "8 pm",
        "y": 33
    }
]



const ThroughputChart = (props) => {

    const themeContext = useContext(ThemeContext);

    const {
        throughputData,
        isThroughputLoading,
        timeSpan,
    } = props

    const [showBar, setShowBar] = useState(false)

    const filteredData = throughputData?.throughPut

    const minHeight = 0

    const isData = (filteredData && Array.isArray(filteredData) && filteredData.length > 0)

    return (
        <styled.SinglePlotContainer
            minHeight={minHeight}
        >
            <styled.PlotHeader>
                <styled.PlotTitle>Throughput</styled.PlotTitle>
                {/* <styled.ChartButton onClick={() => setShowBar(!showBar)} >Compare Expected output</styled.ChartButton> */}
                <styled.ChartTypeButton
                    style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                    onClick={() => {
                        setShowBar(true)
                    }}
                    selected={showBar}
                >
                    Bar
                </styled.ChartTypeButton>
                <styled.ChartTypeButton
                    style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                    onClick={() => {
                        setShowBar(false)
                    }}
                    selected={!showBar}
                >
                    Line
                </styled.ChartTypeButton>
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
                            data={testData}
                            isData={isData}
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