import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './statistics_page.style'

// Import Components
import StatisticsOverview from './statistics_overview/statistics_overview'
import StatisticsCharts from './statistics_charts/statistics_charts'

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


    return (
        <styled.StatisticsContainer>
            <styled.Header>
                <styled.StationName>{stations[stationID].name}</styled.StationName>
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