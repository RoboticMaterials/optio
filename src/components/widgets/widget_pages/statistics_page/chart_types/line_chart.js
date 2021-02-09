import React from 'react';
import { ResponsiveLine, Line } from '@nivo/line'

const LineChart = (props) => {

    const {
        colors,
        selector,
        slice,
        data,
        format,
        theme,
        ToolTipCallback
    } = props

    return (
        <ResponsiveLine
            data={[{
                'id': 'qqwr',
                "color": "hsl(182, 70%, 50%)",
                'data': data
            }]}
            // keys={['y']}
            // indexBy='x'

            // curve='monotoneX'
            animate={false}
            // xScale={{ type: 'time', format: '%Y-%m-%d %H:%M:%S', useUTC: false, precision: 'second', }}
            // xFormat={'time:' + format}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            // axisBottom={null}
            xScale={{ type: 'point' }}
            margin={{ top: 22, left: 70, right: 70, bottom: 30 }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                // format: format,
                tickValues: 6
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickOffset: 10,
                tickValues: 4
            }}
            enableGridX={false}
            enableGridY={false}
            // colors={d => d.color}
            enablePoints={true}
            pointSize={4}
            // pointColor={colors[selector]}
            pointBorderWidth={1}
            pointBorderColor={{ from: 'white' }}
            // pointLabel="y"
            // pointLabelYOffset={-12}

            // crosshairType="x"
            // enableSlices={'x'}
            // sliceTooltip={ToolTipCallback}
            theme={{
                axis: {
                    ticks: {
                        line: {
                            stroke: "fff",
                        },
                        text: {
                            fill: "fff",
                            // fontFamily: 'Montserrat',
                            fontSize: "0.8rem"
                        },
                    }
                },
                grid: {
                    line: {
                        stroke: "",
                    }
                },
                crosshair: {
                    line: {
                        stroke: "#fff",
                        strokeDasharray: "0"
                    }
                }
            }}
        />
    )
}

export default LineChart

// LineChart.defaultProps = {

// }