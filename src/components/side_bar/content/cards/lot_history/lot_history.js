import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getLotTouchEvents } from '../../../../../redux/actions/touch_events_actions';

const LotHistory = (props) => {

    const lotEvents = useSelector(state => state.touchEventsReducer.lotEvents)

    const dispatch = useDispatch()
    const dispatchGetLotTouchEvents = async (lotId) => dispatch(getLotTouchEvents(lotId))

}

export default LotHistory;