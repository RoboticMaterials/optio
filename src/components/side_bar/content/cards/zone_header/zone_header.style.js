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
    flex-grow: 1;
    z-index: 20;
    position: relative;

  @media (max-width: ${props => props.theme.widthBreakpoint.laptop}) {
    flex-direction: column;
    //align-items: center;
    // max-width: 30rem;
  }
`

export const ColumnContainer = styled.div`
  display: flex;
  
  @media (max-width: ${props => props.theme.widthBreakpoint.laptop}) {
    flex-direction: row;
    align-items: center;
    margin: .5rem 0;
  }
  
  ${props => props.css && props.css};
`

export const Description = styled.span`
  color: ${props => props.theme.bg.octonary};
  white-space: nowrap;
  margin-right: 0.5rem;

  @media (max-width: ${props => props.theme.widthBreakpoint.laptop}) {
    margin-right: .5rem;
  }
  
  ${props => props.css && props.css};
`



export const ItemContainer = styled.div`
	display: flex;
	position: relative;
	
	flex: 1;

	@media (max-width: ${props => props.theme.widthBreakpoint.laptop}) {
	  // height: fit-content;
	}
	@media (min-width: ${props => props.theme.widthBreakpoint.laptop}) {
	  // align-self: stretch;
	}
`

export const FlagsContainer = styled.div`
	display: flex;
  overflow-x: auto;
  flex: 1;
  
  ${scrollCss};
`

export const rotateButtonContainerCss = css`
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
`

export const rotateButtonIconCss = css`
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
	background: ${props => props.theme.bg.secondary};
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

