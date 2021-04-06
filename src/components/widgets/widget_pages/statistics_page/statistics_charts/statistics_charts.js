import React, { useState } from 'react';

import * as styled from './statistics_charts.style'



const StatisticsCharts = () => {

    const [showCalendarChart, setShowCalendarChart] = useState(true)
    const [showLineChart, setShowLineChart] = useState(true)
    
    return(
        <styled.ChartContainer>
            
        </styled.ChartContainer>
    )
}

export default StatisticsCharts