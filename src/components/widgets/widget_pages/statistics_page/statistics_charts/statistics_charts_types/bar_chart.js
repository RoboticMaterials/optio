import React from 'react';

// Import component
import { ResponsiveBar } from '@nivo/bar'

// Import utils
import { } from '../../../../../../methods/utils/utils'
import PropTypes from "prop-types";
import DashboardButton from "../../../dashboards_page/dashboard_button/dashboard_button";

const BarChart = (props) => {

    const {
        data,
        selector,
        mainTheme,
        timeSpan,
        axisBottom,
        axisLeft,
        horizontal,
        layout,
        enableGridX,
        enableGridY,
        ...rest
    } = props

    const theme = {
        fontSize: '1rem',
        fontFamily: mainTheme.font.primary,

        axis: {
            legend: {
                text: {
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                },
            }
        },

    }

    if (data === null || data === undefined) { return null }
    return (
        <ResponsiveBar
            data={selector ? data[selector] : data}
            keys={['y']}
            // borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            indexBy='x'
            animate={false}
            // colors={{scheme:'nivo'}}
            colors={['#d177ed', "#eed312"]}
            // color={['#d177ed', "#eed312"]}
            borderColor={{ from: 'color' }}
            // borderColor='#d177ed'
            // xScale={{ type: 'time', format: '%Y-%m-%d %H:%M:%S', useUTC: false, precision: 'second', }}
            // xFormat={'time:' + format}
            // yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            margin={{ top: 20, left: 80, right: 80, bottom: 120 }}
            layout={layout}

            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time',
                legendPosition: 'middle',
                legendOffset: 50,
                ...axisBottom


                // format: (value) => {
                //     console.log('QQQQ val', value.split(' ')[1])
                //     // value.split(' ')[1]
                // },
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Units',
                legendPosition: 'middle',
                legendOffset: -70,
                ...axisLeft
            }}

            // enableGridX={false}
            // enableGridY={false}
            theme={theme}
            enableGridY={enableGridY}
            enableGridX={enableGridX}
            {...rest}
        // legends={[{
        //     fontSize: '1rem'
        // }]}

        />
    )
}

// Specifies propTypes
BarChart.propTypes = {
};

// Specifies the default values for props:
BarChart.defaultProps = {
    layout: "vertical",
    enableGridX: false,
    enableGridY: false,
};

export default BarChart