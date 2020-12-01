import styled from "styled-components";

export const Container = styled.div`

	overflow: hidden;
	position: relative;
	height: 100%;
	flex: 1;
	min-height: 100%;
	max-height: 100%;
	transition: all 2s ease;
`

export const ProcessesContainer = styled.div`

	overflow: hidden;
	// background: green;
	position: relative;
	height: 100%;
	flex: 1;
	// min-height: 100%;
	// max-height: 100%;
	transition: all 2s ease;
`

export const CardZoneContainer = styled.div`
	border: 1px solid ${props => props.theme.bg.quinary};
	display: flex;
	align-items: center;
	border-radius: 1rem; 
	padding: 1rem;
	margin-bottom: 8rem;
	width: fit-content;
	// height: auto;
	// min-height: 20rem;
	
	position: relative;
`

export const ProcessName = styled.span`
	font-size: ${props => props.theme.fontSize.sz4};
	color: white;
	font-weight: ${props => props.theme.fontWeight.bold};
	z-index: 200;
	display: inline-flex;
	align-items: center;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1;
	white-space: nowrap;
`

export const ProcessNameContainer = styled.div`
	max-width: 125px;
	min-width: 125px;
	width: 125px;
	transition: all 1s ease;
	position: absolute;
	top: ${props => props.positionY +"px"};
	left: 12.5px;
	padding: .1rem .25rem .1rem .25rem;
	border-radius: 1rem;
	height: 3rem;
	transform: translateY(-50%);
	z-index: 20;
	background: ${props => props.theme.bg.quinary};
	overflow: hidden;
	margin: 5rem 0 5rem 0;
	
	display: flex;
	justify-content: space-between;
	align-items: center;
	
	
	transition: all .5s ease;
	border: 1px solid black;
	
	
	overflow: hidden;
   text-overflow: ellipsis;
   // display: -webkit-box;
   -webkit-line-clamp: 1; /* number of lines to show */
   // -webkit-box-orient: vertical;
   white-space: nowrap;
`

export const ProcessesList = styled.div`
	// background: blue;
	background: ${props => props.theme.bg.quaternary};
	width: 150px;
	height: 100%;
	zIndex: 500;
	overflow: hidden;
`