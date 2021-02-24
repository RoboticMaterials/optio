import React from "react";
import PropTypes from "prop-types";
import { useField, useFormikContext } from "formik";

import ErrorTooltip from "../error_tooltip/error_tooltip";
import * as styled from "./number_field.style";
import useLongPress from "../../../../hooks/useLongPress";

// function setDeceleratingTimeout(callback, factor, initialRate, times, minRate)
// {
// 	var internalCallback = function(tick, counter) {
//
// 		const newRate = (initialRate) - (++counter * factor)
//
// 		return function() {
// 			if (--tick >= 0) {
// 				window.setTimeout(internalCallback, (newRate > minRate) ? newRate : minRate);
// 				callback();
// 			}
// 		}
// 	}(times, 0);
//
// 	window.setTimeout(internalCallback, factor);
// };

const NumberField = ({ maxValue, minValue, ...props }) => {
  const {
    setFieldValue,
    setFieldTouched,
    validateOnChange,
    validateOnBlur,
    validateField,
    validateForm,
    ...context
  } = useFormikContext();
  const [field, meta] = useField(props);

  // extract field data
  const { value: fieldValue, name: fieldName } = field;

  // extract meta data
  const { touched, error } = meta;

  // does the field contain an error?
  const hasError = touched && error;

  // const onLongPress = () => {
  //
  // 	console.log('longpress is triggered');
  // 	setDeceleratingTimeout(
  // 		() => {
  // 			console.log("CALLBACK")
  // 			setFieldValue(fieldName, parseInt(fieldValue) - 1)
  // 		},
  // 		50,
  // 		500,
  // 		300,
  // 		10)
  //
  // };
  //
  // const onClick = () => {
  // 	console.log('click is triggered')
  // }
  //
  // const defaultOptions = {
  // 	shouldPreventDefault: true,
  // 	delay: 500,
  // };
  // const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <styled.HilInputContainer>
      <styled.HilInputIcon
        disabled={!(fieldValue > minValue)}
        className="fas fa-minus-circle"
        color={"#ff1818"}
        onClick={() => {
          if (!touched) {
            setFieldTouched(fieldName, true);
          }

          if (maxValue) {
            if (fieldValue > maxValue) {
              // fieldValue should not exceed count, it may have been set higher before a lot was selected
              // reduce fieldValue to lot count
              setFieldValue(fieldName, maxValue);
            }
          }

          // if(minValue !== null) {
          // fieldValue cannot be negative
          if (fieldValue > minValue) setFieldValue(fieldName, fieldValue - 1);
          // }

          // setFieldValue(fieldName,fieldValue - 1)
        }}
      />

      <div style={{ position: "relative" }}>
        <styled.HilInput
          hasError={hasError}
          type="number"
          onChange={(e) => {
            if (!touched) {
              setFieldTouched(fieldName, true);
            }

            const enteredValue = e.target.value;
            const enteredValueInt = parseInt(enteredValue);

            if (isNaN(enteredValueInt)) {
              if (enteredValue === "-") {
                setFieldValue(fieldName, -0);
              } else {
                setFieldValue(fieldName, 0);
              }
            } else {
              // if there is a maxValue, the fieldValue cannot exceed this
              if (maxValue) {
                if (enteredValueInt <= maxValue)
                  setFieldValue(fieldName, enteredValueInt);
              }

              // otherwise the value can be anything
              else {
                setFieldValue(fieldName, enteredValueInt);
              }
            }
          }}
          value={fieldValue}
        />
        <ErrorTooltip
          visible={hasError}
          text={error}
          ContainerComponent={styled.IconContainerComponent}
        />
      </div>

      <styled.HilInputIcon
        defaultValue={0}
        disabled={!(fieldValue < maxValue)}
        className="fas fa-plus-circle"
        color={"#1c933c"}
        onClick={() => {
          if (!touched) {
            setFieldTouched(fieldName, true);
          }

          // if there is a maxValue, fieldValue cannot exceed maxValue
          if (maxValue) {
            if (fieldValue < maxValue) {
              setFieldValue(fieldName, fieldValue + 1);
            }

            // fieldValue is greater than count (probably was set before lot was selected), reduce to count
            else {
              setFieldValue(fieldName, parseInt(maxValue));
            }
          }
          // otherwise fieldValue can be anything
          else {
            setFieldValue(fieldName, fieldValue + 1);
          }
        }}
      />
    </styled.HilInputContainer>
  );
};

// Specifies propTypes
NumberField.propTypes = {};

// Specifies the default values for props:
NumberField.defaultProps = {};

export default NumberField;
