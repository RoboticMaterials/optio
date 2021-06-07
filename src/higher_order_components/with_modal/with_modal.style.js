import styled, { css } from "styled-components"
import Modal from "react-modal";

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
  
    min-width: ${props => props.width};
    max-width: ${props => props.width};
    max-height: ${props => props.height};
    min-height: ${props => props.height};
  
  color: ${props => props.theme.textColor};
  
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: .4rem;
  overflow: hidden;
  align-items: stretch;
  
  // background: red;
  
`;