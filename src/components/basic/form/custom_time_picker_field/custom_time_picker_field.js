import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useField, useFormikContext } from "formik";
import TimePicker from "../../timer_picker/timer_picker";
import { getMessageFromError } from "../../../../methods/utils/form_utils";

// import styles
import * as styled from "./custom_time_picker_field.style";
import ErrorTooltip from "../error_tooltip/error_tooltip";

const CustomTimePickerField = ({ onChange, Container, ...props }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  const errorMessage = getMessageFromError(meta.error);

  return (
    <Container>
      <TimePicker
        {...field}
        {...props}
        onChange={(values) => {
          setFieldValue(field.name, values);
          onChange && onChange(values);
        }}
      />
      {/*</style.DefaultFieldDropdownContainer>*/}

      <ErrorTooltip
        visible={hasError}
        text={errorMessage}
        ContainerComponent={styled.IconContainerComponent}
      />
    </Container>
  );
};

// Specifies propTypes
CustomTimePickerField.propTypes = {};

// Specifies the default values for props:
CustomTimePickerField.defaultProps = {
  Container: styled.DefaultContainer,
  onChange: null,
};

export default CustomTimePickerField;
