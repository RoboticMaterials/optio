import styled, {css} from "styled-components"
import {columnRowLayout, headerStyle} from "../../../../common_css/layout";

export const Container = styled.div`
	background: ${props => props.theme.bg.secondary};
	box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
	align-items: center;
	display: flex;
	flex-direction: row;
	padding: 0 1rem;
`

export const CloseIcon = styled.i`
    font-size: 1.4rem;
    margin: 2rem;
    color: ${props => props.theme.bg.quaternary};
    cursor: pointer;
	
`

export const Title = styled.h1`
	font-size: ${props => props.theme.fontSize.sz2};
	font-weight: ${props => props.theme.fontWeight.bold};
	font-family: ${props => props.theme.font.primary};
	color: ${props => props.theme.bg.octonary};
	flex-grow: 1;
	text-align: center;
`