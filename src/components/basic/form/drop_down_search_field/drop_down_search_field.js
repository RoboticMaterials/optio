import React, { Component, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useField, useFormikContext } from "formik";
import DropDownSearch from "../../drop_down_search_v2/drop_down_search";
// import {globStyle} from '../../../../global_style'
import { getMessageFromError } from "../../../../methods/utils/form_utils";

// import styles
import * as styled from "./drop_down_search_field.style";
import ErrorTooltip from "../error_tooltip/error_tooltip";
import { isEmpty } from "ramda";

const DropDownSearchField = ({
  fieldLabel,
  LabelComponent,
  ItemComponent,
  ContentComponent,
  ErrorComponent,
  onDropdownClose,
  onChange,
  FieldContentContainer,
  FieldDropdownContainer,
  Container,
  style,
  containerSyle,
  mapInput,
  mapOutput,
  ...props
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  const [value, setValue] = useState(field.value);
  const [touched, setTouched] = useState(field.touched);
  const [updatingValue, setUpdatingValue] = useState(false);

  /*
   * This is kindy funky
   * The first time you select a value, both onChange and onDropdownClose get called since the dropdown closes when you select a value
   * onChange is called first, and updates the values and performs validation
   * THEN onDropdownClose is called, updates field.touched and performs validation
   * however, onDropdownClose gets called AFTER onChange but still has the old values
   * This means a second validation would be performed with the old values, which can result in a validation error for the old values, even if the new values don't have an error
   * by managing it in a hook this way, validation for field.touched can be controlled directly
   *
   * */
  useEffect(() => {
    if (touched) {
      // update touched
      // only perform validation if value is not being updated, otherwise validate will be called twice unnecessarily
      setFieldTouched(field.name, touched, !updatingValue);
    }
    // set
    if (updatingValue) setUpdatingValue(false);

    return () => {
      setTouched(false);
    };
  }, [touched]);

  let ReactDropdownSelectStyle = {
    borderColor: hasError && "red",
    boxShadow: hasError && `0 0 5px red`,
  };

  const errorMessage = getMessageFromError(meta.error);

  return (
    <Container style={containerSyle}>
      {fieldLabel && <LabelComponent>{fieldLabel}</LabelComponent>}

      <styled.DefaultFieldContentContainer>
        {/*<style.DefaultFieldDropdownContainer>*/}
        <DropDownSearch
          onBlur={() => {}}
          style={{ ReactDropdownSelectStyle, ...style }}
          theme={props.theme}
          ItemComponent={ItemComponent}
          ContentComponent={ContentComponent}
          onDropdownClose={() => {
            // set this field to touched if not already
            const isTouched = meta.touched;
            if (!isTouched) {
              setTouched(true);
            }
            // call any additional function that was passed as prop
            onDropdownClose && onDropdownClose();
          }}
          values={field.value ? mapInput(field.value) : []}
          {...field}
          {...props}
          onChange={(values) => {
            // update field value and set updating to true for use in the hook
            setFieldValue(field.name, mapOutput(values));
            setUpdatingValue(true);
            onChange && onChange(values);
          }}
          onRemoveItem={() => {
            // set this field to touched if not already
            const isTouched = meta.touched;
            if (!isTouched) {
              setTouched(true);
            }
            setFieldValue(field.name, "");
          }}
          onClearAll={() => setFieldValue(field.name, "")}
        />
        {/*</style.DefaultFieldDropdownContainer>*/}

        <ErrorTooltip
          visible={hasError}
          text={errorMessage}
          ContainerComponent={styled.IconContainerComponent}
        />
      </styled.DefaultFieldContentContainer>
      {/*
			{meta.touched && meta.error ? (
				<ErrorComponent className="error">{Object.values(meta.error)}</ErrorComponent>
			) : null}
			*/}
    </Container>
  );
};

// Specifies propTypes
DropDownSearchField.propTypes = {
  LabelComponent: PropTypes.elementType,
  FieldDropdownContainer: PropTypes.elementType,
  FieldContentContainer: PropTypes.elementType,
  style: PropTypes.object,
  mapInput: PropTypes.func,
  mapOutput: PropTypes.func,
};

// Specifies the default values for props:
DropDownSearchField.defaultProps = {
  LabelComponent: styled.TitleContainer,
  FieldDropdownContainer: styled.DefaultFieldDropdownContainer,
  FieldContentContainer: styled.DefaultFieldContentContainer,
  Container: styled.DefaultContainer,
  onChange: null,
  mapInput: (val) => val,
  mapOutput: (val) => val,
  style: {},
};

export default DropDownSearchField;
