import React from "react";
import Modal from 'react-modal';

import * as styled from './report_modal.style'
import Button from "../../../../../basic/button/button";


Modal.setAppElement('body');

const ReportModal = (props) => {

  const {
    isOpen,
    title,
    textMain,
    caption,
    onCancelClick,
    onDeleteClick

  } = props

  return (
    <styled.Container
      isOpen={isOpen}
      contentLabel="Confirm Delete Modal"
      style={{
        overlay: {
          zIndex: 500
        },
        content: {

        }
      }}
    >


      <styled.HeaderContainer>
        <styled.Title>{title}</styled.Title>
      </styled.HeaderContainer>
      
      <styled.TextContainer>
        <styled.TextMain>{textMain}</styled.TextMain>
        <styled.Caption>{caption}</styled.Caption>
      </styled.TextContainer>

      <styled.ButtonForm>
      <Button
          tertiary
          onClick={() => onCancelClick()}
          label={"Cancel"}
          type="button"
        />
        <Button
          onClick={() => onDeleteClick()}
          label={"Delete"}
          type="button"
        />
      </styled.ButtonForm>

    </styled.Container>
  );
};

export default ReportModal
