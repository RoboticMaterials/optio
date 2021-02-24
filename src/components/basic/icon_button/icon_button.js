import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

// Import Styles
import * as style from "./icon_button.style";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

const IconButton = (props) => {
  const {
    color,
    children,
    onClick,
    disabled,
    width,
    height,
    clickable,
    hoverable,
    containerStyle,
    Component,
    backgroundColor,
    isActive,
    isHovering,
    onClickOutside,
  } = props;

  const ref = useRef(); // ref for useOnClickOutside
  useOnClickOutside(ref, onClickOutside); // calls onClickOutside when click outside of element

  return (
    <style.Container
      disabled={disabled}
      width={width}
      height={height}
      onClick={onClick}
      clickable={clickable}
      hoverable={hoverable}
      color={color}
      backgroundColor={backgroundColor}
      style={containerStyle}
      isActive={isActive}
      isHovering={isHovering}
      ref={ref}
    >
      {children}
    </style.Container>
  );
};

// Specifies propTypes
IconButton.propTypes = {
  clickable: PropTypes.bool,
  hoverable: PropTypes.bool,
  isActive: PropTypes.bool,
  isHovering: PropTypes.bool,
  onClick: PropTypes.func,
  onClickOutside: PropTypes.func,
  disabled: PropTypes.bool,
};

// Specifies the default values for props:
IconButton.defaultProps = {
  clickable: true,
  hoverable: true,
  onClick: () => {},
  onClickOutside: () => {},
  disabled: false,
  width: "auto",
  height: "auto",
  color: "#123456",
  backgroundColor: "#FFFFFF",
  isActive: false,
  isHovering: false,
};

export default IconButton;
