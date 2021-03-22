import styled, {css} from 'styled-components'
import {hexToRGBA, RGB_Linear_Shade, LightenDarkenColor} from "../../../methods/utils/color_utils";

const activeStyle = css`
	box-shadow: none;
	transform: translateY(0px);
	color:  ${props => RGB_Linear_Shade(-0.1, hexToRGBA(props.color))};
	background-color:  ${props => RGB_Linear_Shade(-0.1, hexToRGBA(props.backgroundColor))};
`

const hoverStyle = css`
	box-shadow: 0px 5px 2px -2px rgba(0, 0, 0, 0.3);
	transform: translateY(-1px);
	color:  ${props => RGB_Linear_Shade(0.01, hexToRGBA(props.color))};
	background-color:  ${props => RGB_Linear_Shade(0.01, hexToRGBA(props.backgroundColor))};
`

export const Container = styled.button`
  width: ${props => props.width};
  height: ${props => props.height};
  color: ${props => props.theme.fg.red};
  
  // flex layout
  display: flex;
  flex-direction: column;
  align-items: center;
	
  // margins
  margin: 0;
  
  outline: none;
  &:focus {
	outline: none;
  }
  
	border: thin solid ${props => props.theme.bg.secondary};
	border-radius: .5rem;
	// box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
	transition: all 0.2s ease 0s;
	cursor: pointer;
	outline: none;
	
  
  
  &:hover {
	${props => props.hoverable && hoverStyle}
  }
  
  &:active {
	${props => props.clickable && activeStyle}
  }
  
//   ${props=> props.active && activeStyle}
  
  &:focus {
    outline: none;
  }
  
  ${props => props.disabled &&
	{
		// backgroundImage: `linear-gradient(to bottom right, grey, white)`,
		pointerEvents: "none",
	}
	
	
}
  
	background-color: ${props => LightenDarkenColor(props.theme.bg.secondary,20)};
	padding: .5rem;
`
