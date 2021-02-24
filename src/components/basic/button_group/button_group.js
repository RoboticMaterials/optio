// import external dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";

// import styles
import * as styled from "./button_group.style";

const ButtonGroup = (props) => {
  const { ...rest } = props;
  // Declare a new state variable, which we'll call "count"

  const {
    Container,
    containerProps,
    ButtonView,
    buttonViewCss,
    buttonViewSelectedCss,
    buttonViewProps,
    Button,
    buttonProps,
    Component,
    buttons,
    onPress,
    selectedIndex,
    selectedIndexes,
    selectMultiple,
    containerStyle,
    containerCss,
    innerBorderStyle,
    lastBorderStyle,
    buttonStyle,
    buttonCss,
    textStyle,
    selectedTextStyle,
    selectedButtonStyle,
    underlayColor,
    activeOpacity,
    onHideUnderlay,
    onShowUnderlay,
    setOpacityTo,
    disabled,
    disabledStyle,
    disabledTextStyle,
    disabledSelectedStyle,
    disabledSelectedTextStyle,

    hasError,
    ...attributes
  } = rest;

  const buttonsLength = buttons.length;

  return (
    <Container {...containerProps} css={containerCss} hasError={hasError}>
      {buttons.map((button, i, arr) => {
        const isSelected = selectedIndex === i || selectedIndexes.includes(i);
        const isDisabled =
          disabled === true ||
          (Array.isArray(disabled) && disabled.includes(i));

        const isLast = i === buttonsLength - 1; // true if the current button is the last element, useful for styling

        return (
          <div key={i} style={{}}>
            <Button
              {...buttonProps}
              isLast={isLast}
              activeOpacity={activeOpacity}
              setOpacityTo={setOpacityTo}
              underlayColor={underlayColor}
              disabled={isDisabled}
              type={"button"}
              hasError={hasError}
              schema={props.schema}
              onClick={() => {
                if (selectMultiple) {
                  if (selectedIndexes.includes(i)) {
                    onPress(selectedIndexes.filter((index) => index !== i));
                  } else {
                    onPress([...selectedIndexes, i]);
                  }
                } else {
                  onPress(i);
                }
              }}
              style={{}}
              css={buttonCss}
            >
              <ButtonView
                {...buttonViewProps}
                isLast={isLast}
                isSelected={isSelected}
                style={{}}
                index={i}
                arr={arr}
                hasError={hasError}
                css={buttonViewCss}
                selectedCss={buttonViewSelectedCss}
              >
                {button.element ? (
                  <button.element />
                ) : (
                  <div style={{}}>{button}</div>
                )}
              </ButtonView>
            </Button>
          </div>
        );
      })}
    </Container>
  );
};

// Specifies propTypes
ButtonGroup.propTypes = {
  button: PropTypes.object,
  Component: PropTypes.elementType,
  onPress: PropTypes.func,
  buttons: PropTypes.array,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  selectedTextStyle: PropTypes.object,
  selectedButtonStyle: PropTypes.object,
  underlayColor: PropTypes.string,
  selectedIndex: PropTypes.number,
  selectedIndexes: PropTypes.arrayOf(PropTypes.number),
  activeOpacity: PropTypes.number,
  onHideUnderlay: PropTypes.func,
  onShowUnderlay: PropTypes.func,
  setOpacityTo: PropTypes.func,
  innerBorderStyle: PropTypes.shape({
    color: PropTypes.string,
    width: PropTypes.number,
  }),
  lastBorderStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  buttonStyle: PropTypes.object,
  selectMultiple: PropTypes.bool,
  theme: PropTypes.object,
  disabled: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  disabledStyle: PropTypes.object,
  disabledTextStyle: PropTypes.object,
  disabledSelectedStyle: PropTypes.object,
  disabledSelectedTextStyle: PropTypes.object,
};

// Specifies the default values for props:
ButtonGroup.defaultProps = {
  selectedIndex: null,
  hasError: false,

  selectedIndexes: [],
  selectMultiple: false,
  disabled: false,
  Component: "div",
  onPress: () => null,
  onShowUnderlay: () => {},
  Container: styled.Container,
  //Container={<div/>}
  ButtonView: styled.ButtonView,
  Button: styled.Button,
};

export { ButtonGroup };

export default ButtonGroup;
