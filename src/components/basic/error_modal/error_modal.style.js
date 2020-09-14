import styled from 'styled-components'
import Modal from 'react-modal';
import ReactModalAdapter from '../../basic/styled_modal/styled_modal';
import {css} from 'styled-components'

const sharedButtonStyle = css`
  outline: none !important;
  outline-offset: none !important;
  align-self: center;
  font-size: 1.5rem;
  position: relative;
  text-align: center;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
`

const StyledModal = styled(ReactModalAdapter).attrs({
  overlayClassName: 'Overlay',
  modalClassName: 'Modal'
})`
  .Modal {
    styles: here;
  }
  .Overlay {
    styles: here;
  }
`

export const Container = styled(ReactModalAdapter).attrs({
  overlayClassName: {
    base: "Overlay",
    afterOpen: "Overlay--after-open",
    beforeClose: "Overlay--before-close"
  },
    modalClassName: {
      base: "Modal",
      afterOpen: "Modal--after-open",
      beforeClose: "Modal--before-close"
  }
  })`

  .Modal {
    outline: none !important;
    outline-offset: none !important;

    background: ${props =>  props.theme.bg.primary};
    border-width: thin;
    border-color: black;
    border-style: solid;
    padding: 2rem;
    opacity: 75%;
    transition: opacity 500ms linear;

    &:focus {
      opacity: 100%;
      transition: opacity 500ms linear;
    }

    &--after-open {

    }

    &--before-close {

    }
  }

  .Overlay {
    background-color: transparent;
    position: absolute;
    transition: all 1s ease-in;
    top: 2rem;
    right: 2rem;



    &--after-open {
      // background-color: rgba(255, 0, 0, .75);
      transition: background-color 1000ms linear;
      top: 2rem;
      right: 2rem;

    }

    &--before-close {

    }
  }



`;

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-width: 0;
  border-bottom-width: thin;
  border-color: black;
  border-style: solid;
  margin-bottom: 2rem;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: ${props =>  props.theme.fontSize.sz2};
  font-family: ${props =>  props.theme.font.primary};
  font-weight: bold;
`;

export const TextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

export const TextMain = styled.h4`
  text-align: center;
  font-size: ${props =>  props.theme.fontSize.sz3};
  font-family: ${props =>  props.theme.font.primary};
  font-weight: 500;
`;

export const Caption = styled.h5`
  text-align: center;
  font-size: ${props =>  props.theme.fontSize.sz4};
  font-family: ${props =>  props.theme.font.primary};
  font-weight: 400;
  font-style: italic
`;



export const DeleteButton = styled.button`
  ${sharedButtonStyle}
  background: ${props =>  props.theme.bg.quaternary};
  margin-left: 1rem;
  color: black;
  &:hover {background: #FF0000}
`;

export const CancelButton = styled.button`
  ${sharedButtonStyle}
  background: ${props =>  props.theme.bg.senary};
  margin-left: 1rem;
  color: black;
  &:hover {color: #FF0000}
`;

export const ButtonContainer = styled.div`

  display: flex;
  flex-direction: row;
  justify-content: center;
`;
