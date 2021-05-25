import React, {useEffect, useRef, useState, useContext} from "react";
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";

import ErrorTooltip from '../error_tooltip/error_tooltip';
import * as styled from './field_wrapper.style'
import NumberInput from "../../number_input/number_input";
import TextField from "../text_field/text_field";
import Textbox from "../../textbox/textbox";
import { ThemeContext } from "styled-components";
import { LightenDarkenColor } from '../../../../methods/utils/color_utils'
import CheckboxField from "../checkbox_field/checkbox_field";
import {TEMPLATE_FIELD_KEYS} from "../../../../constants/lot_contants";

const FieldWrapper = (props) => {

	const {
		ContainerComponent,
		children,
		onDeleteClick,
		containerStyle,
		fieldPath
	} = props

	const themeContext = useContext(ThemeContext);

	return (
		<ContainerComponent
			style={containerStyle}
		>
			<styled.CheckItems>
				<styled.Row>
					<CheckboxField
						css={styled.checkboxCss}
						name={`${fieldPath}.${TEMPLATE_FIELD_KEYS.REQUIRED}`}
					/>
					<styled.CheckItemLabel>Require</styled.CheckItemLabel>
				</styled.Row>

				<styled.Row>
					<CheckboxField
						css={styled.checkboxCss}
						name={`${fieldPath}.${TEMPLATE_FIELD_KEYS.SHOW_IN_PREVIEW}`}
					/>
					<styled.CheckItemLabel>Show in cards</styled.CheckItemLabel>
				</styled.Row>
			</styled.CheckItems>

			<styled.LabelContainer>
				<TextField
					placeholder={"Field name..."}
					InputComponent={Textbox}
					name={`${fieldPath}.fieldName`}
					style={{}}
					textboxContainerStyle={{zIndex: 5}}
					inputStyle={{
						fontSize: '1rem',
						flex: 1,
						textAlign: 'center',
						background: LightenDarkenColor(themeContext.bg.secondary, 10)}
					}
				/>
				<styled.DeleteIcon
					onClick={() => {
						onDeleteClick()
					}}
					color={LightenDarkenColor(themeContext.bad, 30)}
					className={"fas fa-trash"}
				/>
			</styled.LabelContainer>

			<styled.FieldComponentContainer>
				{children}
			</styled.FieldComponentContainer>
		</ContainerComponent>
	);
};

// Specifies propTypes
FieldWrapper.propTypes = {

};

// Specifies the default values for props:
FieldWrapper.defaultProps = {
	ContainerComponent: styled.DefaultContainerComponent,
};

export default FieldWrapper;
