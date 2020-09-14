import React from "react";
import { useField, useFormikContext } from "formik";
import Switch from 'react-ios-switch';

const SwitchField = ({LabelComponent, testInitialVal,label, ...props }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(props);

  return (
    <>
      <LabelComponent htmlFor={props.id || props.name}>{label}</LabelComponent>
      <Switch
          checked={field.value}
          {...props}
          onChange={val => {
            setFieldValue(field.name, val);
            setFieldTouched(field.name, true);
          }}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default SwitchField;
