import styled, {css} from 'styled-components'
import Modal from 'react-modal';
import { isMobile } from "react-device-detect"

export const Container = styled(Modal)`
	outline: none !important;
	outline-offset: none !important;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	right: auto;
	bottom: auto;
	position: absolute;
	z-index: 50;


	min-width: 30rem;
    max-width: 95%;
    width: ${isMobile && "95%"};
	height: 95%;


	color: ${props => props.theme.bg.octonary};
	display: flex;
	flex-direction: column;
	border-radius: 1rem;
	overflow: hidden;
`

export const CloseIcon = styled.i`
    font-size: 1.4rem;
    margin: 1rem;
    color: ${props => props.theme.bg.quaternary};
    cursor: pointer;
`

export const HeaderMainContentContainer = styled.div`
	display: flex;
  	flex-direction: row;
	justify-content: space-between;
  align-items: center;
  flex: 1;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: stretch;
  align-content: center;
  margin: 0;
  padding: .5rem 1rem;
  background: ${props => props.theme.bg.primary};
  box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
`

export const Title = styled.h2`
  height: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.fontSize.sz2};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: 1rem;
  flex-grow: 1;
`;

export const BodyContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	flex: 1;
	justify-content: space-between;
	overflow: hidden;
	background: ${props => props.theme.bg.secondary};
`

export const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	min-height: fit-content;
`;


export const ContentContainer = styled.div`
	background: ${props => props.theme.bg.secondary};
	border-radius: 0rem;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	margin-bottom: 1rem;
	align-items: center;
  justify-content: center;
`

export const NoButtonsText = styled.span`
	font: ${props => props.theme.font.primary};
	font-size: ${props => props.theme.fontSize.sz3};
`

export const FadeLoaderCSS = css`
 
`;

export const ReportButtonsContainer = styled.div`
	align-items: center;
	overflow: auto;
	min-height: 5rem;
	width: 100%;
  
  ${props => props.isButtons ? buttonsCss : noButtonsCss }
`

const buttonsCss = css`
`

const noButtonsCss = css`
  overflow: auto;
	display: flex;
  flex-drection: column;
  justify-content: center;
`



