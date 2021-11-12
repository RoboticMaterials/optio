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

const StatisticsPage = () => {

    const params = useParams()
    const stationId = params.stationID

    // State Management
    const [data, setData] = useState(null)
    const [cycleTimePG, setCycleTimePg] = useState(null)

    // Selectors
    const stations = useSelector(state => state.stationsReducer.stations)

    // On Mount
    useEffect(() => {
        const today = new Date()
        const yesterday = new Date(today)

        yesterday.setDate(yesterday.getDate() - 2)

        refreshData(today);
    }, [])

    // Helpers
    const refreshData = async (startDate, endDate) => {
        const tempData = await getStationStatistics(stationId, startDate, endDate)
        console.log(tempData)
        if (!Object.keys(tempData).length == 0) {
            setCycleTimePg(Object.keys(tempData.cycle_time)[0])
        }
        setData(tempData)
    }

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
                                <RadialBar data={data.efficiency} icon='fas fa-bolt' centerLabel='OVERALL' centerValue={46.3}/> :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>

                    <styled.Card style={{width: '25%'}}>
                        <styled.CardLabel>OEE</styled.CardLabel>
                        <styled.ChartContainer style={{height: '16rem'}}>
                            {!!data ? 
                                <RadialBar data={data.oee} icon='fas fa-rocket' centerLabel='OVERALL' centerValue={23.1}/> :
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
                                        <Line data={data.cycle_time[cycleTimePG].line_data} showLegend={false}/> 
                                    </div>
                                </>:
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>

                </styled.Row>

                <styled.Row>
                    <styled.Card style={{flexGrow: 1}}>
                        <styled.CardLabel>Throughput</styled.CardLabel>
                        <styled.ChartContainer style={{height: '25rem'}}>
                            {!!data && !!cycleTimePG ? 
                                <Line data={data.throughput} height={'24rem'} showLegend={true}/> :
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
                                <Bar data={data.reports.data} keys={Object.keys(data.reports.key_colors)} colors={Object.values(data.reports.key_colors)}/> :
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
                                        <Pie data={data.reports_pie} />
                                    </styled.PieContainer>
                                    <styled.PieContainer>
                                        <Pie data={data.product_group_pie} />
                                    </styled.PieContainer>
                                    <styled.PieContainer>
                                        <Pie data={data.reports_pie} />
                                    </styled.PieContainer>
                                    <styled.PieContainer>
                                        <Pie data={data.reports_pie} />
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