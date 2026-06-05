import React from "react";
import { useField, useFormikContext } from "formik";

const renderOptions = (OptionComponent, options, selected) => {
  console.log('renderOptions options',options)
  return(
    <>
        {
          options.map((option, index) => {
          return(
            <OptionComponent selected={selected==option.value} value={option.value}>
              {option.text}
            </OptionComponent>
          )
        })
      }
    </>

  )
}

export const SelectField = ({ OptionComponent, LabelComponent,selected, label, children, options, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      {label &&
        <LabelComponent htmlFor={props.id || props.name}>{label}</LabelComponent>
      }

      <select {...field} {...props}>
        {renderOptions(OptionComponent, options, selected)}
        <button   type={"button"} onClick={() => console.log('hi')}>hello button</button>
      </select>

      {meta.touched && meta.error ? (
        <div>{meta.error}</div>
      ) : null}
    </>
  );
};

export default SelectField;
