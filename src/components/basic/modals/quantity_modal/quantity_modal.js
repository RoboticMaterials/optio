import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import {Formik, useFormik} from 'formik';

import SimpleModal from "../simple_modal/simple_modal";
import NumberField from "../../form/number_field/number_field";

import * as styled from "./quantity_modal.style"
import {getSubmitDisabled} from "../../../../methods/utils/form_utils";

const QuantityModal = (props) => {
	const {
		maxValue,
		minValue,
		handleOnClick2,
		infoText,
		validationSchema,
	} = props

	return (
		<Formik
			initialValues={{
				quantity: maxValue
			}}
			validationSchema={validationSchema}
			validateOnChange={true}
			validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
			validateOnBlur={true}
			onSubmit={(values)=>{
				// alert(JSON.stringify(values, null, 2));
			}} // this is necessary

		>
			{formikProps => {
				const {
					values,
					errors,
					touched
				} = formikProps

				const submitDisabled = getSubmitDisabled(formikProps)

				const {
					quantity = 0
				} = values || {}

				return(
					<SimpleModal
						{...props}
						handleOnClick2={() => {
							handleOnClick2(quantity)
						}}
						button_1_disabled={submitDisabled}
					>

						<styled.InfoText>{infoText}</styled.InfoText>
						<NumberField
							minValue={minValue}
							maxValue={maxValue}
							name={"quantity"}
						/>

					</SimpleModal>
				)
			}}
		</Formik>

	);
};

QuantityModal.propTypes = {

};
QuantityModal.defaultProps = {
	handleOnClick1: () => {}
};



export default QuantityModal;
