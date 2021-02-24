import React from "react";

import PropTypes from "prop-types";
import { useField, useFormikContext } from "formik";

import MinusButton from "../../minus_button/minus_button";

// import styles
import * as style from "./delete_field_button.style";

const DeleteFieldButton = ({
  ContentContainer,
  style,
  ButtonComponent,
  index,
  ViewComponent,
  viewProps,
  ...props
}) => {
  const {
    setValues,
    values,
    setFieldValue,
    setFieldTouched,
    validateOnChange,
    validateOnBlur,
    validateField,
    validateForm,
    ...context
  } = useFormikContext();
  const [field, meta] = useField(props);

  return (
    <ButtonComponent
      {...props}
      onClick={() => {
        console.log("DeleteFieldButton: values before", values);
        console.log(
          "DeleteFieldButton: values[field.name]",
          values[field.name]
        );
        values[field.name].splice(index, 1);
        validateForm();
      }}
    >
      <ViewComponent {...viewProps} />
    </ButtonComponent>
  );
};

// Specifies propTypes
DeleteFieldButton.propTypes = {};

// Specifies the default values for props:
DeleteFieldButton.defaultProps = {
  ButtonComponent: MinusButton,
  ViewComponent: style.DefaultViewComponent,
};

export default DeleteFieldButton;
