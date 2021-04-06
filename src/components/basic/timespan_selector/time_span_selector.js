import React from 'react';

import * as styled from './time_span_selector.style'

const TimeSpanSelector = (props) => {

    const {
        timeSpan,
        setTimeSpan,
        timespanDisabled,
    } = props

    return (
        <styled.Container>
            {/* <styled.TimespanButton selected={timeSpan == 'live'} onClick={() => setTimeSpan('live')}>Live</styled.TimespanButton> */}
            <styled.TimespanButton disabled={timespanDisabled} selected={(timeSpan === 'day' || timeSpan === 'line')} onClick={() => setTimeSpan('day')}>Day</styled.TimespanButton>
            <styled.TimespanButton disabled={timespanDisabled} selected={timeSpan === 'week'} onClick={() => setTimeSpan('week')}>Week</styled.TimespanButton>
            <styled.TimespanButton disabled={timespanDisabled} selected={timeSpan === 'month'} onClick={() => setTimeSpan('month')}>6 Weeks</styled.TimespanButton>
            <styled.TimespanButton disabled={timespanDisabled} selected={timeSpan === 'year'} onClick={() => setTimeSpan('year')}>Year</styled.TimespanButton>
            {/* <styled.TimespanButton schema={schema} selected={timeSpan == 'all'} onClick={() => setTimeSpan('all')}>ALL</styled.TimespanButton> */}
        </styled.Container>
    )
}

export default TimeSpanSelector