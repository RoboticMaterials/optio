import React, { useContext } from 'react';

// Import component
import { ResponsiveBar } from '@nivo/bar'
import { linearGradientDef } from '@nivo/core'

// Import utils
import { ThemeContext } from "styled-components";

const BarChart = (props) => {

    const {
        data,
        colors,
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

    const themeContext = useContext(ThemeContext);

    const theme = {
        background: 'transparent',
        fontFamily: 'sans-serif',
        fontSize: 14,
        textColor: themeContext.bg.senary,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        axis: {
            domain: {
                line: {
                    stroke: themeContext.bg.quinary,
                    strokeWidth: 2
                }
            },
            ticks: {
                line: {
                    stroke: themeContext.bg.senary,
                    strokeWidth: 1
                },
                text: {

                }
            },
            legend: {
                text: {
                    fontSize: 14,
                }
            }
        },
        grid: {
            line: {
                stroke: themeContext.bg.tertiary,
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
        // tooltip: {
        //     container: {
        //         background: 'white',
        //         color: 'inherit',
        //         fontSize: 'inherit',
        //         borderRadius: '2px',
        //         boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
        //         padding: '5px 9px'
        //     },
        //     basic: {
        //         whiteSpace: 'pre',
        //         display: 'flex',
        //         alignItems: 'center'
        //     },
        //     table: {},
        //     tableCell: {
        //         padding: '3px 5px'
        //     }
        // },
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


    // if (data === null || data === undefined) { return null }
    return (
        <ResponsiveBar
            data={selector ? data[selector] : data}
            keys={['y']}
            // borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            indexBy='x'
            // indexScale={{ type: 'band', round: true }}
            animate={true}
            // colors={{ scheme: 'nivo' }}
            colors={colors}
            borderColor={{ from: 'color' }}
            // borderColor='#d177ed'
            // xScale={{ type: 'time', format: '%Y-%m-%d %H:%M:%S', useUTC: false, precision: 'second', }}
            // xFormat={'time:' + format}
            // xFormat="time:%Y-%m-%d"
            // yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            margin={{ top: 20, left: 80, right: 80, bottom: 75 }}
            // padding={{ top: 5, left: 5, right: 5, bottom: 5 }}
            layout={layout}
            labelTextColor={themeContext.bg.primary}

            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                // tickPadding: layout === "horizontal" ? 10 : -40,
                // translateY: -25
                legendOffset: 60,
                tickRotation: 45,
                legend: '',
                fontSize: "8rem",
                legendPosition: 'middle',
                // legendOffset: 50,
                ...axisBottom
            }}
            axisLeft={{
                tickSize: 5,
                zIndex: 200,
                tickValues: 5,
                // anchor: "right",
                // tickPadding: layout === "horizontal" ? 40 : 4,
                tickRotation: 0,
                legend: 'Units',
                legendPosition: 'middle',
                legendOffset: -50,
                ...axisLeft
            }}

            // defs={[
            //     // using helpers
            //     // will inherit colors from current element
            //     linearGradientDef('gradientA', [
            //         { offset: 0, color: 'inherit' },
            //         { offset: 100, color: 'inherit', opacity: 0 },
            //     ]),
            //     linearGradientDef('gradientB', [
            //         { offset: 0, color: '#000' },
            //         { offset: 100, color: 'inherit' },
            //     ]),
            // ]}

            // fill={[
            //     // match using object query
            //     { match: y => y < 10, id: 'gradientA' },
            //     // match using function
            //     { match: y => y >=, id: 'gradientB' }
            // ]}

            theme={theme}
            enableGridY={enableGridY}
            enableGridX={enableGridX}
            gridYValues={5}
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