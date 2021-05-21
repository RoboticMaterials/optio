import React, { useEffect, useState } from 'react'

// components internal
import Lot from "./lot"

// functions external
import PropTypes from 'prop-types'

import { useSelector } from "react-redux"

// utils
import { getBinQuantity, getCustomFields, getLotTotalQuantity } from "../../../../../methods/utils/lot_utils"

const LotContainer = (props) => {

    const {
        lotId,
        binId,
        enableFlagSelector,
        containerStyle,
        quantity,
        ...rest
    } = props

    const lot = useSelector(state => { return state.cardsReducer.cards[lotId] }) || {}
    const {
        bins,
        lotNumber,
        lotTemplateId,
        name,
        flags,
        process_id: processId
    } = lot || {}
    const process = useSelector(state => { return state.processesReducer.processes[processId] }) || {}
    const station = useSelector(state => { return state.stationsReducer.stations[binId] }) || {}

    const [totalQuantity, setTotalQuantity] = useState(0)
    const [count, setCount] = useState(0)
    const [templateValues, setTemplateValues] = useState([])
    const [processName, setProcessName] = useState("")
    const [stationName, setStationName] = useState("")

    useEffect(() => {
        setProcessName(process.name)
    }, [process])

    useEffect(() => {
        setStationName(station.name)
    }, [station])

    useEffect(() => {
        setTemplateValues(getCustomFields(lotTemplateId, lot))
    }, [lotTemplateId, lot])

    useEffect(() => {
        setTotalQuantity(getLotTotalQuantity({ bins }))
    }, [bins])

    useEffect(() => {
        setCount(getBinQuantity({ bins }, binId))
    }, [bins, binId])


    return (
        <Lot
            stationName={stationName}
            templateValues={templateValues}
            totalQuantity={totalQuantity}
            lotNumber={lotNumber}
            processName={processName}
            flags={flags || []}
            enableFlagSelector={enableFlagSelector}
            name={name}
            count={quantity ? quantity : count}
            id={lotId}
            isSelected={false}
            selectable={false}
            onClick={() => {

            }}

            {...rest}
            containerStyle={{ width: '80%', margin: '.5rem auto .5rem auto', ...containerStyle }}
        />
    )
}

LotContainer.propTypes = {
    lotId: PropTypes.string,
    binId: PropTypes.string
}

LotContainer.defaultProps = {
    lotId: "",
    binId: "",
    enableFlagSelector: false,
}

export default LotContainer
