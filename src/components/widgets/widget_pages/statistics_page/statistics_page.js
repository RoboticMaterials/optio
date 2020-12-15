import React, { useState, useEffect } from 'react';

import * as styled from './statistics_page.style'

// Import Components
import StatisticsOverview from './statistics_overview/statistics_overview'
import StatisticsCharts from './statistics_charts/statistics_charts'

// Import Actions
import moduleName from '../../../../redux/actions/'

const StatisticsPage = () => {

    useEffect(() => {
        
        return () => {
            
        }
    }, [])

    return (
        <styled.StatisticsContainer>

            {/* <styled.StatisticsDownloadButton>
                Download CSV
            </styled.StatisticsDownloadButton> */}

            {/* <styled.StatisticsSectionsContainer>
                <styled.StatisticsSectionsButton 
                    style={{borderRadius:'.5rem 0rem 0rem .5rem'}} 
                    onClick={() => {
                        setShowCharts(false)
                        setShowOverview(true)
                    }}
                    selected={showOverview}
                >
                    Overview
                </styled.StatisticsSectionsButton>
                
                <styled.StatisticsSectionsButton 
                    style={{borderRadius:'0rem .5rem .5rem 0rem'}}
                    onClick={() => {
                        setShowCharts(true)
                        setShowOverview(false)
                    }}
                    selected={showCharts}

                >
                    Charts
                </styled.StatisticsSectionsButton>

            </styled.StatisticsSectionsContainer> */}

            <StatisticsOverview/>
            
            {/* 

            {showOverview &&
                <div style={{display:'flex', width:'100%', justifyContent:'center', alignItems:'center', marginTop:'5rem', flexDirection:'column'}}>
                    <StatisticsOverview/>
                </div>
            }


            {showCharts &&
                <div style={{display:'flex', width:'100%', justifyContent:'center', alignItems:'center', marginTop:'5rem', flexDirection:'column'}}>
                    <StatisticsCharts/>
                </div>
            } */}

        </styled.StatisticsContainer>
    )
}

export default StatisticsPage