import { useState } from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

import { theme, defaultColors } from '../nivo_theme';

const ScatterPlot = (props) => {

    const {
        data,
        showLegend,
        legendToggle,
        showAxes,
        ...rest
    } = props

    const [hiddenData, setHiddenData] = useState({})

    return (
        <ResponsiveScatterPlot
            theme={theme}
            colors={defaultColors.filter((color, i) => i >= data.length || !hiddenData[data[i].id])}
            data={data.filter(dataset => !hiddenData[dataset.id])}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'linear', min: data.reduce((currMin, line) => Math.min(currMin, line.data[0].x), data[0].data[0].x) }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            yFormat=" >-.0f"
            lineWidth={3}
            axisTop={null}
            axisRight={null}
            axisBottom={showAxes ? {
                orient: 'bottom',
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legendOffset: 36,
                legendPosition: 'middle',
                format: rest?.xFormat
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
            // enableSlices="x"
            crosshairType="bottom"
            useMesh={true}
            animate={true}
            legends={showLegend ? [
                {
                    data: data.map((dataset, i) => ({color: defaultColors[i % defaultColors.length], hidden: hiddenData[dataset.id], id: dataset.id, label: dataset.id})),
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
                    onClick: v => {
                        if (!legendToggle) return
                        if (hiddenData[v.id] === true) {
                            setHiddenData({...hiddenData, [v.id]: false})
                        } else {
                            setHiddenData({...hiddenData, [v.id]: true})
                        }
                    },
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
            {...rest}
        />
    )
}

ScatterPlot.defaultProps = {
    data: [],
    showLegend: true,
    legendToggle: false,
    showAxes: true
}

export default ScatterPlot;