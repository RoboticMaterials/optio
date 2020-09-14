import React, { useState } from 'react';

import * as styled from './statistics_charts.style'

import CalendarChart from './statistics_charts_types/calendar_chart'
import LineChart from './statistics_charts_types/line_chart'
import BarChart from './statistics_charts_types/bar_chart'

import * as CalendarData from './statistics_charts_types/calendar_example_data.json'
import * as LineData from './statistics_charts_types/line_example_data.json'
import * as BarData from './statistics_charts_types/bar_example_data.json'

const StatisticsCharts = () => {

    const [showCalendarChart, setShowCalendarChart] = useState(true)
    const [showLineChart, setShowLineChart] = useState(true)
    
    return(
        <styled.ChartContainer>
         
            {showCalendarChart &&
                <CalendarChart
                    data={CalendarData.default}
                />
            }

            {showLineChart &&
                <LineChart
                    data={LineData.default}
                />
            }

            <BarChart
                data={BarData.default}
            />
        </styled.ChartContainer>
    )
}

export default StatisticsCharts