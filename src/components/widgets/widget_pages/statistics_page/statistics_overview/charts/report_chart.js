import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';

// Import Styles
import * as styled from './charts.style'

import { ThemeContext } from 'styled-components';


// Import Charts
import BarChart from '../../chart_types/bar_chart'

const ReportChart = (props) => {

    const themeContext = useContext(ThemeContext);

    const {
        reportButtons,
        reportData,
        isThroughputLoading,
        timeSpan,
        throughputData,
    } = props

    // get array of report buttons for current station
    const reportButtonsArr = Object.values(reportButtons)

    // get just the names of the buttons as an array
    const reportButtonNames = (reportButtonsArr && Array.isArray(reportButtonsArr)) ? reportButtonsArr.map((currButton) => currButton.label) : []

    // data comes from back end with the key of the button as the key and the value as the count, but we want the name of the button
    // therefore, must map through each item and replace the button's id with its name
    const filteredData = (reportData && reportData.reports && Array.isArray(reportData.reports)) ?
        reportData.reports.map((currReport) => {

            const {
                lable, // extract label
                ...currReportEntries // this contains the button keys followed by their count as the value
            } = currReport

            // create object for storing new key value paies (buttonName: count)
            var updatedReport = {
                lable
            }

            const currReportButtonIds = Object.keys(currReportEntries)

            currReportButtonIds.forEach((currButtonId) => {

                // if there is a button with the corresponding id
                if (reportButtons[currButtonId]) {
                    // get the label from the actual button, and get the count from the entry, then add it to the updated report
                    updatedReport[reportButtons[currButtonId].label] = currReportEntries[currButtonId] ? currReportEntries[currButtonId] : 0
                }
            })

            return updatedReport
        })
        :
        []

    // set min height based on number of entries so chart won't squeeze rows too close together
    const minHeight = (filteredData && Array.isArray(filteredData)) ? filteredData.length * 2 : 0

    return (
        <styled.SinglePlotContainer
            minHeight={minHeight}
            // Margin bottom is used to be able to scroll to the bottom and see the report graph
            style={{ marginBottom: '7rem' }}
        >
            <styled.PlotHeader>
                <styled.PlotTitle>Reports</styled.PlotTitle>
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
                        keys={reportButtonNames}
                        indexBy={'lable'}
                        colorBy={"id"}
                        mainTheme={themeContext}
                        timeSpan={timeSpan}
                        layout={true ? "horizontal" : "vertical"}
                        enableGridX={true ? true : false}
                        enableGridY={!true ? true : false}
                        axisBottom={{
                            legend: 'Count',
                        }}
                        axisLeft={{
                            legend: 'Time'
                        }}
                    />

                    {!reportData &&
                        <styled.NoDataText>No Data</styled.NoDataText>
                    }
                </styled.PlotContainer>
            }

        </styled.SinglePlotContainer>
    )
}

export default ReportChart