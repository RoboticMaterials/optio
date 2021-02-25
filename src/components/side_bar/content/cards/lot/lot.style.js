import styled, {css} from "styled-components";
import { Draggable } from 'react-smooth-dnd';
import {rowCss} from "../card_editor/lot_editor.style";
import * as commonCss from "../../../../../common_css/common_css";
import {commonClickableIcon, commonIcon, iconButtonCss} from "../../../../../common_css/common_css";

export const Container = styled.div`
 
     height: fit-content;
  

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
        
    background: white;
    border-radius: 0.6rem;
  	border: 3px solid ${props => props.color};
  
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

  &:hover {
    box-shadow: 2px 2px 2px rgba(0,0,0,0.5);
    transform: translateY(-2px);
    cursor: grabbing;
  }
    
    color: black;
  
  ${props => props.selectable && (props.isSelected ? selectedCss : notSelectedCss)};
  ${props => props.containerStyle};
`

const selectedCss = css`
	${commonCss.goodGlow};

  &:active {
    ${commonCss.goodGlow};
    transform: translateY(-2px);
    cursor: grabbing;
  }

  &:hover {
    ${commonCss.goodGlow};
    transform: translateY(-2px);
    cursor: grabbing;
  }
`

const notSelectedCss = css`
  filter: contrast(70%);
`

export const Row = styled.div`
    display: flex;
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.bg.quaternary};
    justify-content: space-between;
    padding: .25rem 0 .25rem 0;
`

export const ContentContainer = styled.div`
	padding: 0.5rem .25rem 0rem .25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const NameContainer = styled.div`
	display: flex;
  flex-direction: column;
`

export const CardName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: ${props => props.theme.fontSize.sz3};
`

export const LotNumber = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${props => props.theme.fontSize.sz4};
  font-weight: 300;
`




export const Count = styled.span`
	font-size: ${props => props.theme.fontSize.sz4};
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

const notSelectedFlagCss = css`
    filter: contrast(20%);
    filter: brightness(50%);
`

export const FlagButton = styled.button`
	${iconButtonCss};
  	${commonClickableIcon};
  	margin: 0 1rem;
  	
  	${props => !props.selected && notSelectedFlagCss};
`




export const FlagsContainer = styled.div`
    display: flex;
    padding: 1rem 2rem;
    align-items: center;
    justify-content: center;
    
`

export const HeaderBar = styled.div`
	height: fit-content;
	background: ${props => props.theme.bg.septenary};
  	//background: ${props => props.color};
	display: flex;
	justify-content: space-between;
	padding: 0 0rem 0 1rem;
  align-items: center;
  font-size: ${props => props.theme.fontSize.sz3};
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
	margin-left: .35rem;
	margin-right: .35rem;
	color: ${props => props.theme.bg.secondary};
`

export const DateText = styled.span`

font-size: ${props => props.theme.fontSize.sz4};

`

export const Label = styled.span`
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 600;
`