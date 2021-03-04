import styled, { css } from "styled-components";
import {commonClickableIcon, iconButtonCss} from "../../../../../common_css/common_css";

const scrollCss = css`
::-webkit-scrollbar {
        width: 10px;
        height: 5px;
        margin: 1rem;
        background: transparent;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: rgba(175,175,175,0.75);
    }

    ::-webkit-scrollbar-track:hover {
        background: rgba(175,175,175,0.6);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #27272b;
        border-radius: .5rem;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;

    }
`

export const Container = styled.div`
	display: flex;
    flex-direction: row;
    width: 100%;
    padding: .5rem 1rem; 
    background: ${props => props.theme.bg.quaternary};
    border-bottom: 1px solid ${props => props.theme.bg.tertiary};
    z-index: 20;
`

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  //margin-right: 1rem;
  align-self: stretch;
  flex: 1;
  
  ${props => props.css && props.css};
`

export const Description = styled.span`
  color: white;
  margin-bottom: .25rem;
  
  ${props => props.css && props.css};
`



export const ItemContainer = styled.div`
// background: red;
	display: flex;
  position: relative;
  align-self: stretch;
  flex: 1;
  //background: mediumturquoise;
  overflow: hidden;
`

export const FlagsContainer = styled.div`
	display: flex;
  overflow-x: auto;
  flex: 1;
  
  ${scrollCss};
`

export const ArrowContainer = styled.div`
	display: flex;
	flex: 4;
	justify-content: center;
	align-items: center;
`

export const Spacer = styled.div`
	flex: 1;
`

const selectedCss = css`
	background: ${props => props.theme.bg.tertiary};
`

export const FlagButton = styled.button`
	${iconButtonCss};
  	${commonClickableIcon};	
  ${props => props.selected && selectedCss};
`

export const ArrowButton = styled.button`
	${iconButtonCss};
  	${commonClickableIcon};	
  ${props => props.selected && selectedCss};
`

