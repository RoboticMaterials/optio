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
  //flex: 1;
  //position: relative;

  display: flex;
  align-items: stretch;


  background: ${props => props.theme.bg.primary};
  box-shadow: ${props => props.theme.cardShadow};

  margin: 1.5rem;
  border-radius: 0.5rem;

  overflow-x: scroll;

  //background: red;

  /* Let's get this party started */
  ::-webkit-scrollbar {
    height: 8px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    -webkit-background: rgba(0,0,0,0.1);
    -webkit-border-radius: 10px;
    border-radius: 10px;
    &:hover {
      background: rgba(0,0,0,0.1);
    }
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    // background: rgba(255,255,255,0.2);
  }

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
