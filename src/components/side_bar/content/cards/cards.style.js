import styled from 'styled-components'
import {Calendar} from "react-calendar";
// import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import '../../../../index.css';
export const Container = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    flex: 1;
    overflow:hidden;
    font-style: ${props => props.theme.font.primary};
`

// HEADER
export const Header = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 1rem;
	background: ${props => props.theme.bg.quinary};
`

export const Body = styled.div`
	display: flex;
	flex: 1;
  //width: 100%;
	// max-width: 50%;
	overflow: hidden;
	position: relative;
	
	
	background: ${props => props.theme.bg.tertiary};
`

export const CardZoneContainer = styled.div`
	overflow: auto;
  flex: 1;
	//width: 100%;
	//height: 100%;
`

export const MenuButton = styled.i`
	font-size: 2rem;
	padding: 0;
	margin: 0;
`

export const Title = styled.span`
	font-size: ${props => props.theme.fontSize.sz2};
	color: white;
	font-weight: ${props => props.theme.fontWeight.bold};
`

export const AddCardButton = styled.button`

`



// LIST
export const RoutesListContainer = styled.div`
    background: green;
    
    width: 100%;
    overflow: scroll;
    
    
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: flex-start;
    
    padding: 1rem;
    padding-right: 5rem;
    padding-bottom: 5rem;
`







