import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';

// Import Styles
import * as styled from './process_statistics.style'
import { ThemeContext } from 'styled-components';

// Components
import ReactTooltip from 'react-tooltip';
import ScaleLoader from 'react-spinners/ScaleLoader'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search';
import Calendar from '../../../../basic/calendar/calendar';
import Checkbox from '../../../../basic/checkbox/checkbox';
import BackButton from '../../../../basic/back_button/back_button';
import Popup from 'reactjs-popup';

// Charts
import { defaultColors, tooltipProps } from '../../../../basic/charts/nivo_theme';
import BalanceBar from '../../../../basic/charts/balance_bar/balance_bar';
import Line from '../../../../basic/charts/line/line';

import { getProcessStatistics } from '../../../../../api/processes_api';
import { deepCopy } from '../../../../../methods/utils/utils';
import { secondsToReadable } from '../../../../../methods/utils/time_utils';
import { getLotTemplates } from '../../../../../redux/actions/lot_template_actions';

import descriptions from './descriptions';
import Portal from '../../../../../higher_order_components/portal';

const emptyData = {
    production_rates: {total: null, data: []},
    lead_time: 0,
    wip: {total: null, data: []},
    throughput: [],
    total_throughputs: {total: null, data: []},
    wip: [],
    balance: []
}

const formatTimeString = (UTCSeconds) => {
    var m = new Date(UTCSeconds);
    return m.getHours() + ":" + m.getMinutes().toString().padStart(2, '0')
}

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

    // Dispatches
    const dispatch = useDispatch()
    const dispatchGetProductTemplates = () => dispatch(getLotTemplates())

    // On Mount
    useEffect(() => {
        dispatchGetProductTemplates()
        refreshData(dateRange);
    }, [dateRange])

    // Helpers
    const refreshData = async (dateRange) => {
        setBalancePG(null)
        setData(null)
        setThroughputData([])
        const tempData = await getProcessStatistics(id, dateRange[0], dateRange[1])
        console.log(tempData)
        if (tempData === undefined) {
            setBalancePG(null)
            setData(emptyData)
            setThroughputData([])
            alert('Something went wrong. Please contact Optio support for more information.')
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
        if (!!data && Object.keys(data.balance).length && (!balancePG || !(balancePG in data.balance))) {
            setBalancePG(Object.keys(data.balance)[0])
        }
    }, [data, balancePG])

    const toggleCumulative = async () => {
        let throughputDataCopy = []
        if (isCumulative) {
            const minTime = data.throughput.reduce((currMin, line) => Math.min(currMin, line.data[line.data.length-1].x), data.throughput[0].data[0].x)
            const maxTime = data.throughput.reduce((currMax, line) => Math.max(currMax, line.data[line.data.length-1].x), 0)

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

    const renderProductGroupDropdown = useMemo(() => {
        const options = Object.keys(data?.balance || {}).map(id => ({id, name: productGroups[id]?.name || id}))

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
    }, [data?.balance, balancePG, productGroups])

    const renderHeader = (label, stat) => (
        <styled.CardHeader>
            <styled.CardLabel>{label}</styled.CardLabel>
            <styled.TooltipIcon className="fas fa-info"  data-tip data-for={`${stat}-tooltip`} />
            <Portal>
                <ReactTooltip id={`${stat}-tooltip`} {...tooltipProps}>
                    <styled.Tooltip dangerouslySetInnerHTML={{__html:descriptions[stat]}}></styled.Tooltip>
                </ReactTooltip>
            </Portal>
        </styled.CardHeader>
    )

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
                        {renderHeader('Throughput', 'totalThroughput')}
                        {!!data ? 
                            !!data.total_throughputs && 'total' in data.total_throughputs ?
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
                        {renderHeader('Production Rate', 'productionRate')}
                        {!!data ? 
                            !!data.production_rates && 'total' in data.production_rates ?
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
                        {renderHeader('Work in Process', 'wip')}
                        {!!data ? 
                            'total' in data.wip ?
                                <styled.ChartContainer>
                                    <styled.PrimaryLabel>Total</styled.PrimaryLabel>
                                    <styled.PrimaryValue>{data.wip.total} Parts</styled.PrimaryValue>
                                    {data.wip.data.map((datum, i) => (
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
                    {renderHeader('Lead Time', 'leadTime')}
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
                        {renderHeader('Line Balance', 'balance')}
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
                        {renderHeader('Throughput', 'throughput')}
                        <div style={{margin: '0.4rem 0', display: 'flex'}}>
                            <Checkbox checked={isCumulative} onClick={() => setIsCumulative(!isCumulative)} css={`--active: ${defaultColors[0]}`}/>
                            <styled.CheckboxLabel>Cumulative</styled.CheckboxLabel>
                        </div>
                        <styled.ChartContainer style={{height: '25.4rem'}}>
                            {!!data ?
                                throughputData.length > 1 ? 
                                    <Line data={throughputData} showLegend={true} xFormat={v => !!dateRange[1] ? new Date(v).toLocaleDateString("en-US") : formatTimeString(v)}/> 
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
