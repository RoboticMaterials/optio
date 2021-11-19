import { ResponsiveBar } from '@nivo/bar'

import { theme, defaultColors } from '../nivo_theme';

const Bar = ({ data, keys, colors }) => {

    return (
        <ResponsiveBar
            theme={theme}
            colors={colors}
            data={data}
            keys={keys}
            indexBy="x"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.5}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            axisTop={null}
            axisRight={null}
            groupMode="grouped"
            borderRadius={200/(data.length*Object.keys(colors).length)}
            axisBottom={{
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'country',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                tickValues: 5,
                legend: 'food',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            enableGridY={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            legends={[]}
        />
    )
}

Bar.defaultProps = {
    keys: [],
    colors: defaultColors

}

export default Bar;