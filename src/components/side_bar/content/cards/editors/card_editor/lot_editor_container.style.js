import styled, {css} from "styled-components";
import Modal from "react-modal";
import {commonClickableIcon, iconButtonCss} from "../../../../../../common_css/common_css";

export const rowCss = css`
	margin-bottom: 1rem;
`

export const Container = styled.div`
  
  color: ${props => props.theme.bg.octonary};
  
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  flex: 1;
  align-self: stretch;
  
  color: ${props => props.theme.bg.octonary};
`;

export const PageSelector = styled.div`
	display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: .5rem;
`

export const PageSelectorButton = styled.div`
	${iconButtonCss};
  ${commonClickableIcon};
  
`
export const PageSelectorText = styled.span`
	margin: 0 1rem;
  	font-size: ${props => props.theme.fontSize.sz3};
  //background: pink;
`

export const SimpleModalText = styled.span`
  font-size: ${props => props.theme.fontSize.sz3};
`

export const SimpleModalTextContainer = styled.div`
`
