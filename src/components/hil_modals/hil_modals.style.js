import styled, { css } from 'styled-components'
import * as commonCss from "../../common_css/common_css";
import {iconButtonCss} from "../../common_css/common_css";
import Modal from 'react-modal';
import { isMobile } from "react-device-detect"

// Modal.setAppElement('document');

export const containerCss = `
  position: absolute;
    transition: backdrop-filter 3s ease;
    //width: 98%;
  	width: ${isMobile ? '98%' : 'auto'};
    height: ${isMobile ? '98%' : 'auto'};
    max-height: 98%;
    max-width: 98%;
    //min-height: 50rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  outline: none !important;

    z-index: 5000;
    border-radius: 1rem;
    box-shadow: 0 0.2rem 0.4rem 0rem #303030;
    display: flex;
    /* flex-flow: row; */
    flex-direction: column;
    //background-color: white;

    //overflow-y: scroll;
     overflow: hidden;

    ::-webkit-scrollbar {
        display: none;  /* Safari and Chrome */
    }
`
export const ModalContainer = styled(Modal)`
    ${containerCss};
`




export const HilButtonContainer = styled.div`
    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
  
    div:not(:first-child) {
        margin: 0 0rem 0 2rem;
    }
  
    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        flex-direction: column;
        div:not(:first-child) {
          margin-top: .5rem;
          margin: .5rem 0rem 0 0rem;
        }
    }
`

export const InnerHeader = styled.div`
    align-self: stretch;
    display: flex;
    justify-content: flex-end;
    margin: .5rem 0;
    padding: 0 1rem;
`


export const Body = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    width: 100%;

    overflow: hidden;
    
    background: ${props => props.theme.bg.secondary};
    
    
`

export const LotInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  margin: 0 2rem 1rem 2rem;
  
`

export const InnerContentContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    align-self: stretch;
    flex: 1;
    overflow: hidden;
    align-items: center;
    margin: 0 1rem 0rem 1rem;
    border: 1px solid #cacaca;
    justify-content: space-between;
    border-radius: 2rem;
    background: ${props => props.theme.bg.primary};
  //padding-top: 1rem;
`



export const SubtitleContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
  	margin-bottom: 1rem;
    //padding-bottom: 1rem;
    
`

export const HilMessage = styled.h3`
    display: flex;
    font-family: ${props => props.theme.font.primary};
    justify-content: center;
    align-self: center;

    //padding-top: 1rem;
    //margin-top: 3rem;
    padding: 0;
    margin: 0;
    font-size: ${props => props.theme.fontSize.sz1};
    text-align: center;
    // white-space: nowrap;
    // width: 80rem;
`

export const fractionButtonCss = css`
    margin: 1rem 0;
    height: 5rem;
    max-width: 50rem;
`

export const unloadButtonCss = css`
	height: 5rem;
	max-width: 25rem;
  align-self: center;
	width: 25rem;
  //align-self: stretch;
  //flex: 1;
	justify-content: center;
`

export const HilSubtitleMessage = styled.h4`
    display: flex;
    font-family: ${props => props.theme.font.primary};
    justify-content: center;
    margin-bottom: 1.5rem;
    //margin-top: 3rem;
    padding: 0;
    margin: 0;
    font-size: 1.6rem;
    text-align: center;
`

const emphasisCss = css`
	font-weight: bold;
  font-style: oblique;
  
`

export const InfoText = styled.span`
  white-space: pre-wrap;
    display: flex;
    font-family: ${props => props.theme.font.primary};
    justify-content: center;
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.theme.textColor};
    text-align: center;
  
  ${props => props.emphasize && emphasisCss};
  
  
  	//max-width: 80%;
  //margin-top: 1rem;
`

export const HilTimer = styled.p`
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    font-family: ${props => props.theme.font.primary};
    font-weight: bold;
    font-size: ${props => props.theme.fontSize.sz2};
    color: ${props => props.theme.fg.primary};
  opacity: ${props => props.visible ? 1 : 0};
`


export const ColumnContainer = styled.div`
  display: flex;
    flex-direction: column;
`

export const Header = styled.div`
    display:flex;
    flex-direction: row;
    width: 100%;
    background: ${props => props.theme.bg.secondary};
    //box-shadow: ${props => props.theme.cardShadow};
    align-items: center;
    justify-content: space-around;
    align-items: center;
    padding: .5rem 1rem;
`


export const HilIcon = styled.i`
    display: flex;
    justify-content: center;
    align-items: center;
    //margin: auto auto;
    color:  ${props => props.color};
    fill: green;
    font-size: 2.5rem;
    margin-right: 1rem;
    &:hover {
        cursor: pointer;
    }

    &:active{
        filter: brightness(85%)
    }
`

