import React from "react";
import Modal from "react-modal";

import * as styled from "./modals.style";
import SmallButton from "../small_button/small_button.js";

Modal.setAppElement("body");

export const ConfirmDeleteModal = (props) => {
  const {
    isOpen,
    title,
    textMain,
    caption,
    onCancelClick,
    onDeleteClick,
  } = props;

  return (
    <styled.Container
      isOpen={isOpen}
      contentLabel="Confirm Delete Modal"
      style={{
        overlay: {
          zIndex: 500,
        },
        content: {},
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
        <SmallButton
          tertiary
          onClick={() => onCancelClick()}
          label={"Cancel"}
          type="button"
        />
        <SmallButton
          onClick={() => onDeleteClick()}
          label={"Delete"}
          type="button"
        />
      </styled.ButtonForm>
    </styled.Container>
  );
};

export const ConfirmExitModal = (props) => {
  return (
    <styled.Container isOpen={props.isOpen} contentLabel="Confirm Exit Modal">
      <styled.HeaderContainer>
        <styled.Title>Are you sure you want to exit?</styled.Title>
      </styled.HeaderContainer>

      <styled.TextContainer>
        <styled.TextMain>Your changes will not be saved</styled.TextMain>
        {/* <styled.Caption>{props.caption}</styled.Caption> */}
      </styled.TextContainer>

      <styled.ButtonForm onSubmit={(e) => props.onConfirm()}>
        <SmallButton
          tertiary
          onClick={() => props.onCancel()}
          label={"Cancel"}
          type="button"
        />
        <SmallButton
          onClick={() => props.onConfirm()}
          label={"Continue"}
          type="submit"
        />
      </styled.ButtonForm>
    </styled.Container>
  );
};

export const WarningModal = (props) => {
  return (
    <styled.Container isOpen={props.isOpen} contentLabel="Confirm Delete Modal">
      <styled.HeaderContainer>
        <styled.Title>{props.title}</styled.Title>
      </styled.HeaderContainer>
      <styled.TextContainer>
        <styled.TextMain>{props.textMain}</styled.TextMain>
        <styled.Caption>{props.caption}</styled.Caption>
      </styled.TextContainer>

      <styled.ButtonForm>
        {/* <styled.CancelButton   type={"button"} onClick={props.onContinueClick}>Continue</styled.CancelButton> */}
      </styled.ButtonForm>
    </styled.Container>
  );
};

export const HILModal = React.memo((props) => {
  return (
    <styled.Container isOpen={props.isOpen} contentLabel="Confirm Delete Modal">
      <styled.HeaderContainer>
        <styled.Title>{props.title}</styled.Title>
      </styled.HeaderContainer>
      <styled.TextContainer>
        <styled.TextMain>{props.textMain}</styled.TextMain>
        <styled.Caption>{props.timer}</styled.Caption>
      </styled.TextContainer>

      <styled.ButtonForm>
        <styled.Icon
          secondary
          onClick={() => props.hilSuccess()}
          type="button"
          className="far fa-check-square fa-10x"
        />
        <styled.Icon
          secondary
          onClick={() => props.hilFailure()}
          type="button"
          className="far fa-minus-square"
          style={{ color: "red" }}
        />
      </styled.ButtonForm>
      <styled.ButtonForm>
        <SmallButton
          secondary
          onClick={() => props.onCancelClick()}
          label={"Cancel"}
          type="button"
        />
      </styled.ButtonForm>
    </styled.Container>
  );
});
