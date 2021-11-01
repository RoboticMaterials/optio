import styled from "styled-components";
import {Container} from "react-smooth-dnd";
import { hexToRGBA, LightenDarkenColor } from '../../../../../../methods/utils/color_utils'

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

export const ColumnFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
	background: ${props => props.theme.bg.primary};
	box-shadow: 2px 1px 5px 1px rgba(0,0,0,0.2);
	padding: 0.2rem 1rem 1rem 1rem;
	border: 0.1rem solid ${props => props.theme.bg.primary};
	border-radius: .5rem;
  flex: 1;

	&:hover {
		border-bottom: 0.1rem solid ${props => props.theme.bg.quinary};
	}
`

export const FieldName = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  font-family: ${props => props.theme.font.primary};
  justify-content: start;
  padding: 0rem 0.5rem 0.5rem 0.2rem;
`


export const ExtraStyledContainer = styled.div`
  && .smooth-dnd-container {
    background: ${props => props.theme.bg.quinary} !important;
    border-radius: 1rem;
  }

`
