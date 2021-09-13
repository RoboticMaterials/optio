import styled from "styled-components";
import * as commonCss from '../../../../../../common_css/common_css'


import Modal from 'react-modal';
import { isMobile } from "react-device-detect"

import { ModalContainerCSS, BodyContainerCSS } from '../../../../../../common_css/modal_css'

export const ModalContainer = styled(ModalContainerCSS)`
    height: auto;   
    
`

export const BodyContainer = styled(BodyContainerCSS)`
padding-top: 2rem;
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
  font-size: ${props => props.theme.fontSize.sz3};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.textColor};
  margin-bottom: 2rem;
  flex-grow: 1;
`;

export const LotContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    flex-grow: 1;
    overflow: auto;
`

export const LotHeader = styled.div`
    ${commonCss.rowContainer}
    align-items: center;
    text-align: center;
    justify-content: center;
    height: fit-content;
`

export const LotTitle = styled.h1`
    color: ${props => props.theme.bg.octonary};
    font-family: ${props => props.theme.font.primary};
    font-size: 1.8rem;
    max-height: 2.5rem;
    flex-wrap: nowrap;
    overflow: hidden;
    /* margin-bottom: 0;
    position: absolute;
    text-align: center;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;  */

`



export const LotButtonContainer = styled.div`
    /* position: absolute; */
    /* bottom: 0; */
    /* left: 0; */
    /* margin-bottom: auto; */
    width: 100%;
    padding-top: .5rem;

    height: fit-content;
    display: flex;
    justify-content: center;
    background: ${props => props.theme.bg.secondary};
    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
    height: fit-content;
    /* flex: 3; */


`

export const LotBodyContainer = styled.div`
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    /* flex: 6; */
    flex-grow: 1;
    padding: 0.5rem 1rem;
    z-index: 1;
`
