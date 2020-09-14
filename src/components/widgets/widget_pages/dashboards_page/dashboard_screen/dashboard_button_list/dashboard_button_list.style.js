import styled from "styled-components";
import {css} from 'styled-components'

export const Container = styled.ul`
	// fill entire container
	width: 100%;
	max-width: 100%;
	max-height: 100%;
	height: 100%;
	
	// allow scroll
	overflow: auto;
	
	padding-left: 1rem;
	padding-right: 1rem;
	
	// hide scroll bar
	::-webkit-scrollbar {
		width: 0px;  /* Remove scrollbar space */
		background: transparent;  /* Optional: just make scrollbar invisible */
	}
	::-webkit-scrollbar-thumb {
		background: #FF0000;
	}
	
`

export const ListContainer = styled.div`
	// full entire container
	width: calc(100% - 8rem);
	max-width: calc(100% - 8rem);
	max-height: calc(100% - 8rem);

	margin-right: 4rem;
	margin-left: 4rem;
	
	// flex layout
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items:center;
	justify-content: center;
`


// overwrite dashboard button container style
export  const ButtonContainerCss = css`
	// large screen style
	
	@media (min-width: ${props => props.theme.widthBreakpoint.mobileL}){
		width: 100%;
		max-width: 100%;
    }
    
    @media (min-width: ${props => props.theme.widthBreakpoint.tablet}){
		width: 45%;
		margin-left: .5rem;
		margin-right: .5rem;
    }
	
`

