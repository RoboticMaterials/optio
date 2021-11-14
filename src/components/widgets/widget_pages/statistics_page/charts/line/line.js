
import { ResponsiveLine } from '@nivo/line'

import { theme, defaultColors } from '../nivo_theme';

const Line = (props) => {

    const {
        data,
        height,
        showLegend,
        showAxes
    } = props

    return (
        <ResponsiveLine
            theme={theme}
            colors={defaultColors}
            data={data}

            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            yFormat=" >-.0f"
            curve="monotoneX"
            lineWidth={3}
            axisTop={null}
            axisRight={null}
            axisBottom={showAxes ? {
                orient: 'bottom',
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legendOffset: 36,
                legendPosition: 'middle'
            } : null}
            axisLeft={showAxes ? {
                orient: 'left',
                tickSize: 0,
                tickValues: 5,
                tickPadding: 10,
                tickRotation: 0,
                legend: 'Count',
                legendOffset: -40,
                legendPosition: 'middle'
            } : null}
            enableGridX={false}
            enableGridY={false}
            enablePoints={false}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            enableSlices="x"
            crosshairType="bottom"
            useMesh={true}
            animate={true}
            legends={showLegend ? [
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ] : []}
        />
    )
}

Line.defaultProps = {
    data: [],
    showLegend: true,
    showAxes: true
}

export default Line;