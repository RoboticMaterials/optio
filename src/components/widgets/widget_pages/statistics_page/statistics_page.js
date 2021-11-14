import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './statistics_page.style'

// Components
import ScaleLoader from 'react-spinners/ScaleLoader'
import DropDownSearch from '../../../basic/drop_down_search_v2/drop_down_search';

// Charts
import RadialBar from './charts/radial_bar/radial_bar';
import Line from './charts/line/line';
import Bar from './charts/bar/bar';
import Pie from './charts/pie/pie';

import { getStationStatistics } from '../../../../api/stations_api';
import { DualSelectionButton } from '../../../side_bar/content/cards/lot_filter_bar/lot_filter_bar.style';
import Checkbox from '../../../basic/checkbox/checkbox';
import { defaultColors } from './charts/nivo_theme';

import { deepCopy } from '../../../../methods/utils/utils';

const StatisticsPage = () => {

    const params = useParams()
    const stationId = params.stationID

    // State Management
    const [data, setData] = useState(null)
    const [cycleTimePG, setCycleTimePg] = useState(null)
    const [showWIPChart, setShowWIPChart] = useState(false)
    const [isCumulative, setIsCumulative] = useState(false)

    const [originalThroughputData, setOriginalThroughputData] = useState([])
    const [throughputData, setThroughputData] = useState([])

    // Selectors
    const stations = useSelector(state => state.stationsReducer.stations)

    // On Mount
    useEffect(() => {
        const today = new Date()
        const yesterday = new Date(today)

        yesterday.setDate(yesterday.getDate() - 1)

        refreshData(today);
    }, [])

    // Helpers
    const refreshData = async (startDate, endDate) => {
        const tempData = await getStationStatistics(stationId, startDate, endDate)
        console.log(tempData)
        if (!Object.keys(tempData).length == 0 && !!tempData.cycle_time) {
            setCycleTimePg(Object.keys(tempData.cycle_time)[0])
        }
        setThroughputData(deepCopy(tempData.throughput))
        setData(tempData)
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
                setCycleTimePg(values[0].id)
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

                <styled.TimePickerLabel>Tuesday, November 9</styled.TimePickerLabel>

                <styled.Row>

                    <styled.Card style={{width: '25%'}}>
                        <styled.CardLabel>Efficiency</styled.CardLabel>
                        <styled.ChartContainer>
                            {!!data ? 
                                data.efficiency.length ?
                                    <RadialBar data={data.efficiency} icon='fas fa-bolt' centerLabel='OVERALL' centerValue={46.3}/>
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
                                data.oee.length ?
                                    <RadialBar data={data.oee} icon='fas fa-rocket' centerLabel='OVERALL' centerValue={23.1}/>
                                    : <styled.NoData>No Data</styled.NoData>
                                :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>

                    <styled.Card style={{width: '50%'}}>
                        <styled.CardLabel>Cycle Time</styled.CardLabel>
                        <styled.ChartContainer style={{height: '16rem'}}>
                            {!!data && !!cycleTimePG ? 
                                <>
                                    {renderCycleTimeDropdown}
                                    <div  style={{height: `${16-2.3}rem`}}>
                                        {
                                            data.cycle_time[cycleTimePG].line_data[0].data.length > 1 ?
                                            <Line data={data.cycle_time[cycleTimePG].line_data} showLegend={false} showAxes={false}/> 
                                            : 
                                            <styled.NoData>Not Enough Data</styled.NoData>
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

            </styled.StatisticsContainer>
        </styled.Page>
    )
}

export default StatisticsPage