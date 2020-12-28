import styled, { css } from "styled-components";
import {Container} from "react-smooth-dnd";

// export const RouteContainer = styled.div`
//     display: flex;
//     flex: 1;
//     flex-direction: column;
//     background: yellow;
// `

const minHeight = "10rem"
export const RotatedRouteName = styled.span`
// background: red;
	transform: rotate(-90deg);
	// transform: translateY(50%);
`


export const StationContainerCss = css`
	
`

export const StationContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: ${minHeight};
    
    width: ${props => props.isCollapsed ? "2rem" : props.maxWidth};
    max-width: ${props => props.isCollapsed ? "2rem" : props.maxWidth};
    min-width: ${props => props.isCollapsed ? "2rem" : props.maxWidth};
    margin-right: 1rem;
    max-height: ${props => props.maxHeight};
    
    border-radius: 1rem;
    overflow: hidden;
    
    color: ${props => props.theme.bg.octonary};
`

export const StationHeader = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    background: ${props => props.theme.bg.quinary};
 
   
`

export const HeaderContent = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
 
 
`


export const TitleContainer = styled.div`
	display: flex;
	flex-direction: column;
`



export const RouteContainer = styled.div`
	display: flex;
	border-bottom: 1px solid black;
	width: 100%;
`

export const LabelContainer = styled.div`
	display: flex;
	align-items: center;
	// justify-content: space-between;
`

export const StationLabel = styled.span`
    text-align: center;
    font-size: ${props => props.theme.fontSize.sz4};
`

export const StationTitle = styled.span`
    text-align: center;
    font-size: ${props => props.theme.fontSize.sz3};
`



export const StationButton = styled.button`

`

export const BodyContainer = styled.div`
	display: flex;
	flex-direction: column;
	// flex: 1;
	min-height: ${minHeight};
	overflow: hidden;
	background: ${props => props.theme.bg.quaternary};
	opacity: ${props => props.dragEnter ? 0.75 : 1};
	border-bottom-right-radius: 1rem;
	border-bottom-left-radius: 1rem;
	justify-content: center;
`
