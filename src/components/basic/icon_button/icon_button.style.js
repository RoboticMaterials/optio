import styled, {css} from 'styled-components'
import {hexToRGBA, RGB_Linear_Shade} from "../../../methods/utils/color_utils";

const activeContainerStyle = css`
	color:  ${props => RGB_Linear_Shade(-0.1, hexToRGBA(props.color))};
`

const hoverContainerStyle = css`
	color:  ${props => RGB_Linear_Shade(0.5, hexToRGBA(props.color))};
`

const focusContainerStyle = css`
	outline: none;
`

const disabledContainerStyle = css`
	pointer-events: none;
`



export const Container = styled.button`
	width: ${props => props.width};
	height: ${props => props.height};
	color: ${props => props.color};
	
	// flex layout
	display: flex;
	flex-direction: column;
	align-items: center;
	
	border: none;
	transition: all 0.2s ease 0s;
	cursor: pointer;
	outline: none;
	background-color: transparent;
	margin: 0;
	padding: 0;
	
	&:focus {
		${focusContainerStyle};
	}
	
	&:hover {
		${props => props.hoverable && hoverContainerStyle};
	}
	// also allow enabling hover style via props
	${props=> props.isHovering && hoverContainerStyle};
	
	&:active {
		${props => props.clickable && activeContainerStyle};
	}
	// also allow enabling active style via props
	${props=> props.isActive && activeContainerStyle};
	
	// disabled style
	${props => props.disabled && disabledContainerStyle};
	
`
