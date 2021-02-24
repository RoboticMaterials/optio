import React, { useEffect, useRef } from "react";
import * as styled from "./textbox.style";

export default function Textbox(props) {
  let InputComponent;
  if (props.lines) {
    InputComponent = props.inputAreaComponent;
  } else {
    InputComponent = props.inputComponent;
  }

  const inputRef = useRef(null);

  useEffect(() => {
    if (props.focus == true) {
      inputRef.current.focus();
    }
  }, [props.focus]);

  useEffect(() => {
    if (props.keepFocus === true) {
      inputRef.current.focus();
    }
  });

  return (
    <React.Fragment>
      {!props.inline && props.label && (
        <styled.TextboxLabel style={props.labelStyle}>
          {props.label}
        </styled.TextboxLabel>
      )}
      <styled.TextboxContainer
        className="form-group"
        style={{ ...props.textboxContainerStyle }}
      >
        {props.inline && (
          <styled.TextboxLabel style={props.labelStyle}>
            {props.label}
          </styled.TextboxLabel>
        )}
        <InputComponent
          ref={inputRef}
          theme={props.theme}
          style={props.style}
          className={"form-control " + props.className}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onKeyPress={props.onKeyPress}
          rows={props.lines}
          type={props.type}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          schema={props.schema}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
        ></InputComponent>
      </styled.TextboxContainer>
    </React.Fragment>
  );
}

Textbox.defaultProps = {
  inputAreaComponent: styled.TextboxArea,
  inputComponent: styled.TextboxInput,
  autofocus: false,
  flex: false,
  inline: false,
  labelStyle: null,
  onBlur: () => {},
  onFocus: () => {},
};
