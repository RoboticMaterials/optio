import React, { useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import * as styled from './lot_history.style'

import { getLotTouchEvents } from '../../../../../redux/actions/touch_events_actions';

const LotHistory = (props) => {

    const {
        lotId
    } = props

    const lots = useSelector(state => state.cardsReducer.cards);
    const lotEvents = useSelector(state => state.touchEventsReducer.lotEvents)
    const stations = useSelector(state => state.stationsReducer.stations)
    const lotTemplates = useSelector(state => state.lotTemplatesReducer.lotTemplates)

    const lot = useMemo(() => lots[lotId] || {}, [lots, lotId])
    const lotStatus = useMemo(() => {
        if (lot === undefined) return null;
        if (Object.keys(lot.bins).length === 1 && Object.keys(lot.bins)[0] === 'QUEUE') return 'Queued'
        if (Object.keys(lot.bins).length === 1 && Object.keys(lot.bins)[0] === 'FINISH') return 'Finished'
        return 'In Progress'
    }, [lot])


    const dispatch = useDispatch()
    const dispatchGetLotTouchEvents = async (lotId) => dispatch(getLotTouchEvents(lotId))

    useEffect(() => {
        dispatchGetLotTouchEvents(lotId)
    }, [])
    
    const speed = (event) => {
        const cycleTime = (event.move_datetime.$date - event.start_datetime.$date) / 1000*event.quantity; // ms to s

        

        const productTemplateId = lotTemplates[event.product_group_id]._id
        const loadStation = stations[event.load_station_id]
        const stationCycleTime = loadStation?.cycle_times[productTemplateId]?.actual || 0

        const speedStatus = (cycleTime < stationCycleTime) ? 1 : -1
        const speedLabel = speedStatus === 1 ? `Fast -${Math.round(stationCycleTime-cycleTime)}s` : `Slow +${Math.round(cycleTime-stationCycleTime)}s`

        return (
            <styled.Flag speedStatus={speedStatus}>
                {speedLabel}
            </styled.Flag>
        )
    }
    
    return (
        <styled.HistoryContainer>
            <div style={{display: 'flex', marginBottom: '0.8rem'}}>
                <styled.Info><b>Lot: </b>{lot?.name}</styled.Info>
                <div style={{width: '5rem'}} />
                <styled.Info>Status: </styled.Info>
                <styled.BigFlag status={lotStatus}>{lotStatus}</styled.BigFlag>
            </div>
            <styled.HistoryTable>
                <styled.HeaderRow>
                    <styled.Label>From Station</styled.Label>
                    <styled.Label>To Station</styled.Label>
                    <styled.Label>Quantity</styled.Label>
                    <styled.Label>Touch Time</styled.Label>
                    <styled.Label>Move Time</styled.Label>
                    <styled.Label>Speed</styled.Label>
                    <styled.Label>Operator</styled.Label>
                    <styled.Label>Product</styled.Label>
                    <styled.Label>SKU / Product</styled.Label>
                </styled.HeaderRow>
                {lotEvents[lotId]?.map(event => (
                    <styled.EventRow key={`event-${event._id}`}>
                        <styled.Data>{stations[event.load_station_id]?.name || event.load_station_id}</styled.Data>
                        <styled.Data>{stations[event.unload_station_id]?.name || event.unload_station_id}</styled.Data>
                        <styled.Data>{event.quantity}</styled.Data>
                        <styled.Data>{new Date(event.start_datetime.$date).toLocaleString()}</styled.Data>
                        <styled.Data>{new Date(event.move_datetime.$date).toLocaleString()}</styled.Data>
                        <styled.Data>{speed(event)}</styled.Data>
                        <styled.Data>{event.user}</styled.Data>
                        <styled.Data>{lotTemplates[event.product_group_id]?.name}</styled.Data>
                        <styled.Data>{event.sku}</styled.Data>
                    </styled.EventRow>
                ))}
            </styled.HistoryTable>
        </styled.HistoryContainer>
    )

}

export default LotHistory;