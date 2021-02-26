import styled from "styled-components";
import {commonClickableIcon, iconButtonCss} from "../../../../../common_css/common_css";

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
  margin-right: 1rem;
`

export const Description = styled.span`
  color: white;
  margin-bottom: .25rem;
`

export const ItemContainer = styled.div`
	display: flex;
`

export const FlagsContainer = styled.div`
	display: flex;
`
export const FlagButton = styled.button`
	${iconButtonCss};
  	${commonClickableIcon};
  	margin: 0 .25rem;
`