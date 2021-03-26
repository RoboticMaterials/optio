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



export const Body = styled.div`
	display: flex;
	flex: 1;
  //width: 100%;
	// max-width: 50%;
	overflow: hidden;
	position: relative;
	
	
	background: ${props => props.theme.bg.secondary};
  box-shadow: inset 2px 2px 4px 1px rgba(0, 0, 0, 0.1);
`

export const CardZoneContainer = styled.div`
	//overflow: hidden;
  overflow: auto;
  flex: 1;
  //height: 40rem;
  //height: 100%;
  position: relative;
  //padding: 1rem;
	//width: 100%;
	//height: 100%;

  // border: 1px solid green;
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







