import styled, { css } from "styled-components";
import {commonClickableIcon, iconButtonCss} from "../../../../../common_css/common_css";

// the margin bottom is needed for items in a flex-wrap container in order to maintain spacing when wrapped.
// don't change unless you adjust everything else accordingly...
const flexItemCss = css`
  margin-bottom: 1rem;
`

// the margin bottom is necessary for spacing when wrapped. Don't change unless you know what you're doing...
const flexContainerCss = css`
	margin-bottom: -1rem;
	flex-wrap: wrap;
`

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

export const SortFilterContainer = styled.div`
	flex: 1;
	display: flex;
	flex-wrap: wrap;
`

export const Container = styled.div`
  ${flexContainerCss}; // uses flex-wrap. Don't change unless you know what you're doing...
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  z-index: 20;
  position: relative;
  flex-direction: row;
  align-items: flex-end;
`

export const ColumnContainer = styled.div`
  display: flex;
  margin-right: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  background: ${props => props.theme.bg.secondary};
  padding: .25rem 1rem 0 1rem;
  border-radius: .4rem;
  
  height: fit-content;
  
  
  
  margin-bottom: 1rem;
  
`

export const ExpandContractIcon = styled.button`
	${iconButtonCss};
  margin-right: .5rem;
  color: ${props => props.theme.textColor};
`

export const Description = styled.span`
  color: ${props => props.theme.textColor};
  white-space: nowrap;
  ${props => props.css && props.css};
  font-size: ${props => props.theme.fontSize.sz4};
  //margin-bottom: .25rem;
`

export const ContentContainer = styled.div`
  display: flex;
  position: relative;
  height: fit-content;
  align-items: center;
  flex: 1;
  align-self: stretch;
  margin-top: .25rem;
  margin-bottom: -1rem;
`



export const OptionContainer = styled.div`
	${flexItemCss};	// this element is used in flex-wrap containers - don't remove unless you adjust everything else accordingly...
	align-self: stretch;
	display: flex;
	align-items: center;
`

// the margin bottom is needed for flex-wrap spacing. Don't change unless you adjust everything else accordingly...
export const ItemContainer = styled.div`
	${flexItemCss};	// this element is used in flex-wrap containers - don't remove unless you adjust everything else accordingly...
	display: flex;
	align-items: center;
  flex: 1;
	
	@media (max-width: ${props => props.theme.widthBreakpoint.laptop}) {
		flex-wrap: wrap;
	}
  
  
`

export const FlagsContainer = styled.div`
	display: flex;
  overflow-x: auto;
  flex: 1;
  
  ${scrollCss};
`

export const rotateButtonContainerCss = css`
  border-top-right-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
  box-shadow: 0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1);
  background: ${props => props.theme.bg.tertiary};
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

