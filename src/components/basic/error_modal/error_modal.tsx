import React from "react";
import ReactModalAdapter from '../styled_modal/styled_modal';
import TreeView from 'react-treeview';

import * as styled from './error_modal.style'

const style={
  overlay: {
    backgroundColor: 'red'
  },
  content: {

    background: 'blue',

  }

}

const ErrorModal = ({ isOpen, onDeleteClick, onCancelClick, message, title, subtitle, error }) => {

  return (
    <styled.Container
      isOpen={isOpen}
      backdrop={ 'static' }
      overlayClassName={"overlay"}
      shouldCloseOnOverlayClick={false}
      onRequestClose={onCancelClick}
      shouldCloseOnEsc={true}
      shouldReturnFocusAfterClose={true}
      //closeTimeoutMS={10}
      contentLabel="Error"
      shouldFocusAfterRender={true}
    >


      <styled.HeaderContainer>
        <styled.Title>{title}</styled.Title>
      </styled.HeaderContainer>
      <styled.TextContainer>
        <styled.TextMain>{subtitle}</styled.TextMain>
        <styled.Caption>{message}</styled.Caption>
      </styled.TextContainer>

      <styled.ButtonContainer>
        <styled.CancelButton   type={"button"} onClick={onCancelClick}>Ok</styled.CancelButton>

      </styled.ButtonContainer>

    </styled.Container>
  );
};

export default ErrorModal;
