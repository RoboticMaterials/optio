import React from 'react';

// Import component
import { ResponsiveBar } from '@nivo/bar'

// Import utils
import { } from '../../../../../../methods/utils/utils'
import PropTypes from "prop-types";
import DashboardButton from "../../../dashboards_page/dashboard_button/dashboard_button";

const theme = {
    background: 'transparent',
    fontFamily: 'sans-serif',
    fontSize: 11,
    textColor: 'white',
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    axis: {
        domain: {
            line: {
                stroke: 'transparent',
                strokeWidth: 1
            }
        },
        ticks: {
            line: {
                stroke: '#777777',
                strokeWidth: 1
            },
            text: {

            }
        },
        legend: {
            text: {
                fontSize: 12,
            }
        }
    },
    grid: {
        line: {
            stroke: '#dddddd',
            strokeWidth: 1
        }
    },
    legends: {
        text: {
            fill: '#333333'
        }
    },
    labels: {
        text: {}
    },
    markers: {
        lineColor: '#000000',
        lineStrokeWidth: 1,
        text: {}
    },
    dots: {
        text: {}
    },
    tooltip: {
        container: {
            background: 'white',
            color: 'inherit',
            fontSize: 'inherit',
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
            padding: '5px 9px'
        },
        basic: {
            whiteSpace: 'pre',
            display: 'flex',
            alignItems: 'center'
        },
        table: {},
        tableCell: {
            padding: '3px 5px'
        }
    },
    crosshair: {
        line: {
            stroke: '#000000',
            strokeWidth: 1,
            strokeOpacity: 0.75,
            strokeDasharray: '6 6'
        }
    },
    annotations: {
        text: {
            fontSize: 13,
            outlineWidth: 2,
            outlineColor: '#ffffff'
        },
        link: {
            stroke: '#000000',
            strokeWidth: 1,
            outlineWidth: 2,
            outlineColor: '#ffffff'
        },
        outline: {
            fill: 'none',
            stroke: '#000000',
            strokeWidth: 2,
            outlineWidth: 2,
            outlineColor: '#ffffff'
        },
        symbol: {
            fill: '#000000',
            outlineWidth: 2,
            outlineColor: '#ffffff'
        }
    }
}


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

    // const theme = {
    //     fontSize: '1rem',
    //     fontFamily: mainTheme.font.primary,
    //
    //     axis: {
    //         textColor: '#eee',
    //         fontSize: '.1rem',
    //         tickColor: '#eee',
    //         legend: {
    //             text: {
    //                 fontSize: '.25rem',
    //                 fontWeight: 'bold',
    //             },
    //         }
    //     },
    //
    // }

    console.log("Barchart data",data)
    if (data === null || data === undefined) { return null }
    return (
        <ResponsiveBar
            data={selector ? data[selector] : data}
            keys={['y']}
            // borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            indexBy='x'
            // indexScale={{ type: 'band', round: true }}
            animate={false}
            colors={{ scheme: 'nivo' }}
            colorBy={"x"}
            // colors={['#d177ed', "#eed312"]}
            // color={['#d177ed', "#eed312"]}
            borderColor={{ from: 'color' }}
            // borderColor='#d177ed'
            // xScale={{ type: 'time', format: '%Y-%m-%d %H:%M:%S', useUTC: false, precision: 'second', }}
            // xFormat={'time:' + format}
            // xFormat="time:%Y-%m-%d"
            // yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            margin={{ top: 20, left: 80, right: 80, bottom: 120 }}
            layout={layout}

            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                // tickPadding: layout === "horizontal" ? 10 : -40,
                // translateY: -25
                legendOffset: 50,
                tickRotation: 0,
                legend: 'Time',
                fontSize: "8rem",
                legendPosition: 'middle',
                // legendOffset: 50,
                ...axisBottom


                // format: (value) => {
                //     console.log('QQQQ val', value.split(' ')[1])
                //     // value.split(' ')[1]
                // },
            }}
            axisLeft={{
                tickSize: 5,
                zIndex: 200,
                // anchor: "right",
                // tickPadding: layout === "horizontal" ? 40 : 4,
                tickRotation: 0,
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