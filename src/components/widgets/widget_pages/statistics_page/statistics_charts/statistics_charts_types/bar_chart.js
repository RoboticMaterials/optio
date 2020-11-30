import React from 'react';

import { ResponsiveBar } from '@nivo/bar'

const BarChart = (props) => {

    const {
        data,
        selector,
    } = props

    if (data === null) { return null }
    return (
        <ResponsiveBar
            data={data[selector]}
            // curve='monotoneX'
            keys={['y']}
            indexBy='x'
            animate={false}
            // xScale={{ type: 'time', format: '%Y-%m-%d %H:%M:%S', useUTC: false, precision: 'second', }}
            // xFormat={'time:' + format}
            // yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            margin={{ top: 22, left: 70, right: 70, bottom: 30 }}

            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Units',
                legendPosition: 'middle',
                legendOffset: -40
            }}

            // enableGridX={false}
            // enableGridY={false}
            colors={d => d.color}

        />
    )
}

export default BarChart