import React from "react";
import * as style from "./plus_button.style";

const PlusButton = (props) => (
  <style.PlusButton onClick={props.onClick}>
    <style.PlusSymbol
      style={{ ...props.style }}
      className={"far fa-plus-square"}
      disabled={props.disabled}
      schema={props.schema}
    ></style.PlusSymbol>
  </style.PlusButton>
);

export default PlusButton;
