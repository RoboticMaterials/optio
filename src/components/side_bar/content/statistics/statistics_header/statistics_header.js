import React, { useState, } from 'react';

// Import Styles
import * as styled from './statistics_header.style'

// Import basic components
import SortDropdown from '../../../../basic/sort_dropdown/sort_dropdown'

// Import Components
import LineThroughputForm from '../../../../widgets/widget_pages/statistics_page/statistics_overview/charts/throughput_chart/line_throughput_chart/line_throughput_form'
import DaySelector from '../../../../basic/day_selector/day_selector'
import TimeSpaneSelector from '../../../../basic/timespan_selector/time_span_selector'

const StatisticsHeader = (props) => {

    const {
        themeContext,
        loading,
        handleTimeSpan,
        timeSpan,
        handleSetShowReport,
        showReport,
        date,
        dateIndex,
        handleSelectSort
    } = props || {}

    const dropDownOptions = [
        { label: 'Object' },
        { label: 'Lot' },
        { label: 'Process' }

    ]

    const [showShiftSettings, setShowShiftSettings] = useState(false)

    const renderShiftSettings = () => {
        return (
            <styled.ShiftSettingsContainer>
                <LineThroughputForm themeContext={themeContext} />
            </styled.ShiftSettingsContainer>
        )
    }

    return (
        <styled.HeaderBar>
            <styled.HeaderSection>
                <TimeSpaneSelector
                    // timespanDisabled={timespanDisabled}
                    setTimeSpan={(timeSpan) => handleTimeSpan(timeSpan, 0)}
                    timeSpan={timeSpan}
                    timespanDisabled={timeSpan === 'line'}
                />
                <DaySelector
                    date={date}
                    dateIndex={dateIndex}
                    loading={loading}
                    onChange={(newIndex) => {
                        handleTimeSpan(timeSpan, newIndex)
                    }}
                />
            </styled.HeaderSection>

            <styled.HeaderSection>
                <styled.HeaderLabel>Chart Type</styled.HeaderLabel>
                <styled.RowContainer>
                    <styled.ChartTypeButton
                        selected={!showReport && timeSpan !== 'line'}
                        onClick={() => {
                            handleSetShowReport(false)
                            handleTimeSpan(timeSpan === 'line' ? 'day' : timeSpan, dateIndex)
                        }}
                    >
                        Bar
                </styled.ChartTypeButton>

                    <styled.ChartTypeButton
                        selected={!showReport && timeSpan === 'line'}
                        onClick={() => {
                            handleSetShowReport(false)
                            handleTimeSpan('line', dateIndex)
                        }}
                    >
                        Line
                </styled.ChartTypeButton>

                    <styled.ChartTypeButton
                        selected={!!showReport && timeSpan !== 'line'}
                        onClick={() => {
                            handleSetShowReport(true)
                            handleTimeSpan(timeSpan === 'line' ? 'day' : timeSpan, dateIndex)
                        }}
                    >
                        Reports
                </styled.ChartTypeButton>
                </styled.RowContainer>
            </styled.HeaderSection>

            <styled.HeaderSection style={{ position: 'relative' }}>
                <styled.RowContainer style={{ alignItems: 'center' }} onClick={() => setShowShiftSettings(!showShiftSettings)}>
                    <styled.HeaderLabel>Shift Settings</styled.HeaderLabel>
                    <i style={{ marginLeft: '.5rem' }} className={showShiftSettings ? 'fas fa-chevron-up' : 'fas fa-chevron-down'} />
                </styled.RowContainer>
                {showShiftSettings && renderShiftSettings()}
            </styled.HeaderSection>

            <styled.HeaderSection>
                <SortDropdown
                    options={dropDownOptions}
                    labelField={'label'}
                    valueField={'label'}
                    dropDownSearchStyle={{minWidth:'10rem'}}
                    onChange={(val) => {
                        handleSelectSort(val.label)
                    }}
                />
            </styled.HeaderSection>

        </styled.HeaderBar>
    )
}

export default StatisticsHeader