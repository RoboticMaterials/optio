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
  
    min-width: ${props => props.minWidth};
    max-width: ${props => props.maxWidth};
    max-height: ${props => props.maxHeight};
    min-height: ${props => props.minHeight};
  
  color: ${props => props.theme.textColor};
  
  display: flex;
  flex-direction: column;
  border-radius: .4rem;
  overflow: hidden;
  align-items: stretch;
`;