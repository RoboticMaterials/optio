import styled from "styled-components";
import { Draggable } from 'react-smooth-dnd';

export const Container = styled.div`
 
     height: 6rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
        
    background: white;
    border-radius: 0.6rem;
        
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
	padding: 0.5rem 1rem 0.5rem 1rem;
`

export const Count = styled.span`
	font-size: ${props => props.theme.fontSize.sz6};
`

export const FooterBar = styled.div`
	height: 1rem;
	background: ${props => props.theme.bg.septenary};
	display: flex;
	justify-content: flex-end;
	padding: 0 1rem 0 0;
`

export const StyledDraggable = styled(Draggable)`
	.smooth-dnd-ghost .vertical .smooth-dnd-draggable-wrapper {
		background: blue;
		padding: 2rem;
	}
`