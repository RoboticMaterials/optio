import styled from 'styled-components';
import {TwitterPicker} from "react-color";
// import "./color_field.css"

export const DefaultContainer = styled.div`
	position: absolute;
	z-index: 0;
`

// ===== Color Selector ===== //
export const ColorPicker = styled.div`
    display: flex;
	flex-grow: 1;
	
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

`

export const StyledTwitterPicker = styled.div`
	&& .twitter-picker {
		background: ${props => props.theme.bg.quinary} !important;
		border-radius: 1rem;
	}
	
	.twitter-picker span {
	}
	
	.twitter-picker div {
		border-radius: .5rem;
	}
	
	div {
		border-radius: .5rem;
	}
	
	twitter-picker {
	}
`


export const ColorButton = styled.button`
    color: black;
	background: white;

`

export const DropdownMenu = styled.div`
`

export const ColorOption = styled.button`
    &:hover {
      background: ${props => props.color};
	}

`
