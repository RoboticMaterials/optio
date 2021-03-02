import React from 'react';

import * as styled from './timespans.style'

const TimeSpans = (props) => {

    const {
        timeSpan,
        setTimeSpan,
        color,
        timespanDisabled,
    } = props

    return (
        <styled.Container>
            {/* <styled.TimespanButton color={color} selected={timeSpan == 'live'} onClick={() => setTimeSpan('live')}>Live</styled.TimespanButton> */}
            <styled.TimespanButton color={color} disabled={timespanDisabled} selected={timeSpan == 'day'} onClick={() => setTimeSpan('day')}>Day</styled.TimespanButton>
            <styled.TimespanButton color={color} disabled={timespanDisabled} selected={timeSpan == 'week'} onClick={() => setTimeSpan('week')}>Week</styled.TimespanButton>
            <styled.TimespanButton color={color} disabled={timespanDisabled} selected={timeSpan == 'month'} onClick={() => setTimeSpan('month')}>6 weeks</styled.TimespanButton>
            <styled.TimespanButton color={color} disabled={timespanDisabled} selected={timeSpan == 'year'} onClick={() => setTimeSpan('year')}>Year</styled.TimespanButton>
            {/* <styled.TimespanButton color={color} selected={timeSpan == 'all'} onClick={() => setTimeSpan('all')}>ALL</styled.TimespanButton> */}
        </styled.Container>
    )
}

export default TimeSpans