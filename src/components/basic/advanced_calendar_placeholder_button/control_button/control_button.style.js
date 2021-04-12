import styled from "styled-components"
import * as buttonCss from "../../../../common_css/button_css";

export const Container = styled.button`
	${buttonCss.buttonCss}
	background: ${props => props.theme.bg.tertiary};
	padding: .1rem .5rem;
	border-radius: .4rem;
	margin: 0 1rem;
  border: 1px solid rgba(0,0,0,0);
  
  color: ${props => props.theme.textColor};
`

export const Content = styled.span`
	
`
