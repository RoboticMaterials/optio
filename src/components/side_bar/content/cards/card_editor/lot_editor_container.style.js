import styled, {css} from "styled-components";
import Modal from "react-modal";
import {commonClickableIcon, iconButtonCss} from "../../../../../common_css/common_css";

export const rowCss = css`
	margin-bottom: 1rem;
`

export const Container = styled(Modal)`
  outline: none !important;
  outline-offset: none !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  right: auto;
  bottom: auto;

  position: absolute;
	overflow: hidden;
  z-index: 50;
  
  min-width: 95%;
  max-width: 95%;
  max-height: 95%;
  
  // height: ${props => props.formEditor && "95%"};
  min-height: 95%;
  // height: 95%;
  
  color: ${props => props.theme.bg.octonary};
  
  display: flex;
  flex-direction: column;
  align-items: center;
  
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
