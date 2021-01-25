import styled from "styled-components";
import { Draggable } from 'react-smooth-dnd';
import {rowCss} from "../card_editor/card_editor.style";

export const Container = styled.div`
 
     height: 6rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
        
    background: white;
    border-radius: 0.6rem;
  	border: 3px solid ${props => props.color};
        
    // margins
    margin: 0 0 0.5rem 0;
        
    // padding
    
    
    outline: none;
    &:focus {
        outline: none;
    }

    letter-spacing: 1.5px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    
    outline: none;
    user-select: none;

    transition: transform 0.2s ease;

    cursor: grab;
    &:active {
        box-shadow: 2px 2px 2px rgba(0,0,0,0.5);
        transform: translateY(-2px);
        cursor: grabbing;
    }
    
    color: black;


    
`

export const ContentContainer = styled.div`
	padding: 0.5rem .25rem 0.5rem .25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const CardName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Count = styled.span`
	// font-size: ${props => props.theme.fontSize.sz6};
`

export const LotName = styled.span`
  font-size: ${props => props.theme.fontSize.sz6};
  //overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FooterBar = styled.div`
	height: fit-content;
	background: ${props => props.theme.bg.septenary};
	// background: ${props => props.color};
	display: flex;
	justify-content: space-between;
	padding: 0 1rem 0 1rem;
  font-size: ${props => props.theme.fontSize.sz4};
`

export const HeaderBar = styled.div`
	height: 1rem;
	background: ${props => props.theme.bg.septenary};
  	//background: ${props => props.color};
	display: flex;
	justify-content: flex-start;
	padding: 0 0rem 0 1rem;
  font-size: ${props => props.theme.fontSize.sz6};
`

export const StyledDraggable = styled(Draggable)`
	.smooth-dnd-ghost .vertical .smooth-dnd-draggable-wrapper {
		background: blue;
		padding: 2rem;
	}
`

export const DatesContainer = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
    width: fit-content;
    
`

export const DateItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	
	&:hover {
		cursor: pointer;
	}
	
`

export const DateArrow = styled.i`
	margin-left: 1rem;
	margin-right: 1rem;
	color: ${props => props.theme.bg.secondary};
`

export const DateText = styled.span`

`