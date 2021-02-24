import React from "react";
import Modal from "react-modal";

import * as styled from "./modals.style";
import SmallButton from "../small_button/small_button.js";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: "1000000",
  },
};

export const DetectronResultsModal = (props) => {
  return (
    <styled.Container
      isOpen={props.isOpen}
      //style={customStyles}

      contentLabel="Confirm Delete Modal"
    >
      <styled.HeaderContainer>
        <styled.Title>{props.title}</styled.Title>
      </styled.HeaderContainer>
      <styled.TextContainer>
        <styled.TextMain>{props.textMain}</styled.TextMain>
        <styled.Caption>{props.caption}</styled.Caption>
      </styled.TextContainer>

      <styled.ButtonContainer>
        <SmallButton
          secondary
          onClick={() => props.onCancelClick()}
          label={"Cancel"}
          type="button"
        />
        <SmallButton
          secondary
          onClick={() => props.onDeleteClick()}
          label={"Delete"}
          type="button"
        />
      </styled.ButtonContainer>
    </styled.Container>
  );
};

export const WarningModal = (props) => {
  return (
    <styled.Container
      isOpen={props.isOpen}
      //style={customStyles}

      contentLabel="Confirm Delete Modal"
    >
      <styled.HeaderContainer>
        <styled.Title>{props.title}</styled.Title>
      </styled.HeaderContainer>
      <styled.TextContainer>
        <styled.TextMain>{props.textMain}</styled.TextMain>
        <styled.Caption>{props.caption}</styled.Caption>
      </styled.TextContainer>

      <styled.ButtonContainer>
        {/* <styled.CancelButton   type={"button"} onClick={props.onContinueClick}>Continue</styled.CancelButton> */}
      </styled.ButtonContainer>
    </styled.Container>
  );
};

export const HILModal = (props) => {
  return (
    <styled.Container
      isOpen={props.isOpen}
      //style={customStyles}

      contentLabel="Confirm Delete Modal"
    >
      <styled.HeaderContainer>
        <styled.Title>{props.title}</styled.Title>
      </styled.HeaderContainer>
      <styled.TextContainer>
        <styled.TextMain>{props.textMain}</styled.TextMain>
        <styled.Caption>{props.timer}</styled.Caption>
      </styled.TextContainer>

      <styled.ButtonContainer>
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
      </styled.ButtonContainer>
      <styled.ButtonContainer>
        <SmallButton
          secondary
          onClick={() => props.onCancelClick()}
          label={"Cancel"}
          type="button"
        />
      </styled.ButtonContainer>
    </styled.Container>
  );
};
