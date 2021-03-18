import React from "react";
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";

import ErrorTooltip from '../error_tooltip/error_tooltip';
import * as styled from './list_item_field.style'
import {getMessageFromError} from "../../../../methods/utils/form_utils";
import theme from '../../../../theme'

const ListItemField = (props) => {
	const {
		Container,
		containerStyle,
		ErrorTooltipContainerComponent,
		onMouseEnter,
		onMouseLeave,
		onIconClick,
		onEditClick,
		onTitleClick,
		playDisabled,
		showPlay,
		...rest
	} = props

	const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, validateForm, ...context } = useFormikContext();
	const [field, meta] = useField(rest);
	const {
		value: fieldValue,
		name: fieldName
	} = field

	const {
		name,
		new: isNew,
		changed,
		unsaved
	} = fieldValue

	const {
		touched,
		error
	} = meta

	const hasError = error
	const errorMessage = getMessageFromError(error)

	const edited = changed

	const disabled = hasError || isNew || edited || unsaved || playDisabled


	return (
		<Container
			style={containerStyle}
		>
		<styled.ListItem
			edited={edited}
			error={hasError}
			isNew={isNew || unsaved}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{showPlay &&
				<styled.ListItemIconContainer style={{ width: '15%' }}>
					<styled.ListItemIcon
						disabled={disabled}
						className='fas fa-play'
						onClick={() => {
							if(!disabled) onIconClick()
						}}
					/>
				</styled.ListItemIconContainer>
			}

			{/* <styled.ListItemTitle schema={props.schema} onClick={() => props.onClick(element)}>{element.name}</styled.ListItemTitle> */}
			<styled.ListItemTitle
				schema={'processes'}
				onClick={onTitleClick}
			>
				{name}
			</styled.ListItemTitle>

			<styled.ListItemIconContainer>

				{hasError ?
					<ErrorTooltip
						visible={hasError}
						text={errorMessage}
						// className={"fas fa-exclamation-circle"}
						color={theme.main.error}
						ContainerComponent={ErrorTooltipContainerComponent}
					/>
				:
					(isNew || unsaved) ?
					<ErrorTooltip
						type={'warning'}
						visible={(isNew || unsaved)}
						text={"This route is not saved. Leaving the editor will remove the route."}
						className={"fas fa-exclamation-circle"}
						color={theme.main.warn}
						ContainerComponent={ErrorTooltipContainerComponent}
					/>
					:
						edited &&
						<ErrorTooltip
							type={'warning'}
							visible={edited}
							text={"This route contains unsaved changes. Leaving the editor without saving will undo your changes."}
							className={"fas fa-exclamation-circle"}
							color={theme.main.warn}
							ContainerComponent={ErrorTooltipContainerComponent}
						/>
				}

				<styled.ListItemIcon
					className='fas fa-edit'
					onClick={onEditClick}
					style={{ color: '#c6ccd3' }}
				/>
			</styled.ListItemIconContainer>
		</styled.ListItem>
		</Container>
	);
};

/* *
*
* Returns style for input component
* Accepts hasError prop, which can be used to change styling based on presence of errors
*
* */
const defaultInputStyleFunc = (hasError) => {
	return {
	}
}

// Specifies propTypes
ListItemField.propTypes = {
};

// Specifies the default values for props:
ListItemField.defaultProps = {
	Container: styled.DefaultContainer,
	ErrorTooltipContainerComponent: styled.DefaultErrorTooltipContainerComponent,
	onMouseEnter: () => {},
	onMouseLeave: () => {},
	onIconClick: () => {},
	onEditClick: () => {},
};

export default ListItemField;
