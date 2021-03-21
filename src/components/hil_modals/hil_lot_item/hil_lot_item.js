import React from 'react';
import PropTypes from 'prop-types';
import LotContainer from "../../side_bar/content/cards/lot/lot_container";
import NumberField from "../../basic/form/number_field/number_field";

import * as styled from "./hil_lot_item.style"

const HilLotItem = (props) => {
	const {
		lotId,
		binId,
		enableFlagSelector,
		processId,
		name
	} = props

	return (
		<styled.Container>
			<LotContainer
				lotId={lotId}
				binId={binId}
				enableFlagSelector={enableFlagSelector}
				processId={processId}
				containerStyle={{flex: 1, marginRight: "5rem"}}
			/>
			<NumberField
				minValue={0}
				name={`${name}.quantity`}
			/>
		</styled.Container>
	);
};

HilLotItem.propTypes = {
	enableFlagSelector: PropTypes.bool,
	lotId: PropTypes.string,
	binId: PropTypes.string,
	processId: PropTypes.string,
};

HilLotItem.defaultProps = {
	enableFlagSelector: false,
	lotId: "",
	binId: "",
	processId: "",
};

export default HilLotItem;
