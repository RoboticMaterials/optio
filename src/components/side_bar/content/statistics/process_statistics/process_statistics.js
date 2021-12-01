import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';

// Import Styles
import * as styled from './process_statistics.style'
import { ThemeContext } from 'styled-components';

// Components
import ScaleLoader from 'react-spinners/ScaleLoader'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search';
import Calendar from '../../../../basic/calendar/calendar';
import Checkbox from '../../../../basic/checkbox/checkbox';
import BackButton from '../../../../basic/back_button/back_button';
import Popup from 'reactjs-popup';

// Charts
import { defaultColors } from '../../../../basic/charts/nivo_theme';
import BalanceBar from '../../../../basic/charts/balance_bar/balance_bar';
import Line from '../../../../basic/charts/line/line';

import { getProcessStatistics } from '../../../../../api/processes_api';
import { deepCopy } from '../../../../../methods/utils/utils';
import { secondsToReadable } from '../../../../../methods/utils/time_utils';

const emptyData = {
    production_rates: {},
    lead_time: 0,
    current_wip: {},
    throughput: [],
    wip: [],
    balance: []
}

const takt = 600;

const ProcessStatistics = ({ id }) => {

    const history = useHistory()

    const processes = useSelector(state => state.processesReducer.processes)
    const productGroups = useSelector(state => state.lotTemplatesReducer.lotTemplates)

    const currentProcess = useMemo(() => {
        return processes[id]
    }, [id, processes])

    // State Management
    const [dateRange, setDateRange] = useState([new Date(), undefined])
    const [data, setData] = useState(null)
    const [balancePG, setBalancePG] = useState(null)
    const [showWIPChart, setShowWIPChart] = useState(false)
    const [isCumulative, setIsCumulative] = useState(true)
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
        const tempData = await getProcessStatistics(id, dateRange[0], dateRange[1])
        console.log(tempData)
        if (tempData === undefined) {
            setData(emptyData)
        } else {
            if (!(balancePG in tempData.balance)) {
                await setBalancePG(null)
            }
            await setThroughputData(deepCopy(tempData.throughput))
            await setData(tempData)
            if (!!tempData.balance && Object.keys(tempData.balance).length > 0 && !(balancePG in tempData.balance)) {
                await setBalancePG(Object.keys(tempData.balance)[0])
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

    const renderProductGroupDropdown = useMemo(() => {
        const options = Object.keys(data?.balance || {}).map(id => ({id, name: productGroups[id].name}))

        return <DropDownSearch
            placeholder="Product Group"
            labelField="name"
            valueField="id"
            options={options}
            values={!!balancePG ? [options.find(option => option.id === balancePG)] : []}
            dropdownGap={2}
            schema={'statistics'}
            noDataLabel="No balance time data found"
            closeOnSelect="true"
            searchable={false}
            onChange={values => {
                !!values[0] && setBalancePG(values[0].id)
            }}
            style={{maxWidth: '15rem', margin: '0.5rem 0', height: '2.3rem'}}
            className="w-100"
        />
    }, [data?.balance, balancePG])

    const renderChart2Options = useMemo(() => {

        return (
            <div style={{margin: '0.4rem 0', display: 'flex'}}>
                <Checkbox checked={isCumulative} onClick={() => setIsCumulative(!isCumulative)} css={`--active: ${defaultColors[0]}`}/>
                <styled.CheckboxLabel>Cumulative</styled.CheckboxLabel>
            </div>
        )

    }, [showWIPChart, isCumulative])

    return (
        <styled.Page>
            <styled.Header>
                <BackButton onClick={() => history.replace('/statistics')} containerStyle={{position: 'absolute', left: '1.5rem'}}/>
                {currentProcess.name}
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
                    <styled.Card style={{width: '33.33%'}}>
                        <styled.CardLabel>Throughput</styled.CardLabel>
                        {!!data ? 
                            'total' in data.total_throughputs ?
                                <styled.ChartContainer>
                                    <styled.PrimaryLabel>Finished Product</styled.PrimaryLabel>
                                    <styled.PrimaryValue>{data.total_throughputs.total} Parts</styled.PrimaryValue>
                                    {data.total_throughputs.data.map((datum, i) => (
                                        <styled.LegendItem>
                                            <styled.Dot color={defaultColors[i]} />
                                            <styled.LegendLabel>{datum.label}</styled.LegendLabel>
                                            <styled.LegendValue>{datum.value} Parts</styled.LegendValue>
                                        </styled.LegendItem>
                                    ))}
                                </styled.ChartContainer>
                                :
                                <styled.NoData>No Data</styled.NoData>
                            :
                            <ScaleLoader />         
                        }
                    </styled.Card>
                    <styled.Card style={{width: '33.33%'}}>
                        <styled.CardLabel>Production Rate</styled.CardLabel>
                        {!!data ? 
                            'total' in data.production_rates ?
                                <styled.ChartContainer>
                                    <styled.PrimaryLabel>1 Part Every</styled.PrimaryLabel>
                                    <styled.PrimaryValue>{secondsToReadable(data.production_rates.total)}</styled.PrimaryValue>
                                    {data.production_rates.data.map((datum, i) => (
                                        <styled.LegendItem>
                                            <styled.Dot color={defaultColors[i]} />
                                            <styled.LegendLabel>{datum.label}</styled.LegendLabel>
                                            <styled.LegendValue>{secondsToReadable(datum.value)}</styled.LegendValue>
                                        </styled.LegendItem>
                                    ))}
                                </styled.ChartContainer>
                                :
                                <styled.NoData>No Data</styled.NoData>
                            :
                            <ScaleLoader />         
                        }
                    </styled.Card>
                    <styled.Card style={{width: '33.33%'}}>
                        <styled.CardLabel>Work in Process</styled.CardLabel>
                        {!!data ? 
                            'total' in data.current_wip ?
                                <styled.ChartContainer>
                                    <styled.PrimaryLabel>Total</styled.PrimaryLabel>
                                    <styled.PrimaryValue>{data.current_wip.total} Parts</styled.PrimaryValue>
                                    {data.current_wip.data.map((datum, i) => (
                                        <styled.LegendItem>
                                            <styled.Dot color={defaultColors[i]} />
                                            <styled.LegendLabel>{datum.label}</styled.LegendLabel>
                                            <styled.LegendValue>{datum.value} Parts</styled.LegendValue>
                                        </styled.LegendItem>
                                    ))}
                                </styled.ChartContainer>
                                :
                                <styled.NoData>No Data</styled.NoData>
                            :
                            <ScaleLoader />         
                        }
                    </styled.Card>
                    <styled.Card style={{width: '33.33%'}}>
                        <styled.CardLabel>Lead Time</styled.CardLabel>
                        {!!data ? 
                            'total' in data.production_rates ?
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                                    <styled.PrimaryValue style={{fontSize: '2.4rem', color: '#9494b5'}}>{secondsToReadable(data.lead_time)}</styled.PrimaryValue>
                                </div>
                                :
                                <styled.NoData>No Data</styled.NoData>
                            :
                            <ScaleLoader />         
                        }
                    </styled.Card>
                </styled.Row>

                <styled.Row>
                    <styled.Card style={{flexGrow: 1}}>
                        <styled.CardLabel>Line Balance</styled.CardLabel>
                        <styled.ChartContainer style={{height: '26rem'}}>
                            {!!data ? 
                                !!data.balance && !!balancePG && data.balance[balancePG].length ?
                                    <BalanceBar data={data.balance[balancePG]} productGroupId={balancePG} renderDropdown={renderProductGroupDropdown}/>
                                    : <styled.NoData>No Data</styled.NoData>
                                :
                                <ScaleLoader />
                            }
                        </styled.ChartContainer>
                    </styled.Card>
                </styled.Row>

                <styled.Row>
                    <styled.Card style={{flexGrow: 1}}>
                        <styled.CardLabel>Throughput</styled.CardLabel>
                        {renderChart2Options}
                        <styled.ChartContainer style={{height: '25.4rem'}}>

                            {!!data ?
                                throughputData.length > 1 ? 
                                    <Line data={throughputData} showLegend={true}/> 
                                    : <styled.NoData>Not Enough Data</styled.NoData>
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

export default ProcessStatistics
