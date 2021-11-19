import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './statistics_page.style'

// Components
import ScaleLoader from 'react-spinners/ScaleLoader'
import DropDownSearch from '../../../basic/drop_down_search_v2/drop_down_search';
import Calendar from '../../../basic/calendar/calendar';

// Charts
import RadialBar from './charts/radial_bar/radial_bar';
import Line from './charts/line/line';
import Bar from './charts/bar/bar';
import Pie from './charts/pie/pie';
import Scale from './charts/scale/scale';

import { getStationStatistics } from '../../../../api/stations_api';
import { DualSelectionButton } from '../../../side_bar/content/cards/lot_filter_bar/lot_filter_bar.style';
import Checkbox from '../../../basic/checkbox/checkbox';
import { defaultColors } from './charts/nivo_theme';

import { deepCopy } from '../../../../methods/utils/utils';
import Popup from 'reactjs-popup';

const emptyData = {
    efficiency: {overall: 0, data: []},
    oee: {overall: 0, data: []},
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

const StatisticsPage = () => {

    const params = useParams()
    const stationId = params.stationID

    // State Management
    const [dateRange, setDateRange] = useState([new Date(), undefined])
    const [data, setData] = useState(null)
    const [cycleTimePG, setCycleTimePG] = useState(null)
    const [showWIPChart, setShowWIPChart] = useState(false)
    const [isCumulative, setIsCumulative] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)

    const [originalThroughputData, setOriginalThroughputData] = useState([])
    const [throughputData, setThroughputData] = useState([])

    // Selectors
    const stations = useSelector(state => state.stationsReducer.stations)

    // On Mount
    useEffect(() => {
        refreshData(dateRange);
    }, [dateRange])

    // Helpers
    const refreshData = async (dateRange) => {
        const tempData = await getStationStatistics(stationId, dateRange[0], dateRange[1])
        console.log(tempData)
        if (tempData === undefined) {
            setData(emptyData)
        } else {
            await setCycleTimePG(null)
            await setThroughputData(deepCopy(tempData.throughput))
            await setData(tempData)
            if (!!tempData.cycle_time && Object.keys(tempData.cycle_time).length > 0 ) {
                console.log(Object.keys(tempData.cycle_time)[0])
                await setCycleTimePG(Object.keys(tempData.cycle_time)[0])
            }
            
        }
        
    }

    useEffect(() => {
        if (!data || !data.throughput) return []
        
        if (isCumulative) {
            data.throughput.forEach((line, i) => {
                let cumulation = 0;
                for (var j in line.data) {
                    cumulation += line.data[j].y;
                    throughputData[i].data[j].y = cumulation;
                }
            })

            setThroughputData(throughputData);
        } else {
            data.throughput.forEach((line, i) => {
                for (var j in line.data) {
                    throughputData[i].data[j].y = line.data[j].y;
                }
            })

            setThroughputData(throughputData);
        }

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

    const renderChart2Options = useMemo(() => {

        return (
            <div style={{margin: '0.4rem 0', display: 'flex'}}>
                <styled.DualSelectionButtonContainer style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <styled.DualSelectionButton
                        activeColor={defaultColors[0]}
                        style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                        onClick={() => setShowWIPChart(false)}
                        selected={!showWIPChart}
                    >
                        Throughput
                    </styled.DualSelectionButton>
                    <styled.DualSelectionButton
                        activeColor={defaultColors[0]}
                        style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
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

                <styled.TimePickerLabel onClick={() => setShowCalendar(true)}>{`${dateRange[0].toLocaleDateString("en-US")} ${!!dateRange[1] ? `- ${dateRange[1].toLocaleDateString("en-US")}` : ''}`}</styled.TimePickerLabel>

                <styled.Row>

                    <styled.Card style={{width: '25%'}}>
                        <styled.CardLabel>Efficiency</styled.CardLabel>
                        <styled.ChartContainer>
                            {!!data ? 
                                data.efficiency.data.length ?
                                    <RadialBar data={data.efficiency.data} icon='fas fa-bolt' centerLabel='OVERALL' centerValue={data.efficiency.overall}/>
                                    : <styled.NoData>No Data</styled.NoData>
                                :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>

                    <styled.Card style={{width: '25%'}}>
                        <styled.CardLabel>OEE</styled.CardLabel>
                        <styled.ChartContainer style={{height: '16rem'}}>
                            {!!data ? 
                                data.oee.data.length ?
                                    <RadialBar data={data.oee.data} icon='fas fa-rocket' centerLabel='OVERALL' centerValue={data.oee.overall}/>
                                    : <styled.NoData>No Data</styled.NoData>
                                :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>

                    <styled.Card style={{width: '50%'}}>
                        <styled.CardLabel>Cycle Time</styled.CardLabel>
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
                                                        yFormat={v => `${Math.floor(v/60)}min ${Math.round(v%60)}sec`}
                                                        margin={{top:10, right:2, bottom:10, left:2}}
                                                    /> 
                                                </div>
                                                : 
                                                <styled.NoData style={{height: '10rem'}}>Not Enough Data</styled.NoData>
                                        }
                                        {
                                            !!!!cycleTimePG && !!data.cycle_time[cycleTimePG] && !!data.cycle_time[cycleTimePG].current &&
                                            <div style={{height: '2rem'}}>
                                                <styled.CycleTimeLabel>Product Group Cycle Time</styled.CycleTimeLabel>
                                                <styled.CycleTime>{`${Math.floor(data.cycle_time[cycleTimePG].current/60)} min ${Math.round(data.cycle_time[cycleTimePG].current % 60)} sec`}</styled.CycleTime>
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
                        <styled.CardLabel>{showWIPChart ? 'WIP' : 'Throughput'}</styled.CardLabel>
                        {renderChart2Options}
                        <styled.ChartContainer style={{height: '25.4rem'}}>

                            {!!data ?
                                showWIPChart ? 
                                    data.wip.length > 1 ? 
                                        <Line data={data.wip} showLegend={true}/> 
                                        : <styled.NoData>Not Enough Data</styled.NoData>
                                    :
                                    throughputData.length > 1 ? 
                                        <Line data={throughputData} showLegend={true}/> 
                                        : <styled.NoData>Not Enough Data</styled.NoData>
                                :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>
                </styled.Row>

                <styled.Row>
                    <styled.Card style={{flexGrow: 1}}>
                        <styled.CardLabel>Station Reports</styled.CardLabel>
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
                                        <Pie data={data.reports_pie} label="Station Reports"/>
                                    </styled.PieContainer>
                                    <styled.PieContainer>
                                        <Pie data={data.process_pie} label="Processes"/>
                                    </styled.PieContainer>
                                    <styled.PieContainer>
                                        <Pie data={data.product_group_pie} label="Product Groups"/>
                                    </styled.PieContainer>
                                    <styled.PieContainer>
                                        <Pie data={data.out_station_pie} label="To Station"/>
                                    </styled.PieContainer>
                                </> :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>
                </styled.Row>

                <styled.Row>
                    <styled.Card style={{width: '50%', maxWidth: '50%', height: '10rem', minHeight: '10rem'}}>
                        <styled.CardLabel>Machine Utilization</styled.CardLabel>
                        <styled.ChartContainer style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {!!data ? 
                            !!data.machine_utilization && Object.keys(data.machine_utilization).length ?
                                <Scale data={[data.machine_utilization]} labels={['working', 'idle']}/>
                                : <styled.NoData>No Data</styled.NoData>
                            :
                            <ScaleLoader />
                        }
                        </styled.ChartContainer>
                    </styled.Card>
                    <styled.Card style={{width: '50%', maxWidth: '50%', height: '10rem', minHeight: '10rem'}}>
                        <styled.CardLabel>Value Creating Time</styled.CardLabel>
                        <styled.ChartContainer style={{display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100%'}}>
                        {!!data ? 
                            !!data.value_creating_time && Object.keys(data.value_creating_time).length ?
                                <Scale data={[data.value_creating_time]} labels={['working', 'idle']}/>
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