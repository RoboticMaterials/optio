import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";
import DropDownSearch from '../../drop_down_search_v2/drop_down_search';
// import {globStyle} from '../../../../global_style'
import { getMessageFromError } from "../../../../methods/utils/form_utils";

// import styles
import * as styled from './drop_down_search_field.style'
import ErrorTooltip from "../error_tooltip/error_tooltip";
import {isEmpty} from "ramda";


const DropDownSearchField = ({
								 fieldLabel,
								 LabelComponent,
								 ItemComponent,
								 ContentComponent,
								 ErrorComponent,
								 onDropdownClose,
								 onChange,
								 FieldContentContainer,
								 FieldDropdownContainer,
								 Container,
								 style,
								 ...props
							 }) => {

	const { setFieldValue, setFieldTouched } = useFormikContext();
	const [field, meta] = useField(props);
	const hasError = meta.touched && meta.error;

	let ReactDropdownSelectStyle = {
		borderColor: hasError && 'red',
		boxShadow: hasError && `0 0 5px red`,
	}

	// console.log("DropDownSearchField Container", Container)
	// console.log("DropDownSearchField props", props)


	const errorMessage = getMessageFromError(meta.error);

	return (
		<Container>
			{fieldLabel &&
			<LabelComponent>{fieldLabel}</LabelComponent>
			}

			<styled.DefaultFieldContentContainer>
				{/*<style.DefaultFieldDropdownContainer>*/}
				<DropDownSearch
					onBlur={()=>{}}
					style={{ReactDropdownSelectStyle, ...style}}
					theme={props.theme}
					ItemComponent={ItemComponent}
					ContentComponent={ContentComponent}
					onDropdownClose={()=>{
						// set this field to touched if not already
						const isTouched = meta.touched;
						if(!isTouched) {
							setFieldTouched(field.name, true)
						}

						// call any additional function that was passed as prop
						onDropdownClose && onDropdownClose();
					}}
					values={field.value ? field.value: []}
					{...field}
					{...props}
					onChange={values => {
						setFieldValue(field.name, values);
						onChange && onChange(values)
					}}
					onRemoveItem={
						()=> {
							// set this field to touched if not already
							const isTouched = meta.touched;
							if(!isTouched) {
								setFieldTouched(field.name, true)
							}
							setFieldValue(field.name, "");

						}
					}

					onClearAll={()=>setFieldValue(field.name, "")}
				/>
				{/*</style.DefaultFieldDropdownContainer>*/}

				<ErrorTooltip
					visible={hasError}
					text={errorMessage}
					ContainerComponent={styled.IconContainerComponent}
				/>
			</styled.DefaultFieldContentContainer>
			{/*
			{meta.touched && meta.error ? (
				<ErrorComponent className="error">{Object.values(meta.error)}</ErrorComponent>
			) : null}
			*/}

		</Container>
	);
};

// Specifies propTypes
DropDownSearchField.propTypes = {
	LabelComponent: PropTypes.elementType,
	FieldDropdownContainer: PropTypes.elementType,
	FieldContentContainer: PropTypes.elementType,
	style: PropTypes.object,
};

// Specifies the default values for props:
DropDownSearchField.defaultProps = {
	LabelComponent: styled.TitleContainer,
	FieldDropdownContainer: styled.DefaultFieldDropdownContainer,
	FieldContentContainer: styled.DefaultFieldContentContainer,
	Container: styled.DefaultContainer,
	onChange: null,
	style: {}
};

export default DropDownSearchField;
