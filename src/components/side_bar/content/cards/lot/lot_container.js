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
        containerStyle,
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
        flags,
        process_id: processId
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
        setCount(getBinQuantity({bins}, binId))
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
            containerStyle={{width: '80%', margin: '.5rem auto .5rem auto', ...containerStyle}}
        />
    );
};

LotContainer.propTypes = {
    lotId: PropTypes.string,
    binId: PropTypes.string
};

LotContainer.defaultProps = {
    lotId: "",
    binId: "",
    enableFlagSelector: false,
};

export default LotContainer;
