import styled from "styled-components";
import {Container} from "react-smooth-dnd";
import { hexToRGBA, LightenDarkenColor } from '../../../../../../methods/utils/color_utils'

export const RowContainer = styled.div`
	display: flex;
	flex-direction: row;
  align-items: center;

`

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const DropDownContainer = styled.div`
	width: 50%;
	margin-left: 1.5rem;
	margin-bottom: 2rem;
	margin-top: 1.2rem;
`

export const FieldRowContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const ComponentOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
	background: ${props => props.theme.bg.primary};
	padding: 0.5rem;
	border-radius: 0.5rem;
	margin-right: 1rem;
	box-shadow: 2px 1px 5px 1px rgba(0,0,0,0.2);
	z-index: 10000;

	&:hover {
		cursor: pointer;
		transform: translateY(-4px)
	}
`
export const DropContainer = styled.div`
	width: ${props => props.divWidth};
  height: ${props => props.divHeight};
	margin: 1.1rem;
	background: ${props => props.theme.bg.secondary};
	border: 0.1rem solid ${props => props.theme.bg.primary};
	border-radius: .5rem;

`
export const FieldColumn = styled.div`
	width: 50%;
  height: 4rem;
	margin-left: 1rem;
	margin-right: 1rem;
	background: ${props => props.theme.bg.secondary};
	border: 0.1rem solid ${props => props.theme.bg.primary};
	border-radius: .5rem;
`

export const ColumnFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
	min-height: 7rem;
	background: ${props => props.theme.bg.primary};
	box-shadow: 2px 1px 5px 1px rgba(0,0,0,0.2);
	padding: 0.4rem .4rem 1rem 1rem;
	border: 0.1rem solid ${props => props.theme.bg.primary};
	border-left: ${props => !!props.selected && '0.4rem solid #924dff'};
	border-radius: .5rem;
	margin: .1rem;
  flex: 1;

	&:hover {
		box-shadow: ${props => !props.selected && '3px 2px 5px 2px rgba(0,0,0,0.2)'};
		cursor: ${props => !props.selected && 'pointer'}
	}
`

export const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
	background: transparent;
	border: 0.1rem solid ${props => props.theme.bg.primary};
	border-left: ${props => !!props.selected && '0.4rem solid #924dff'};
	border-radius: .5rem;
	justify-content: start;

`

export const FieldName = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  font-family: ${props => props.theme.font.primary};
  justify-content: start;
  padding: 0rem 0.5rem 0.5rem 0.2rem;
	z-index: 1;
`

export const ExtraStyledContainer = styled.div`
  && .smooth-dnd-container {
    background: ${props => props.theme.bg.quinary} !important;
    border-radius: 1rem;
  }

`
