import styled from "styled-components";

import Modal from 'react-modal';
import { isMobile } from "react-device-detect"

import { ModalContainerCSS, BodyContainerCSS } from '../../../../../../../common_css/modal_css'

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

export const ButtonContainer = styled.div`

    width: 95%;
    max-width: 50rem;
    align-self: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

