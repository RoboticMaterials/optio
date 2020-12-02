import React from 'react';

// Import component
import { ResponsiveBar } from '@nivo/bar'

// Import utils
import { } from '../../../../../../methods/utils/utils'

const BarChart = (props) => {

    const {
        data,
        selector,
        mainTheme,
        timeSpan,
    } = props

    const theme = {
        fontSize: '1rem',
        fontFamily: mainTheme.font.primary,

        // axis: {
        //     ticks: {
        //         text: {
        //             fill: "fff",
        //             fontFamily: mainTheme.font.primary,
        //             fontSize: "1rem"
        //         },
        //     }
        // },

    }

    console.log('QQQQ Data', data)
    if (data === null || data === undefined) { return null }
    return (
        <ResponsiveBar
            data={data[selector]}
            keys={['y']}
            indexBy='x'
            animate={false}
            colors={{scheme:'nivo'}}
            borderColor={{ from: 'color' }}
            // xScale={{ type: 'time', format: '%Y-%m-%d %H:%M:%S', useUTC: false, precision: 'second', }}
            // xFormat={'time:' + format}
            // yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            margin={{ top: 22, left: 70, right: 70, bottom: 50 }}

            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time',
                legendPosition: 'middle',
                legendOffset: 32,
                

                // format: (value) => {
                //     console.log('QQQQ val', value.split(' ')[1])
                //     // value.split(' ')[1]
                // },
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
            theme={theme}

        />
    )
}

export default BarChart