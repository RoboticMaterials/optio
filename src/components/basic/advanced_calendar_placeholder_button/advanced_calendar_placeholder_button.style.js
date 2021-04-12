import styled from "styled-components"
import * as buttonCss  from "../../../common_css/button_css";

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
  
`


export const ControlsContainer = styled.div`
	display: flex;
	border-bottom-left-radius: .2rem;
	border-bottom-right-radius: .2rem;
	padding: .25rem .5rem;
	background: ${ props => props.theme.bg.quaternary};
`

