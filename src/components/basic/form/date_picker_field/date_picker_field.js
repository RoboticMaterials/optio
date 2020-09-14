import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";

const DatePickerField = ({LabelComponent,label, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  return (
    <>
      <LabelComponent htmlFor={props.id || props.name}>{label}</LabelComponent>
      <DatePicker
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={val => {
          setFieldValue(field.name, val);
        }}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default DatePickerField;
