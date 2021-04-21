import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Basic Components
import Button from '../../../../../basic/button/button'
import BackButton from '../../../../../basic/back_button/back_button'

const DashboardLotPage = () => {

    const cards = useSelector(state => state.cardsReducer.cards)

    const params = useParams()
    const history = useHistory()

    const {
        stationID,
        dashboardID,
        subPage,
        lotID
    } = params || {}

    const currentLot = cards[lotID]

    // console.log('QQQQ params', params)
    console.log('QQQQ current lot', currentLot)

    return (
        <>
            <Button label={'Move'} />
        </>
    )

}

export default DashboardLotPage