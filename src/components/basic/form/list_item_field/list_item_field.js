import React from "react";
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";

import ErrorTooltip from '../error_tooltip/error_tooltip';
import * as styled from './list_item_field.style'

const ListItemField = (props) => {
	const {
		Container,
		containerStyle,
		ErrorTooltipContainerComponent,
		isNew,
		...rest
	} = props

	const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, validateForm, ...context } = useFormikContext();
	const [field, meta] = useField(rest);
	const { touched, error } = meta

	const hasError = touched && error


	return (
		<Container
			style={containerStyle}
		>
		<styled.ListItem
			error={hasError}
			isNew={isNew}
			key={`li-${currIndex}`}
			onMouseEnter={() => {
				if (!selectedTask && !editingTask) {
					dispatchSetSelectedTask(currRoute)
				}

			}}
			onMouseLeave={() => {
				if (selectedTask !== null && !editingTask) {
					dispatchSetSelectedTask(null)
				}
			}}
		>
			<styled.ListItemIconContainer style={{ width: '15%' }}>
				<styled.ListItemIcon
					className='fas fa-play'
					onClick={() => {
						handleExecuteProcessTask(currRouteId)
					}}
				/>
			</styled.ListItemIconContainer>

			{/* <styled.ListItemTitle schema={props.schema} onClick={() => props.onClick(element)}>{element.name}</styled.ListItemTitle> */}
			<styled.ListItemTitle
				schema={'processes'}
				onClick={() => {
					setEditingTask(true)
					dispatchSetSelectedTask(currRoute)
				}}
			>
				{currRouteName}
			</styled.ListItemTitle>

			<styled.ListItemIconContainer>

				<styled.ListItemIcon
					className='fas fa-edit'
					onClick={() => {
						setEditingTask(true)
						dispatchSetSelectedTask(currRoute)
					}}
					style={{ color: '#c6ccd3' }}
				/>

				{isNew &&
				<ErrorTooltip
					visible={isNew}
					text={"This route is not saved. Leaving the editor will remove the route."}
					className={"fas fa-exclamation-circle"}
					color={"yellow"}
					ContainerComponent={ErrorTooltipContainerComponent}
				/>
				}
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
	ErrorTooltipContainerComponent: styled.DefaultErrorTooltipContainerComponent
};

export default ListItemField;
