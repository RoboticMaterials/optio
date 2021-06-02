import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import LotContainer from "../../../../../../side_bar/content/cards/lot/lot_container";
import {FINISH_BIN_ID} from "../../../../../../../constants/lot_contants";
import NumberField from "../../../../../../basic/form/number_field/number_field";
import {Formik} from "formik";
import * as styled from './select_lot_quantity.style'
import {getBinQuantity} from "../../../../../../../methods/utils/lot_utils";
import Button from "../../../../../../basic/button/button";
import PageSelector from "../../../../../../basic/page_selector/page_selector";
import {selectLotQuantitySchema} from "../../../../../../../methods/utils/form_schemas";

import * as sharedStyles from '../merge_modal.style'
import {isEmpty} from "../../../../../../../methods/utils/object_utils";

const SelectLotQuantity = (props) => {

	const {
		selectedLots,
		stationId,
		onSubmit,
		initialIndex,
		initialValues
	} = props

	const formRef = useRef(null)
	const {
		submitForm,
		errors,
	} = formRef?.current || {}

	const [currentLotIndex, setCurrentLotIndex] = useState(initialIndex ? initialIndex : 0)
	const [currentLot, setCurrentLot] = useState({})
	const [maxQuantity, setMaxQuantity] = useState(0)

	useEffect(() => {
		let tempCurrentLot = selectedLots[currentLotIndex]
		setCurrentLot(tempCurrentLot)

		setMaxQuantity(getBinQuantity(tempCurrentLot, stationId))
		return () => {};
	}, [selectedLots, currentLotIndex]);

	return (
		<Formik
			innerRef={formRef}
			initialValues={{
				items: selectedLots.map(lot => {
					const initialOption = initialValues.find(item => item.lotId === lot._id)
					const quantity = initialOption?.quantity || 0
					return {lotId: lot._id, quantity: quantity}
				})
			}}
			validationSchema={selectLotQuantitySchema}
			onSubmit={(values, formikHelpers) => {
				onSubmit(values.items)
			}}
		>
			<styled.Container>
				<styled.Column>
					<LotContainer
						lotId={currentLot?._id}
						binId={stationId}
						enableFlagSelector={false}
						containerStyle={{marginBottom: '1rem'}}
					/>
					<NumberField
						name={`items[${currentLotIndex}].quantity`}
						maxValue={maxQuantity}
					/>
				</styled.Column>

				<sharedStyles.Footer>
				{/*<styled.Column>*/}
					<Button
						disabled={!isEmpty(errors)}
						onClick={() => {
							 submitForm()
						}}
						label={'Review'}
					/>

					<PageSelector
						value={currentLotIndex + 1}
						onBack={() => {
							if(currentLotIndex > 0) setCurrentLotIndex(currentLotIndex - 1)
						}}
						onForward={() => {
							if(currentLotIndex < selectedLots.length - 1) setCurrentLotIndex(currentLotIndex + 1)
						}}
						maxValue={selectedLots.length}
					/>
				{/*</styled.Column>*/}
				</sharedStyles.Footer>
			</styled.Container>
		</Formik>
	);
};

SelectLotQuantity.propTypes = {

};

SelectLotQuantity.defaultProps = {

};

export default SelectLotQuantity;
