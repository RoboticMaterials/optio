import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './statistics_page.style'

// Import Components
import StatisticsOverview from './statistics_overview/statistics_overview'
import StatisticsCharts from './statistics_charts/statistics_charts'
import TimePicker from "rc-time-picker";
import Button from '../../../basic/button/button'
// import TimePickerField from '../../../basic/form/time_picker_field/time_picker_field'

// Import Actions
import moduleName from '../../../../redux/actions/'

const StatisticsPage = () => {

    const params = useParams()
    const stationID = params.stationID

    const stations = useSelector(state => state.stationsReducer.stations)

    const [showOverview, setShowOverview] = useState(true)

    useEffect(() => {

        return () => {

        }
    }, [])

    const renderCycleTime = () => {
        return (
            <styled.HeaderSection>
                <styled.HeaderSectionTitle>
                    Cycle Time
                </styled.HeaderSectionTitle>
                <TimePicker
                    showHours={true}
                    showMinutes={true}
                    onChange={(val) => {
                        console.log('QQQQ change', val)
                    }}
                />
                <Button
                    label={'Save'}
                    onClick ={() => {

                    }}
                    schema={'statistics'}
                />

            </styled.HeaderSection>
        )
    }

    return (
        <styled.StatisticsContainer>
            <styled.Header>
                <styled.StationName>{stations[stationID].name}</styled.StationName>
                {renderCycleTime()}
                {/* <styled.StatisticsSectionsButtonContainer>
                    <styled.StatisticsSectionsButton
                        style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                        onClick={() => {
                            setShowOverview(true)
                        }}
                        selected={showOverview}
                    >
                        Overview
                </styled.StatisticsSectionsButton>

                    <styled.StatisticsSectionsButton
                        style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                        onClick={() => {
                            setShowOverview(false)
                        }}
                        selected={!showOverview}

                    >
                        Charts
                </styled.StatisticsSectionsButton>

                </styled.StatisticsSectionsButtonContainer> */}
            </styled.Header>
            {/* <styled.StatisticsDownloadButton>
                Download CSV
            </styled.StatisticsDownloadButton> */}



            {/* <StatisticsOverview/> */}



            {showOverview &&
                <styled.StatisticsSectionsContainer>
                    <StatisticsOverview />
                </styled.StatisticsSectionsContainer>
            }


            {!showOverview &&
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: '5rem', flexDirection: 'column' }}>
                    <StatisticsCharts />
                </div>
            }

        </styled.StatisticsContainer>
    )
}

export default StatisticsPage