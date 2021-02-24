import React from "react";
import * as styled from "./small_button.style";

const SmallButton = ({
  label,
  onClick,
  style,
  secondary,
  tertiary,
  disabled,
  type,
  ...props
}) => {
  return (
    <styled.SmallButton
      onClick={
        !disabled
          ? onClick
          : () => {
              return;
            }
      }
      disabled={disabled}
      type={type}
      {...props}
      style={style}
      secondary={secondary}
      tertiary={tertiary}
    >
      {props.children ? props.children : label}
    </styled.SmallButton>
  );
};

SmallButton.defaultProps = {
  secondary: false,
  tertiary: false,
  disabled: false,
};

export default SmallButton;
