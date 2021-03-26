import styled from "styled-components"
import * as commonCss from "../../../../../common_css/layout"


export const Container = styled.div`
	display: flex;
	align-self: stretch;
	align-items: center;
	padding: .5rem 1rem;
	
	background: ${props => props.theme.bg.primary};
`