import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import moment from 'moment'
import { InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap'

import * as styled from './station_statistics.style'

// Components
import ScaleLoader from 'react-spinners/ScaleLoader'
import DropDownSearch from '../../../basic/drop_down_search_v2/drop_down_search';
import Calendar from '../../../basic/calendar/calendar';

// Charts
import RadialBar from '../../../basic/charts/radial_bar/radial_bar';
import Line from '../../../basic/charts/line/line';
import Bar from '../../../basic/charts/bar/bar';
import Pie from '../../../basic/charts/pie/pie';
import Scale from '../../../basic/charts/scale/scale';

import { getStationStatistics } from '../../../../api/stations_api';
import Checkbox from '../../../basic/checkbox/checkbox';
import Button from '../../../basic/button/button';
import { defaultColors, tooltipProps } from '../../../basic/charts/nivo_theme';
import Switch from 'react-ios-switch';

import { deepCopy } from '../../../../methods/utils/utils';
import Popup from 'reactjs-popup';
import { capitalizeFirstLetter } from '../../../../methods/utils/string_utils';
import { convertHHMMSSStringToSeconds, convertSecondsToHHMMSS, secondsToReadable } from '../../../../methods/utils/time_utils';
import ReactTooltip from 'react-tooltip';

import descriptions from './descriptions'
import TimePicker from 'rc-time-picker';
import Portal from '../../../../higher_order_components/portal';
import { putStation } from '../../../../redux/actions/stations_actions';
import { getLotTemplates } from '../../../../redux/actions/lot_template_actions';

const emptyData = {
    partials: {}, 
    total_quantity: 0,
    cycle_time: {},
    throughput: [],
    wip: [],
    product_group_pie: [],
    process_pie: [],
    out_station_pie: [],
    machine_utilization: {id: '', working: 0, idle: 0},
    value_creating_time: {id: '', working: 0, idle: 0},
    reports: [],
    reports_pie: [],
}

const formatTimeString = (UTCSeconds) => {
    var m = new Date(UTCSeconds)
    return m.getHours() + ":" + m.getMinutes().toString().padStart(2, '0')
}

const convertProductionRateToCycleTime = (quantity, timescale, dailyWorkingSeconds) => {
    switch (timescale) {
        case 'minute':
            return 60 / quantity;
        case 'hour':
            return 3600 / quantity;
        case 'day':
            return dailyWorkingSeconds / quantity
        case 'week':
            return 5 * dailyWorkingSeconds / quantity
        case 'month':
            return 20 * dailyWorkingSeconds / quantity
        case 'year':
            return 5 * 52 * dailyWorkingSeconds / quantity
    }
}

const convertCycleTimeToProductionRate = (cycleTime, dailyWorkingSeconds) => {
    if (cycleTime > 20 * dailyWorkingSeconds) {
        return {quantity: Math.round((5 * 52 * dailyWorkingSeconds) / cycleTime), timescale: 'year'}
    } else if (cycleTime > 5 * dailyWorkingSeconds) {
        return {quantity: Math.round((20 * dailyWorkingSeconds) / cycleTime), timescale: 'month'}
    } else if (cycleTime > dailyWorkingSeconds) {
        return {quantity: Math.round((5 * dailyWorkingSeconds) / cycleTime), timescale: 'week'}
    } else if (cycleTime > 3600) {
        return {quantity: Math.round(dailyWorkingSeconds / cycleTime), timescale: 'day'}
    } else if (cycleTime > 60) {
        return {quantity: Math.round(3600 / cycleTime), timescale: 'hour'}
    } else {
        return {quantity: Math.round(60 / cycleTime), timescale: 'minute'}
    }
}

const ProdTick = (props) => {

    const {
        numBars,
        label,
        CTObj,
        processTaktTime,
        onSave,
        dailyWorkingSeconds,
    } = props;

    const tooltipRef = useRef(null)

    const [mode, setMode] = useState(CTObj.mode)
    const [quantity, setQuantity] = useState(0);
    const [timescale, setTimescale] = useState('hour')

    useEffect(() => {
        let compareSeconds = 0;
        let newMode = CTObj.mode || 'auto'
        switch (CTObj.mode) {
            case "takt":
                compareSeconds = processTaktTime;                
            case "manual":
                compareSeconds = CTObj.manual;
            default:
                compareSeconds = CTObj.historical;
        }

        const { quantity: newQuantity, timescale: newTimescale } = convertCycleTimeToProductionRate(compareSeconds, dailyWorkingSeconds);

        setMode(CTObj.mode)
        setQuantity(newQuantity);
        setTimescale(newTimescale);
    }, [CTObj])
    

    return (
        <g transform={`rotate(${props.rotation}) translate(${props.textX}, ${props.y}) scale(${Math.exp(-0.15*(numBars-1))})`}>
            <foreignObject x={`${numBars-14}`} y="-12" width="22" height="22" >
                <i className="fas fa-cog" style={{color: '#c0c0cc', cursor: 'pointer', fontSize: `1.2rem`, background:'white', padding: '2px'}} data-event='click' data-tip data-for={`${label}-prod-timepicker`} />
                <Portal>
                    
                    <ReactTooltip ref={tooltipRef} id={`${label}-prod-timepicker`} {...tooltipProps} place="left" clickable={true}>
                        <styled.TimePickerTooltip>
                            <i style={{color: 'grey', cursor: 'pointer', position: 'absolute', top: '0.5rem', right: '0.5rem'}} className='fas fa-times' onClick={() => {tooltipRef.current.tooltipRef = null; tooltipRef.current.hideTooltip()}}/>
                            <styled.TooltipIcon className="fas fa-info" onMouseEnter={() => ReactTooltip.rebuild()} data-tip data-for={`prod-tooltip-${label}`} style={{position: 'absolute', top: '0.5rem', left: '0.5rem'}}/>
                            <ReactTooltip id={`prod-tooltip-${label}`} {...tooltipProps}>
                                <styled.Tooltip style={{textAlign: 'left', maxWidth: '20rem'}} dangerouslySetInnerHTML={{__html:descriptions.productivitySettings}}></styled.Tooltip>
                            </ReactTooltip>
                            <div style={{fontWeight: 'bold'}}>Desired Takt</div>
                            <div style={{color: '#8e8e9c', marginBottom: '1rem'}}>{label}</div>

                            <styled.DualSelectionButtonContainer style={{ justifyContent: 'center', width: '100%', alignContent: 'center', marginBottom: '0.5rem'}}>
                                <styled.DualSelectionButton activeColor={defaultColors[0]} style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                                    onClick={() => setMode('takt')}
                                    selected={mode === 'takt'}
                                >
                                    Process Takt
                                </styled.DualSelectionButton>
                                <styled.DualSelectionButton activeColor={defaultColors[0]} style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                                    onClick={() => setMode('auto')}
                                    selected={mode === 'auto' || mode === 'manual'}
                                >
                                    Station Takt
                                </styled.DualSelectionButton>
                            </styled.DualSelectionButtonContainer>

                            <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                                <div style={{fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', width: '4rem', justifyContent: 'flex-end', alignItems: 'center'}}>Auto</div>
                                    <Switch
                                        checked={mode === 'manual' || mode === 'takt'}
                                        disabled={mode === 'takt'}   
                                        onChange={val => val === true ? setMode('manual') : setMode('auto')}
                                        offColor={defaultColors[1]}
                                        onColor={defaultColors[2]}
                                        style={{margin: '0 0.5rem'}}
                                    />
                                 <div style={{fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', width: '4rem', justifyContent: 'flex-start', alignItems: 'center'}}>Manual</div>
                            </div>
                            <InputGroup className="mb-3 mt-3">
                                <FormControl className="input-sm" ariaLabel="Production Rate" type="number" min="0" disabled={mode !== 'manual'} onChange={e => setQuantity(e.target.value)} value={quantity} />
                                <InputGroup.Text>per</InputGroup.Text>
                                <DropdownButton
                                    onSelect={e => setTimescale(e)}
                                    variant='light'
                                    title={timescale}
                                    id={`timescale-${label}`}
                                    disabled={mode !== 'manual'}
                                >
                                    <Dropdown.Item href="#" eventKey='minute'>Minute</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='hour'>Hour</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='day'>Day</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='week'>Week</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='month'>Month</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='year'>Year</Dropdown.Item>
                                </DropdownButton>
                            </InputGroup>
                            <Button label="Save" style={{height: '1.5rem', width: '12rem', margin: '0'}} onClick={() => onSave(parseFloat(quantity), timescale, mode)}/>
                        </styled.TimePickerTooltip>
                    </ReactTooltip>
                </Portal>
            </foreignObject>
        </g>
    )
}

const OEETick = (props) => {

    const {
        numBars,
        label,
        initialQuantity,
        initialTimescale,
        onSave
    } = props;

    const tooltipRef = useRef(null);
    const [quantity, setQuantity] = useState(initialQuantity);
    const [timescale, setTimescale] = useState(initialTimescale);

    return (
        <g transform={`rotate(${props.rotation}) translate(${props.textX}, ${props.y}) scale(${Math.exp(-0.15*(numBars-1))})`}>
            <foreignObject x={`${numBars-14}`} y="-12" width="22" height="22" >
                <i className="fas fa-cog" style={{color: '#c0c0cc', cursor: 'pointer', fontSize: `1.2rem`, background:'white', padding: '2px'}} data-event='click' data-tip data-for={`${label}-oee-timepicker`} />
                <Portal>
                    <ReactTooltip ref={tooltipRef} id={`${label}-oee-timepicker`} {...tooltipProps} place="left" clickable={true}>
                        <styled.TimePickerTooltip>
                        <i style={{color: 'grey', cursor: 'pointer', position: 'absolute', top: '0.5rem', right: '0.5rem'}} className='fas fa-times' onClick={() => {tooltipRef.current.tooltipRef = null; tooltipRef.current.hideTooltip()}}/>
                            <div style={{fontWeight: 'bold'}}>Maximum Production Rate</div>
                            <div style={{color: '#8e8e9c'}}>{label}</div>

                            <InputGroup className="mb-3 mt-3">
                                <FormControl className="input-sm" ariaLabel="Production Rate" type="number" min="0" onChange={e => setQuantity(e.target.value)} value={quantity} />
                                <InputGroup.Text>per</InputGroup.Text>
                                <DropdownButton
                                    onSelect={e => setTimescale(e)}
                                    variant='light'
                                    title={capitalizeFirstLetter(timescale)}
                                    id={`timescale-${label}`}
                                >
                                    <Dropdown.Item href="#" eventKey='minute'>Minute</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='hour'>Hour</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='day'>Day</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='week'>Week</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='month'>Month</Dropdown.Item>
                                    <Dropdown.Item href="#" eventKey='year'>Year</Dropdown.Item>
                                </DropdownButton>
                            </InputGroup>
                            <Button label="Save" style={{height: '1.5rem', width: '12rem', margin: '0'}} onClick={() => onSave(parseFloat(quantity), timescale)}/>
                        </styled.TimePickerTooltip>
                    </ReactTooltip>
                </Portal>
            </foreignObject>
        </g>
    )
}



const StatisticsPage = () => {

    const params = useParams()
    const stationId = params.stationID

    // State Management
    const [dateRange, setDateRange] = useState([new Date(), undefined])
    const [data, setData] = useState(null)
    const [cycleTimePG, setCycleTimePG] = useState(null)
    const [showWIPChart, setShowWIPChart] = useState(false)
    const [isCumulative, setIsCumulative] = useState(true)
    const [showCalendar, setShowCalendar] = useState(false)

    const [originalThroughputData, setOriginalThroughputData] = useState([])
    const [throughputData, setThroughputData] = useState([])

    // Dispatches
    const dispatch = useDispatch()
    const dispatchPutStation = (station) => dispatch(putStation(station))
    const dispatchGetProductTemplates = () => dispatch(getLotTemplates())

    // Selectors
    const stations = useSelector(state => state.stationsReducer.stations)
    const processes = useSelector(state => state.processesReducer.processes)
    const productGroups = useSelector(state => state.lotTemplatesReducer.lotTemplates)

    const station = useMemo(() => stations[stationId], [stations, stationId])

    // On Mount
    useEffect(() => {
        refreshData(dateRange);
        dispatchGetProductTemplates()
    }, [dateRange])

    // Helpers
    const refreshData = async (dateRange) => {
        const tempData = await getStationStatistics(stationId, dateRange[0], dateRange[1])
        console.log(tempData)
        if (tempData === undefined) {
            setData(emptyData)
            alert('Something went wrong. Please contact Optio support for more information.')
        } else {
            await setCycleTimePG(null)
            await setThroughputData(deepCopy(tempData.throughput))
            await setData(tempData)
            if (!!tempData.cycle_time && Object.keys(tempData.cycle_time).length > 0 ) {
                await setCycleTimePG(Object.keys(tempData.cycle_time)[0])
            }

        }

    }

    const toggleCumulative = async () => {
        if (!data || !data.throughput) return
        let throughputDataCopy = []
        if (isCumulative) {
            const minTime = data.throughput.reduce((currMin, line) => !!line ? Math.min(currMin, line.data[line.data.length-1].x) : currMin, data.throughput[0]?.data[0]?.x || Number.MAX_VALUE)
            const maxTime = data.throughput.reduce((currMax, line) => !!line ? Math.max(currMax, line.data[line.data.length-1].x) : currMax, 0)

            await data.throughput.forEach(async (line, i) => {
                let cumulation = 0;
                let newLineData = []
                for (var j in line.data) {
                    if (j == 0 && line.data[j].x !== minTime) {
                        newLineData.push({x: minTime, y: 0})
                    }
                    cumulation += line.data[j].y;
                    newLineData.push({x: line.data[j].x, y: cumulation})
                }
                newLineData.push({x: maxTime, y: cumulation})
                throughputDataCopy.push({...line, data: newLineData})
            })
        } else {
            throughputDataCopy = deepCopy(data.throughput).filter(line => line.id !== 'Total').map(line => ({...line, dashed: true}))
        }
        setThroughputData(throughputDataCopy);
    }

    useEffect(() => {
        if (!data || !data.throughput) return []
        toggleCumulative();
    }, [data, isCumulative])

    const renderCycleTimeDropdown = useMemo(() => {
        const options = Object.keys(data?.cycle_time || {}).map(id => ({id, name: data.cycle_time[id].name}))

        return <DropDownSearch
            placeholder="Product Group"
            labelField="name"
            valueField="id"
            options={options}
            values={!!cycleTimePG ? [options.find(option => option.id === cycleTimePG)] : []}
            dropdownGap={2}
            schema={'statistics'}
            noDataLabel="No cycle time data found"
            closeOnSelect="true"
            searchable={false}
            onChange={values => {
                !!values[0] && setCycleTimePG(values[0].id)
            }}
            style={{maxWidth: '15rem', margin: '0.5rem 0', height: '2.3rem'}}
        />
    }, [data?.cycle_time, cycleTimePG])

    const setCycleTimeObj = (pgId, CTObj) => {
        let stationCopy = deepCopy(station)
        stationCopy.cycle_times[pgId] = CTObj
        dispatchPutStation(stationCopy)
    }

    const renderChart2Options = useMemo(() => {

        return (
            <div style={{margin: '0.4rem 0', display: 'flex'}}>
                <styled.DualSelectionButtonContainer style={{ justifyContent: 'center', marginBottom: '0.5rem', marginRight: '2rem', width: '16rem' }}>
                    <styled.DualSelectionButton activeColor={defaultColors[0]} style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                        onClick={() => setShowWIPChart(false)}
                        selected={!showWIPChart}
                    >
                        Throughput
                    </styled.DualSelectionButton>
                    <styled.DualSelectionButton activeColor={defaultColors[0]} style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                        onClick={() => setShowWIPChart(true)}
                        selected={showWIPChart}
                    >
                        WIP
                    </styled.DualSelectionButton>
                </styled.DualSelectionButtonContainer>
                {!showWIPChart &&
                    <>
                        <Checkbox checked={isCumulative} onClick={() => setIsCumulative(!isCumulative)} css={`--active: ${defaultColors[0]}`}/>
                        <styled.CheckboxLabel>Cumulative</styled.CheckboxLabel>
                    </>
                }
            </div>
        )

    }, [showWIPChart, isCumulative])

    const renderProductivityBarsMemo = useMemo(() => {
        // This needs to be in a memo, otherwise the tooltip will close

        if (!data) return <ScaleLoader />
        else if (!Object.values(data.partials).length) return <styled.NoData>No Data</styled.NoData>
        else {
            var weighted_sum = 0;
            var labelsMap = {}
            let prod_data = Object.keys(data.partials).map(pgId => {
                const productGroup = productGroups[pgId];
                const pgName = !!productGroup ? productGroup.name : '???';
                const pgProcessName = !!productGroup && !!processes[productGroup.processId] ? processes[productGroup.processId].name : '???';
                const label = `${pgName} (${pgProcessName})`;

                const CTObj = station.cycle_times[pgId]

                let compareValue;
                switch (CTObj.mode) {
                    case 'auto':
                        compareValue = CTObj.historical || 0;
                        break;
                    case 'manual': 
                        compareValue = CTObj.manual || 0;
                        break;
                    case 'takt': 
                        compareValue = productGroup.taktTime || 0
                }
                const partial = data.partials[pgId].value;
                const pgQuantity = data.partials[pgId].quantity;

                labelsMap[label] = pgId

                const prod = compareValue * partial
                weighted_sum += prod * pgQuantity
                return {
                    'id': label,
                    'data': [{
                        'x': '',
                        'y': prod * 100
                    }]
                }

            })

            const dailyWorkingSeconds = data?.daily_working_seconds || 0;

            return (
                <RadialBar
                    data={prod_data}
                    icon='fas fa-bolt'
                    centerLabel='OVERALL'
                    centerValue={100 * weighted_sum / data.total_quantity}
                    radialAxisEnd={{ tickComponent: (d) => {
                        const cycleTimeObj = station.cycle_times[labelsMap[d.label]]

                        return <ProdTick
                            key={`prod-tick-${labelsMap[d.label]}`}
                            numBars={prod_data.length}
                            CTObj={cycleTimeObj}
                            processTaktTime={productGroups[d.label]?.taktTime || 0}
                            dailyWorkingSeconds={dailyWorkingSeconds}
                            onSave={(quantity, timescale, mode) => {

                                if (mode === 'manual') {
                                    const cycleTime = convertProductionRateToCycleTime(quantity, timescale, dailyWorkingSeconds)
                                    setCycleTimeObj(labelsMap[d.label], {
                                        ...cycleTimeObj,
                                        manual: cycleTime,
                                        mode
                                    })
                                } else {
                                    setCycleTimeObj(labelsMap[d.label], {
                                        ...cycleTimeObj,
                                        mode
                                    })
                                }
                                
                            }}
                            {...d}
                        />
                    }}}
                />
            )
        }
    }, [data, stations])

    /**
     * This memo renders the OEE radial bar graph. This graph is different than other charts because the data is generated on the fly. The initial values
     * are generated on the backend but since the OEE is relative to the theoretical cycle time (which is set on this graph) we need to calculate the actual
     * ratio on this page.
     */
    const renderOEEBarsMemo = useMemo(() => {
        // This needs to be in a memo, otherwise the tooltip will close when the time picker is clicked

        if (!data) return <ScaleLoader />
        else if (!Object.values(data.partials).length) return <styled.NoData>No Data</styled.NoData>
        else {
            var weighted_sum = 0;
            var labelsMap = {}
            let oee_data = Object.keys(data.partials).map(pgId => {
                const productGroup = productGroups[pgId];
                const pgName = !!productGroup ? productGroup.name : '???';
                const pgProcessName = !!productGroup && !!processes[productGroup.processId] ? processes[productGroup.processId].name : '???';
                const label = `${pgName} (${pgProcessName})`;

                const theoreticalCycleTime = station.cycle_times[pgId]?.theoretical || 0;
                const partial = data.partials[pgId].value;
                const pgQuantity = data.partials[pgId].quantity;

                labelsMap[label] = pgId

                const oee = theoreticalCycleTime * partial
                weighted_sum += oee * pgQuantity
                return {
                    'id': label,
                    'data': [{
                        'x': '',
                        'y': oee * 100
                    }]
                }

            })

            const dailyWorkingSeconds = data?.daily_working_seconds || 0;

            return (
                <RadialBar
                    data={oee_data}
                    icon='fas fa-rocket'
                    centerLabel='OVERALL'
                    centerValue={100 * weighted_sum / data.total_quantity}
                    radialAxisEnd={{ tickComponent: (d) => {
                        const cycleTimeObj = station.cycle_times[labelsMap[d.label]]
                        const { quantity, timescale } = convertCycleTimeToProductionRate(cycleTimeObj.theoretical, dailyWorkingSeconds)

                        return <OEETick
                            numBars={oee_data.length}
                            key={`oee-tick-${labelsMap[d.label]}`}
                            initialQuantity={quantity}
                            initialTimescale={timescale}
                            onSave={(newQuantity, newTimescale) => {
                                const cycleTime = convertProductionRateToCycleTime(newQuantity, newTimescale, dailyWorkingSeconds)
                                console.log(cycleTime, '!!!', newQuantity, newTimescale)
                                setCycleTimeObj(labelsMap[d.label], {
                                    ...cycleTimeObj,
                                    theoretical: cycleTime
                                })
                            }}
                            {...d}
                        />
                    }}}
                />
            )
        }
    }, [data, stations])

    const renderHeader = (label, stat) => (
        <styled.CardHeader>
            <styled.CardLabel>{label}</styled.CardLabel>
            <styled.TooltipIcon className="fas fa-info"  data-tip data-for={`${stat}-tooltip`} />
            <ReactTooltip id={`${stat}-tooltip`} {...tooltipProps}>
                <styled.Tooltip dangerouslySetInnerHTML={{__html:descriptions[stat]}}></styled.Tooltip>
            </ReactTooltip>
        </styled.CardHeader>
    )

    const productionRate = useMemo(() => {
        if (!data || !data.cycle_time || !data.cycle_time[cycleTimePG] || !data.cycle_time[cycleTimePG].current) return ''
        const {quantity, timescale} = convertCycleTimeToProductionRate(data.cycle_time[cycleTimePG].current)
        return `${quantity} parts per ${capitalizeFirstLetter(timescale)}`
    }, )

    return (
        <styled.Page>
            <styled.Header>
                <styled.StationName>{stations[stationId].name}</styled.StationName>
            </styled.Header>

            <styled.StatisticsContainer>

                {showCalendar &&
                    <Popup
                        open={showCalendar}
                        closeOnDocumentClick={true}
                        onClose={() => setShowCalendar(false)}
                    >
                        <Calendar
                            selectRange={true}
                            allowPartialRange={true}
                            maxDate={new Date()}
                            onChange={range => {
                                if (range.length !== 2) return

                                const startRange = new Date(range[0].getFullYear(),range[0].getMonth() , range[0].getDate())
                                const endRange = new Date(range[1].getFullYear(),range[1].getMonth() , range[1].getDate())

                                if (startRange.getTime() === endRange.getTime()) {
                                    setDateRange([startRange, undefined])
                                    setShowCalendar(false)
                                } else {
                                    setDateRange([startRange, endRange])
                                    setShowCalendar(false)
                                }
                            }}
                        />
                    </Popup>
                }

                <styled.TimePickerLabel 
                    onClick={() => setShowCalendar(true)}
                >
                    {`${dateRange[0].toLocaleDateString("en-US")} ${!!dateRange[1] ? `- ${dateRange[1].toLocaleDateString("en-US")}` : ''}`}
                </styled.TimePickerLabel>

                <styled.Row>

                    <styled.Card style={{width: '25%'}}>
                        {renderHeader('Productivity', 'productivity')}
                        <styled.ChartContainer>
                            {renderProductivityBarsMemo}
                        </styled.ChartContainer>
                    </styled.Card>

                    <styled.Card style={{width: '25%'}}>
                        {renderHeader('OEE', 'oee')}
                        <styled.ChartContainer style={{height: '16rem'}}>
                            {renderOEEBarsMemo}
                        </styled.ChartContainer>
                    </styled.Card>

                    <styled.Card style={{width: '50%'}}>
                        {renderHeader('Production Time', 'cycleTime')}
                        <styled.ChartContainer style={{height: '16rem'}}>
                            {!!data ?
                                <>
                                    {renderCycleTimeDropdown}
                                    <div  style={{height: `${16-2.3}rem`}}>
                                        {!!cycleTimePG && !!data.cycle_time[cycleTimePG] && data.cycle_time[cycleTimePG].line_data[0].data.length > 1 ?
                                                <div style={{height: '10rem'}}>
                                                    <Line
                                                        data={data.cycle_time[cycleTimePG].line_data}
                                                        showLegend={false}
                                                        showAxes={false}
                                                        yFormat={v => secondsToReadable(v)}
                                                        margin={{top:10, right:2, bottom:10, left:2}}
                                                        xFormat={v => !!dateRange[1] ? new Date(v).toLocaleDateString("en-US") : formatTimeString(v)}
                                                    />
                                                </div>
                                                :
                                                <styled.NoData style={{height: '10rem'}}>Not Enough Data</styled.NoData>
                                        }
                                        {
                                            !!!!cycleTimePG && !!data.cycle_time[cycleTimePG] && !!data.cycle_time[cycleTimePG].current &&
                                            <div style={{height: '2rem'}}>
                                                <styled.CycleTimeLabel>{productionRate}</styled.CycleTimeLabel>
                                                <styled.CycleTime>{secondsToReadable(data.cycle_time[cycleTimePG].current)}</styled.CycleTime>
                                            </div>
                                        }
                                    </div>
                                </>:
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>

                </styled.Row>

                <styled.Row>
                    <styled.Card style={{flexGrow: 1}}>
                        {showWIPChart ? renderHeader('WIP', 'wip') : renderHeader('Throughput', 'throughput')}
                        {renderChart2Options}
                        <styled.ChartContainer style={{height: '25.4rem'}}>

                            {!!data ?
                                showWIPChart ? 
                                    data.wip.length > 0 ? 
                                        <Line data={data.wip.filter(line => line.data.length>0)} showLegend={true} xFormat={v => !!dateRange[1] ? new Date(v).toLocaleDateString("en-US") : formatTimeString(v)}/> 
                                        : <styled.NoData>Not Enough Data</styled.NoData>
                                    :
                                    throughputData.length > 1 ? 
                                        <Line data={throughputData.filter(line => line.data.length>0)} showLegend={true} xFormat={v => !!dateRange[1] ? new Date(v).toLocaleDateString("en-US") : formatTimeString(v)} curve={isCumulative ? "monotoneX" : "linear"}/> 
                                        : <styled.NoData>Not Enough Data</styled.NoData>
                                :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>
                </styled.Row>

                <styled.Row>
                    <styled.Card style={{flexGrow: 1}}>
                        {renderHeader('Station Reports', 'stationReports')}
                        <styled.ChartContainer style={{height: '20rem'}}>
                            {!!data ?
                                !!data.reports.data && data.reports.data.length ?
                                    <Bar data={data.reports.data} keys={Object.keys(data.reports.key_colors)} colors={Object.values(data.reports.key_colors)}/>
                                    : <styled.NoData>No Data</styled.NoData>
                                :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>
                </styled.Row>

                <styled.Row>
                    <styled.Card style={{flexGrow: 1}}>
                        <styled.ChartContainer style={{display: 'flex', flexDirection: 'row', height: '20rem', maxHeight: '26rem', justifyContent: 'space-between'}}>
                            {!!data ?
                                <>
                                    <styled.PieContainer>
                                        <Pie data={data.reports_pie} label="Station Reports" stat="stationReportsPie" description={descriptions.stationReportsPie}/>
                                    </styled.PieContainer>
                                    <styled.PieContainer>
                                        <Pie data={data.process_pie} label="Processes" stat="processesPie" description={descriptions.processesPie}/>
                                    </styled.PieContainer>
                                    <styled.PieContainer>
                                        <Pie data={data.product_group_pie} label="Product Groups" stat="productGroupPie" description={descriptions.productGroupPie}/>
                                    </styled.PieContainer>
                                    <styled.PieContainer>
                                        <Pie data={data.operator_pie} label="Operators" stat="operatorsPie" description={descriptions.operatorsPie}/>
                                    </styled.PieContainer>
                                    {data.out_station_pie.length > 1 &&
                                        <styled.PieContainer>
                                            <Pie data={data.out_station_pie} label="To Station" stat="toStationPie" description={descriptions.toStationPie}/>
                                        </styled.PieContainer>
                                    }
                                </> :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>
                </styled.Row>

                <styled.Row>
                    <styled.Card style={{width: '50%', maxWidth: '50%', height: '10rem', minHeight: '10rem'}}>
                        {renderHeader('Machine Utilization', 'machineUtilization')}
                        <styled.ChartContainer style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {!!data ?
                            !!data.machine_utilization && Object.keys(data.machine_utilization).length ?
                                <Scale data={[data.machine_utilization]} labels={['working', 'idle']} valueFormat={v => secondsToReadable(v)}/>
                                : <styled.NoData>No Data</styled.NoData>
                            :
                            <ScaleLoader />
                        }
                        </styled.ChartContainer>
                    </styled.Card>
                    <styled.Card style={{width: '50%', maxWidth: '50%', height: '10rem', minHeight: '10rem'}}>
                        {renderHeader('Value Creating Time', 'valueCreatingTime')}
                        <styled.ChartContainer style={{display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100%'}}>
                        {!!data ?
                            !!data.value_creating_time && Object.keys(data.value_creating_time).length ?
                                <Scale data={[data.value_creating_time]} labels={['working', 'idle']} valueFormat={v => secondsToReadable(v)}/>
                                : <styled.NoData>No Data</styled.NoData>
                            :
                            <ScaleLoader />
                        }
                        </styled.ChartContainer>
                    </styled.Card>
                </styled.Row>

            </styled.StatisticsContainer>
        </styled.Page>
    )
}

export default StatisticsPage
