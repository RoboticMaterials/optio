import { useRef, useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import { svg, behavior, select, event } from 'd3'


import { theme, defaultColors } from '../nivo_theme';
import { secondsToReadable } from '../../../../methods/utils/time_utils';
import { putLotTemplate, setLotTemplateAttributes } from '../../../../redux/actions/lot_template_actions';
import * as styled from './balanace_bar.styled';

import Button from '../../../basic/button/button';

const bubbleHeight = 20;
const activeClassName = 'active-d3-item';

const bubblePath = (x, y) => {
    const h = bubbleHeight;
    const w = bubbleHeight * 5;

    x -= w;
    y += h/2;

    return `M ${x} ${y} C ${x+w/4} ${y} ${x+w/4} ${y-h/2} ${x+w*3/8} ${y-h/2} L ${x+w} ${y-h/2} A ${h/2} ${h/2} 0 1 1 ${x+w} ${h} L ${x+w*3/8} ${y+h/2} C ${x+w/4} ${y+h/2} ${x+w/4} ${y} ${x} ${y}`
}

const Bar = ({ productGroupId, data, renderDropdown }) => {

    const maxBarValue = useMemo(() => Math.max(...data.map(bar => bar['Cycle Time'])), [data])

    const dispatch = useDispatch()
    const dispatchPutProductGroup = (lotTemplate) => dispatch(putLotTemplate(lotTemplate, lotTemplate._id))

    const productGroup = useSelector(state => state.lotTemplatesReducer.lotTemplates)[productGroupId]
    
    const chartContainerRef = useRef(null)
    const reverseScaleY = useRef(() => 0)
    const [barContainerWidth, setBarContainerWidth] = useState(1)
    const [chartHeight, setChartHeight] = useState(0)
    const [takt, setTakt] = useState(productGroup?.taktTime || maxBarValue)
    

    useEffect(() => {
        const { width } = chartContainerRef.current.getBoundingClientRect();
        setBarContainerWidth((width - 120) / data.length)
    }, [chartContainerRef])

    useEffect(() => {
        setTakt(productGroup?.taktTime || maxBarValue)
    }, [productGroup])

    const padding = useMemo(() => {
        return (1 - (50/barContainerWidth))
    }, [barContainerWidth])

    const borderRadius = useMemo(() => {
        const barWidth = barContainerWidth * (50/barContainerWidth)
        return barWidth / 2 - 4;
    }, [barContainerWidth])

    const TaktLayer = useMemo(() => ({ bars, yScale, innerWidth, innerHeight }) => {

        reverseScaleY.current = (px) => maxBarValue * (innerHeight - px) / innerHeight
        setChartHeight(innerHeight)

        
        return (
            <>
                <svg className="bottleneck-line-group" style={{pointer: "ns-resize !important"}} x={0} y={yScale(maxBarValue) - bubbleHeight/2}>
                    <line className="bottleneck-line" x1={0} y1={bubbleHeight/2} x2={innerWidth} y2={bubbleHeight/2} stroke="#ff8a8a" strokeWidth={2} strokeDasharray="4 2" />
                    <path d={bubblePath(innerWidth, 0)} stroke="#ff8a8a" fill="#ff8a8a" />
                    <text x={innerWidth - bubbleHeight*5 + bubbleHeight*5/3} y={bubbleHeight/2 + 5}>Bottleneck</text>
                </svg>

                <svg className="takt-line-group" style={{pointer: "ns-resize !important"}} x={0} y={yScale(productGroup?.taktTime || maxBarValue) - bubbleHeight/2}>
                    <defs>
                        <style>{`.takt-line-group { cursor: ns-resize; } text{fill: white; font-size: 0.75rem; font-weight: 600;}`}</style>
                    </defs>
                    <line className="takt-line" x1={0} y1={bubbleHeight/2} x2={innerWidth} y2={bubbleHeight/2} stroke="#8aa9ff" strokeWidth={2} strokeDasharray="4 2" />
                    <path d={bubblePath(innerWidth, 0)} stroke="#8aa9ff" fill="#8aa9ff"/>
                    <text x={innerWidth - bubbleHeight*5 + bubbleHeight*5/3 + 20} y={bubbleHeight/2 + 5}>Takt</text>
                </svg>
            </>
        )
    }, [chartContainerRef.current, productGroup, data])

    useEffect(() => {
        select('.takt-line-group').call(
            behavior.drag()
                // .origin(function(d) { return d; })
                .on('dragstart', dragstarted)
                .on('drag', dragged)
                .on('dragend', dragended)
        )
    })

    function dragstarted() {
        select(this).classed(activeClassName, true);
    }
    
    function dragged() {
        var taktGroup = select(this);

        const taktPx = Math.max(0, Math.min(parseInt(taktGroup.attr('y')), chartHeight))
        taktGroup.attr({
            y: parseInt(taktPx + event.dy)
        })

        setTakt(Math.ceil(reverseScaleY.current(taktPx + event.dy)/5)*5)
    }
    
    function dragended() {
        var taktGroup = select(this)
        taktGroup.classed(activeClassName, false);
    }

    return (
        <div ref={chartContainerRef} style={{width: '100%', height: '100%', paddingTop: '1rem'}}>
            <styled.Row style={{height: '6rem', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <styled.Col style={{marginLeft: '1rem'}}>
                    <styled.Label style={{textAlign: 'left', width: '100%'}}>Product Group</styled.Label>
                    {renderDropdown}
                </styled.Col>
                <styled.Row>
                    <styled.Col>
                        <styled.Label>Desired Production Rate</styled.Label>
                        <styled.Value style={{color: "#8aa9ff"}}>{secondsToReadable(takt, true)}</styled.Value>
                    </styled.Col>
                    <styled.Col>
                        <styled.Label>Bottleneck Production Rate</styled.Label>
                        <styled.Value style={{color: "#ff8a8a"}}>{secondsToReadable(maxBarValue, true)}</styled.Value>
                    </styled.Col>
                </styled.Row>
                <styled.Col>
                    <Button
                        style={{height: '3rem'}}
                        onClick={() => {
                            dispatchPutProductGroup({...productGroup, taktTime: takt})
                        }}
                        label={'Save Takt Time'}
                        type="button"
                        disabled={takt === productGroup?.taktTime}
                    />
                </styled.Col>
            </styled.Row>
            
            <div style={{height: '20rem'}}>
                <ResponsiveBar
                    theme={theme}
                    colors={[defaultColors[0]]}
                    data={data}
                    keys={['Cycle Time']}
                    indexBy="Station"
                    margin={{ top: 50, right: 60, bottom: 50, left: 90 }}
                    padding={padding}
                    enableLabel={false}
                    valueFormat={d => secondsToReadable(d)}
                    borderRadius={borderRadius}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                    axisTop={null}
                    maxValue={Math.max(maxBarValue, productGroup?.taktTime || 0)}
                    axisRight={null}
                    groupMode="grouped"
                    // axisBottom={{
                    //     tickSize: 0,
                    //     tickPadding: 5,
                    //     tickRotation: 0,
                    //     legend: '',
                    //     legendPosition: 'middle',
                    //     legendOffset: 32
                    // }}
                    axisBottom={null}
                    axisLeft={{
                        tickSize: 0,
                        tickPadding: 5,
                        tickRotation: 0,
                        tickValues: 5,
                        legend: 'Cycle Time',
                        legendPosition: 'middle',
                        legendOffset: -80,
                        format: d => secondsToReadable(d, true)
                    }}
                    layers={[
                        "axes",
                        "bars",
                        TaktLayer,
                    ]}
                    enableGridY={false}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                    legends={[]}
                    animate={false}
                />
        </div>
    </div>
    )
}

Bar.defaultProps = {
    keys: [],
    colors: defaultColors

}

export default Bar;