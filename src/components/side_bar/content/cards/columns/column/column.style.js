import styled, { css } from "styled-components";

const minHeight = "10rem"

export const RotationWrapperOuter = styled.div`
  display: table;
`

export const RotationWrapperInner = styled.div`
  padding: 50% 0;
`

export const RotatedRouteName = styled.span`
  display: block;
  transform-origin: top left;
  transform: rotate(90deg) translate(0, -110%); 
  margin-top: -50%;
  max-width: 20rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

export const TitleContainer = styled.div`
	display: flex;
	flex-direction: column;
`

export const RouteContainer = styled.div`
	display: flex;
	border-bottom: 1px solid black;
	width: 100%;
`

export const StationLabel = styled.span`
    text-align: center;
    font-size: ${props => props.theme.fontSize.sz4};
`

export const BodyContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-height: ${minHeight};
	overflow: hidden;
	background: ${props => props.theme.bg.quaternary};
	opacity: ${props => props.dragEnter ? 0.75 : 1};
	border-bottom-right-radius: 1rem;
	border-bottom-left-radius: 1rem;
	justify-content: center;
`
