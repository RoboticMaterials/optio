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

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 0.5rem;
	margin: 0;
  width: 100%;
  border-radius 0.5rem 0.5rem 0 0;
	background: ${props => props.theme.bg.secondary};
	z-index: 10;
	box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
`

export const CloseIcon = styled.i`
    font-size: 1.4rem;
    //margin: 2rem;
  	right: 2rem;
  	position: absolute;
    color: ${props => props.theme.bg.quaternary};
    cursor: pointer;

`

export const Title = styled.div`
	flex: 2;
	height: 100%;
	min-height: 100%;
	margin: 0;
	padding: 0;
	text-align: center;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	display: flex;
  	flex-direction: column;
	font-size: ${props => props.theme.fontSize.sz2};
	font-weight: ${props => props.theme.fontWeight.bold};
	font-family: ${props => props.theme.font.primary};

`

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
