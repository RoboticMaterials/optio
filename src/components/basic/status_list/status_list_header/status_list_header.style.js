import styled, {css} from "styled-components"
import {columnRowLayout, headerStyle} from "../../../../common_css/layout";

export const Container = styled.div`
  	${columnRowLayout};
  	${headerStyle};
  	min-height: 5rem;
  	display: flex;
  	justify-content: center;
  	align-items: center;
`

export const Title = styled.h1`
	font-size: ${props => props.theme.fontSize.sz2};
	font-size: ${props => props.theme.fontWeight.bold};
	color: white;
`