import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';

// Import Styles
import * as styled from './charts.style'
import { ThemeContext } from 'styled-components';


// Import Charts
import BarChart from '../../chart_types/bar_chart'


const ThroughputChart = (props) => {

    const themeContext = useContext(ThemeContext);

    const {
        throughputData,
        isThroughputLoading,
        timeSpan,
    } = props

    const filteredData = throughputData?.throughPut

    const minHeight = 0

    const isData = (filteredData && Array.isArray(filteredData) && filteredData.length > 0)

    return (
        <styled.SinglePlotContainer
            minHeight={minHeight}
        >
            <styled.PlotHeader>
                <styled.PlotTitle>Throughput</styled.PlotTitle>
            </styled.PlotHeader>


            {isThroughputLoading ?
                <styled.PlotContainer>
                    <styled.LoadingIcon className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem', marginTop: '5rem' }} />
                </styled.PlotContainer>
                :

                <styled.PlotContainer
                    minHeight={minHeight}
                >
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

                    {!throughputData &&
                        <styled.NoDataText>No Data</styled.NoDataText>
                    }
                </styled.PlotContainer>
            }

        </styled.SinglePlotContainer>
    )
}

export default ThroughputChart