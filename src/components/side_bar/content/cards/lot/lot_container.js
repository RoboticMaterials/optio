import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Lot from "./lot";
import {useSelector} from "react-redux";

const LotContainer = (props) => {

    const {
        lotId,
        binId,
        enableFlagSelector
    } = props

    const cards = useSelector(state => { return state.cardsReducer.cards }) || {}

    const [lot, setLot] = useState()
    useEffect(() => {

    }, [cards, lotId])

    return (
        <Lot
            templateValues={templateValues}
            totalQuantity={totalQuantity}
            lotNumber={lotNumber}
            processName={processName}
            flags={flags || []}
            enableFlagSelector={enableFlagSelector}
            name={name}
            start_date={start_date}
            end_date={end_date}
            objectName={objectName}
            count={count}
            id={cardId}
            isSelected={false}
            selectable={false}
            onClick={() => {

            }}
            containerStyle={{ marginBottom: "0.5rem" }}
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
