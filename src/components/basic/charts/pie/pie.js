import { ResponsivePie } from '@nivo/pie'
import ReactTooltip from 'react-tooltip';

import * as styled from './pie.style'

import { theme, defaultColors, tooltipProps } from '../nivo_theme';
import emptyData from './empty';

const Pie = ({ data, label, stat, description }) => {

    if (!data || !data.length) {data = emptyData}
    const colors = data.map((slice, idx) => !!slice.color ? slice.color : defaultColors[idx % defaultColors.length])

    return (

        <div style={{position: 'relative', height: '100%', width: '100%', height: '14rem'}}>
            <ResponsivePie
                data={data}
                theme={theme}
                colors={colors}
                sortByValue={true}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                innerRadius={0.9}
                padAngle={1}
                cornerRadius={7}
                activeOuterRadiusOffset={6}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                enableArcLinkLabels={false}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                enableArcLabels={false}
                arcLabelsRadiusOffset={1.45}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
            />

            <styled.PieHeader>
                <styled.TooltipIcon className="fas fa-info"  data-tip data-for={`${stat}-tooltip`} />
                <ReactTooltip id={`${stat}-tooltip`} {...tooltipProps} place="top">
                    <styled.Tooltip dangerouslySetInnerHTML={{__html:description}}></styled.Tooltip>
                </ReactTooltip>
                <styled.Label>{label}</styled.Label>
            </styled.PieHeader>

            <styled.LegendContainer>
                {data.map((slice, i) => (
                    <styled.LegendItem>
                        <styled.Dot color={colors[i]} />
                        <styled.LegendLabel>{slice.label}</styled.LegendLabel>
                    </styled.LegendItem>
                ))}
            </styled.LegendContainer>
        </div>
    )
}

export default Pie;