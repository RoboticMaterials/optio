import { ResponsiveRadialBar } from '@nivo/radial-bar'

import * as styled from './radial_bar.style';

import { theme, defaultColors } from '../nivo_theme';

const RadialBar = (props) => {

    const {
        data,
        height,
        icon,
        centerLabel,
        centerValue,
        ...rest
    } = props;


    const colorMap = {}
    data.forEach((bar, i) => colorMap[bar.id] = defaultColors[i % defaultColors.length])
    const getColor = bar => colorMap[bar.groupId]
    
    return (
        <>
            
            <ResponsiveRadialBar
                theme={theme}
                colors={getColor}
                data={data}
                maxValue={Math.max(100, ...data.map(bar => bar.data[0].y))}
                valueFormat={v => `${Math.round(v)}%`}
                startAngle={-120}
                endAngle={120}
                innerRadius={0.6}
                padding={0.35}
                cornerRadius={45}
                enableRadialGrid={false}
                enableCircularGrid={false}
                radialAxisStart={null}
                circularAxisOuter={null}
                legends={[]}
                margin={{ bottom: -40 }}
                {...rest}
            />

            <styled.CenterContainer>
                <styled.CenterIcon className={icon} />
                <styled.CenterLabel>{centerLabel}</styled.CenterLabel>
                <styled.CenterValue>{Math.round(centerValue*10)/10}%</styled.CenterValue>
            </styled.CenterContainer>

        </>
    )
}

RadialBar.defaultProps = {
    height: '10rem'
}

export default RadialBar;