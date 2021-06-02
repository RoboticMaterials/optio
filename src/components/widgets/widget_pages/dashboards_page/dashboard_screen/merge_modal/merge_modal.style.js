import styled, { css } from 'styled-components'
// import Modal from 'react-modal';
import { isMobile } from "react-device-detect"
import { ModalContainerCSS, BodyContainerCSS } from '../../../../../../common_css/modal_css'
import * as commonCss from "../../../../../../common_css/common_css";
import {commonClickableIcon, iconButtonCss} from "../../../../../../common_css/common_css";

export const Container = styled(ModalContainerCSS)`
  width: 95%;
  height: 95%;
    //justify-content: space-between;
`

export const CloseIcon = styled.i`
    font-size: 1.4rem;
    margin: 1rem;
    color: ${props => props.theme.bg.quaternary};
    cursor: pointer;
`

export const LotListContainer = styled.div`
    ${commonCss.rowContainer};
    //flex: 1;
    
    justify-content: center;
    
    overflow-y: auto;
    overflow-x: hidden;
    flex-wrap: wrap;
    position: relative;
    //padding: 1rem;
    width: 100%;
  align-items: stretch;
    //background: background: rgba(0,0,255,0.1);
    
`

export const HeaderMainContentContainer = styled.div`
	display: flex;
  	flex-direction: row;
	justify-content: space-between;
  align-items: center;
  flex: 1;
`

// export const BackButton = styled.button`
//   ${iconButtonCss};
//     ${commonClickableIcon};
//     font-s
// `

export const Header = styled.div`
  display: flex;
    position: relative;
  //justify-content: space-between;
  //flex-direction: column;
  align-items: center;
  align-content: center;
  margin: 0;
  padding: .5rem 1rem;
  background: ${props => props.theme.bg.primary};
  box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
    border-bottom: 1px solid ${props => props.theme.bg.quaternary};
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  //align-items: stretch;
  align-content: center;
    align-self: stretch;
    align-items: center;
    
  //margin: 0;
    border-top: 1px solid ${props => props.theme.bg.quaternary};
  padding: .5rem 1rem;
  //  width: 100%;
  //  height: 20rem;
  background: ${props => props.theme.bg.primary};
  //box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
`

export const Title = styled.h2`
  margin: 0;
  padding: 0;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.fontSize.sz2};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: 1rem;
`;

export const SubTitle = styled.h3`
  margin: 0;
  padding: 0;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.fontSize.sz2};
  //margin-bottom: 1rem;
`;

export const BodyContainer = styled(BodyContainerCSS)`
//background: rgba(0,255,0,0.1);
    position: relative;
    padding: 0;
    overflow:hidden;
    justify-content: flex-start;
    align-items: center;
    align-self: stretch;
    
    flex: 1;
`

export const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	min-height: fit-content;
`;

export const Column = styled.div`
    display: flex;
    flex-direction: column;
`

export const CloseButton = styled.button`
  ${iconButtonCss};
  ${commonClickableIcon};
  font-size: 2.5rem;
    position: absolute;
    right: 1rem;
    //right: 0;
`

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
  
  ${props => props.isButtons ? buttonsCss : noButtonsCss}
`

const buttonsCss = css`
`

const noButtonsCss = css`
  overflow: auto;
	display: flex;
  flex-drection: column;
  justify-content: center;
`



