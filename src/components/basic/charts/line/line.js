import { useState, useMemo } from 'react'
import { ResponsiveLine } from '@nivo/line'

import { theme, defaultColors } from '../nivo_theme';

// https://nivo.rocks/storybook/?path=/story/line--custom-line-style
const DashedSolidLine = ({ series, lineGenerator, xScale, yScale }) => {
    return series.map(({ id, data, color, dashed=false }, index) => (
      <path
        key={id}
        d={lineGenerator(
          data.map((d) => ({
            x: xScale(d.data.x),
            y: yScale(d.data.y)
          }))
        )}
        fill="none"
        stroke={color}
        style={
          dashed === true
            ? {
                // simulate line will dash stroke when index is even
                strokeDasharray: "6, 4",
                strokeWidth: 2
              }
            : {
                // simulate line with solid stroke
                faceColor: 'white',
                background: 'white',
                strokeWidth: 3
              }
        }
      />
    ));
  };

const Line = (props) => {

    const {
        data,
        showLegend,
        showAxes,
        legendToggle,
        ...rest
    } = props

    const [hiddenData, setHiddenData] = useState({})
    const xMin = useMemo(() => data.reduce((currMin, line) => Math.min(currMin, line.data[0].x), data[0]?.data[0]?.x || Number.POSITIVE_INFINITY), [data])

    return (
        <ResponsiveLine
            theme={theme}
            colors={defaultColors.filter((color, i) => i >= data.length || !hiddenData[data[i].id])}
            data={data.filter(dataset => !hiddenData[dataset.id])}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'linear', min:  xMin}}
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
                legendPosition: 'middle',
                scale: 'linear',
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
            enablePoints={true}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            // enableSlices="x"
            // crosshairType="bottom"
            useMesh={true}
            animate={true}
            layers={[
                // includes all default layers
                "grid",
                "markers",
                "axes",
                "areas",
                "crosshair",
                "line",
                "slices",
                DashedSolidLine, // add the custome layer here
                "points",
                "mesh",
                "legends",
              ]}
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

Line.defaultProps = {
    data: [],
    showLegend: true,
    legendToggle: true,
    showAxes: true
}

export default Line;