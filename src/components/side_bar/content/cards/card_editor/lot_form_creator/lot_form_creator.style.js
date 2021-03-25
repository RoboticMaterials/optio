import styled from "styled-components";
import {Container} from "react-smooth-dnd";

export const RowContainer = styled.div`
	display: flex;
  
  	//flex: 1;
  	//align-self: stretch;
  //background: cyan;
  align-items: center;
  
  
  
  //padding: .5rem;
  
  
	// margin-bottom: 1rem;
`

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const ExtraStyledContainer = styled.div`
  && .smooth-dnd-container {
    background: ${props => props.theme.bg.quinary} !important;
    border-radius: 1rem;
  }

`