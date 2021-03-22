import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Lot from "./lot";
import {useSelector} from "react-redux";
import {getBinQuantity, getLotTemplateData, getLotTotalQuantity} from "../../../../../methods/utils/lot_utils";
import {getProcessName} from "../../../../../methods/utils/processes_utils";
import {getStationName} from "../../../../../methods/utils/stations_utils";

const LotContainer = (props) => {

    const {
        lotId,
        binId,
        enableFlagSelector,
        processId,
        onSetCount,
        ...rest
    } = props

    const cards = useSelector(state => { return state.cardsReducer.cards }) || {}

    const [totalQuantity, setTotalQuantity] = useState(0)
    const [count, setCount] = useState(0)
    const [templateValues, setTemplateValues] = useState([])
    const [processName, setProcessName] = useState("")
    const [stationName, setStationName] = useState("")
    const [lot, setLot] = useState(cards[lotId])
    const {
        bins,
        lotNumber,
        lotTemplateId,
        name,
        flags
    } = lot || {}

    useEffect(() => {
        setLot(cards[lotId] || {})
    }, [cards, lotId])

    useEffect(() => {
        setProcessName(getProcessName(processId))
    }, [processId])

    useEffect(() => {
        setStationName(getStationName(binId))
    }, [binId])

    useEffect(() => {
        setTemplateValues(getLotTemplateData(lotTemplateId, lot))
    }, [lotTemplateId, lot])

    useEffect(() => {
        setTotalQuantity(getLotTotalQuantity({ bins }))
    }, [bins])

    useEffect(() => {
        const tempCount = getBinQuantity({bins}, binId)
        setCount(tempCount)
        onSetCount && onSetCount(tempCount)
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
            count={count}
            id={lotId}
            isSelected={false}
            selectable={false}
            onClick={() => {

            }}
            {...rest}
        />
    );
};

LotContainer.propTypes = {
    lotId: PropTypes.string,
    binId: PropTypes.string,
    onSetCount: PropTypes.func
};

LotContainer.defaultProps = {
    lotId: "",
    binId: "",
    enableFlagSelector: false,
    onSetCount: () => {},
};

export default LotContainer;
