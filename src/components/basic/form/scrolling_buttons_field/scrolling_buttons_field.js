import React from "react";
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";

import ErrorTooltip from '../error_tooltip/error_tooltip';
import * as styled from './scrolling_buttons_field.style'

import log from "../../../../logger";
const logger = log.getLogger("ScrollingButtonField");

const ScrollingButtonField = ({
						valueKey,
						labelKey,
						onBlur,
						onFocus,
						onChange,
						ErrorTooltipContainerComponent,
						options,
						...props }) => {

	// get formik data
	const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, validateForm, ...context } = useFormikContext();
	const [field, meta] = useField(props);

	// extract field data
	const {
		value: fieldValue,
		name: fieldName
	} = field

	// extract meta data
	const { touched, error } = meta

	// does the field contain an error?
	const hasError = touched && error

	return (
		<div style={{position: "relative"}}>
			<ErrorTooltip
				visible={hasError}
				text={error}
				ContainerComponent={ErrorTooltipContainerComponent}
			/>
			<styled.ProcessOptionsContainer
				hasError={hasError}
			>
				{options

					// each option must contain value and label - filter out any that don't
					.filter((currOption) => {
						const {
							[valueKey]: currValue = null,
							[labelKey]: currLabel = null
						} = currOption

						if(currValue && currLabel) {
							return true
						}
						else {
							// give warning to developer that item is missing parameter(s)
							if(!currValue) logger.warn("Option is missing value")
							if(!currLabel) logger.warn("Option is missing label")

							return false
						}
					})

					// map remaining options content
					.map((currOption) => {

					const {
						[valueKey]: currValue = "",
						[labelKey]: currLabel = ""
					} = currOption

					return (
						<styled.ProcessOption
							key={currValue}
							onClick={() => {
								setFieldValue(fieldName, currValue)
							}}
							isSelected={currValue === fieldValue}
							containsSelected={fieldValue}
						>
							<styled.ProcessName>{currLabel}</styled.ProcessName>
						</styled.ProcessOption>
					)
				})}
			</styled.ProcessOptionsContainer>
		</div>
	);
};

// Specifies propTypes
ScrollingButtonField.propTypes = {
	ErrorTooltipContainerComponent: PropTypes.elementType
};

// Specifies the default values for props:
ScrollingButtonField.defaultProps = {
	ErrorTooltipContainerComponent: styled.ErrorTooltipContainerComponent
};

export default ScrollingButtonField;
