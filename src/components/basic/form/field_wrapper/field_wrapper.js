import React, {useEffect, useRef, useState} from "react"

// components internal
import TextField from "../text_field/text_field"
import Textbox from "../../textbox/textbox"

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from './field_wrapper.style'

const FieldWrapper = (props) => {

	const {
		ContainerComponent,
		children,
		onDeleteClick,
		containerStyle,
		name
	} = props

	const [updateColor, setUpdateColor] = useState(false)

	useEffect( () => {
		const timeout = setTimeout(() => {
			setUpdateColor(true)
		}, 200)

		return () => {
			clearTimeout(timeout)
		}
	}, [])

	return (
		<ContainerComponent
			updateColor={updateColor}
			style={containerStyle}
		>
			<styled.LabelContainer updateColor={updateColor}>
				<TextField
					placeholder={"Field name..."}
					InputComponent={Textbox}
					name={name}
					style={{flex: 1, textOverflow: "clip"}}
					inputStyle={{flex: 1, textOverflow: "clip"}}
					// textboxContainerStyle={{zIndex: 5, width: "fit-content"}}
				/>
			</styled.LabelContainer>

			<styled.FieldComponentContainer updateColor={updateColor}>

				{children}

				<styled.DeleteIcon
					onClick={() => {
						onDeleteClick()
					}}
					color={"#EC0000"}
					className={"fas fa-trash"}
				/>

				{/*<styled.StyleContainer>*/}
				{/*	<styled.AlignIcon color={"black"} className="fas fa-align-left"></styled.AlignIcon>*/}
				{/*	<styled.AlignIcon color={"black"} className="fas fa-align-justify"></styled.AlignIcon>*/}
				{/*	<styled.AlignIcon color={"black"} className="fas fa-align-right"></styled.AlignIcon>*/}
				{/*</styled.StyleContainer>*/}


			</styled.FieldComponentContainer>



			{/*<styled.DeleteContainer updateColor={updateColor}>*/}

			{/*</styled.DeleteContainer>*/}
			{/*<i className=""></i>*/}


		</ContainerComponent>
	)
}

// Specifies propTypes
FieldWrapper.propTypes = {
	name: PropTypes.string
}

// Specifies the default values for props:
FieldWrapper.defaultProps = {
	ContainerComponent: styled.DefaultContainerComponent,
}

export default FieldWrapper
