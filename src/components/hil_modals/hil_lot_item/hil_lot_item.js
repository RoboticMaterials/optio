import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import LotContainer from "../../side_bar/content/cards/lot/lot_container";
import NumberField from "../../basic/form/number_field/number_field";

import * as styled from "./hil_lot_item.style"
import {getBinQuantity} from "../../../methods/utils/lot_utils";
import {QUANTITY_MODES} from "../hil_modals";

const HilLotItem = (props) => {
	const {
		lotId,
		binId,
		enableFlagSelector,
		processId,
		name,
		selectedQuantity,
		onQuantityClick,
		quantityMode,
		fraction,
	} = props

	const [count, setCount] = useState(0)


	console.log("fractionfraction",fraction)
	return (
		<styled.Container>
			<LotContainer
				onSetCount={(val) => setCount(val)}
				lotId={lotId}
				binId={binId}
				enableFlagSelector={enableFlagSelector}
				processId={processId}
				containerStyle={{flex: 1, marginRight: "5rem"}}
			/>
			<styled.QuantityItem
				onClick={onQuantityClick}
			>
				{selectedQuantity}
			</styled.QuantityItem>
		</styled.Container>
	);
};

HilLotItem.propTypes = {
	enableFlagSelector: PropTypes.bool,
	lotId: PropTypes.string,
	binId: PropTypes.string,
	processId: PropTypes.string,
	onQuantityClick: PropTypes.func,
	quantityMode: PropTypes.string
};

HilLotItem.defaultProps = {
	enableFlagSelector: false,
	lotId: "",
	binId: "",
	processId: "",
	onQuantityClick: () => {},
	quantityMode: ""
};

export default HilLotItem;
