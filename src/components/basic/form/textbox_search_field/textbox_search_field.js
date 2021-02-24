import React, { Component, useEffect, useState } from "react";

// external functions
import PropTypes from "prop-types";
import { useField, useFormikContext } from "formik";

// internal functions
import { getMessageFromError } from "../../../../methods/utils/form_utils";

// internal components
import ErrorTooltip from "../error_tooltip/error_tooltip";
import TextBoxSearch from "../../textbox_search/textbox_search";

// styles
import * as styled from "./textbox_search_field.style";

const TextboxSearchField = ({
  onTextboxClose,
  onChange,
  Container,
  style,
  containerStyle,
  labelField,
  valueField,
  multi,
  mapInput,
  mapOutput,
  ...props
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);

  const { value: fieldValue, name: fieldName } = field;

  const { touched, error } = meta;

  const hasError = touched && error;

  let ReactDropdownSelectStyle = {
    borderLeft: hasError ? "1px solid red" : "1px solid transparent",
    borderTop: hasError ? "1px solid red" : "1px solid transparent",
    borderRight: hasError ? "1px solid red" : "1px solid transparent",
    borderBottom: hasError && "1px solid red",
    boxShadow: hasError && `0 0 5px red`,
    transition: "all .5s ease-in-out",
  };

  const errorMessage = getMessageFromError(meta.error);

  return (
    <Container style={containerStyle}>
      <TextBoxSearch
        // value={"adaw"}
        // values={mapInput(fieldValue)}
        onTextboxClose={() => {
          // set this field to touched if not already
          const isTouched = meta.touched;
          if (!isTouched) {
            setFieldTouched(fieldName, true);
          }
          // call any additional function that was passed as prop
          onTextboxClose && onTextboxClose();
        }}
        onBlur={() => {
          setFieldTouched(true);
        }}
        labelField={labelField}
        valueField={valueField}
        multi={multi}
        style={{ ...ReactDropdownSelectStyle, ...style }}
        {...field}
        {...props}
        onChange={(values) => {
          if (!touched) {
            setFieldTouched(fieldName, "true");
          }

          if (values.length === 1) {
            if (values[0].name === "") {
              setFieldValue(fieldName, null);
            } else {
              setFieldValue(fieldName, values[0]);
            }
          } else {
            if (multi) {
              setFieldValue(fieldName, values);
            } else {
              setFieldValue(fieldName, values[0]);
            }
          }

          onChange && onChange(values);
        }}
      />

      <ErrorTooltip
        visible={hasError}
        text={errorMessage}
        ContainerComponent={styled.IconContainerComponent}
      />
    </Container>
  );
};

// Specifies propTypes
TextboxSearchField.propTypes = {
  Container: PropTypes.elementType,
  onTextboxClose: PropTypes.func,
  onChange: PropTypes.func,
  mapInput: PropTypes.func,
  mapOutput: PropTypes.func,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  labelField: PropTypes.string,
  valueField: PropTypes.string,
  multi: PropTypes.bool,
};

// Specifies the default values for props:
TextboxSearchField.defaultProps = {
  Container: styled.DefaultContainer,
  onTextboxClose: () => {},
  onChange: () => {},
  style: {},
  containerStyle: {},
  labelField: "",
  valueField: "",
  multi: false,
  mapInput: (val) => val,
  mapOutput: (val) => val,
};

export default TextboxSearchField;
