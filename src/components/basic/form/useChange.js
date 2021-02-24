import React, { useState } from "react";
import { isEquivalent } from "../../../methods/utils/utils";
import { useField, useFormikContext } from "formik";

// Updates fields in parent form
const useChange = (fieldName) => {
  const {
    setFieldValue,
    setFieldTouched,
    validateOnChange,
    validateOnBlur,
    validateField,
    validateForm,
    ...context
  } = useFormikContext();
  const [field, meta] = useField(fieldName ? fieldName : "null");

  let value;
  if (fieldName) {
    value = meta?.value || {};
  } else {
    value = context.values || {};
  }

  const { changed: changedSet } = value || {};

  const [changed, setChanged] = useState(false);
  const [initialValue, setInitialValue] = useState(value);

  React.useEffect(() => {
    // if values have changed from initial values, set changed to true

    if (!changed) {
      const issEquivalent = isEquivalent(initialValue, value);

      if (!issEquivalent) {
        setChanged(true);
        setFieldValue(fieldName ? `${fieldName}.changed` : "changed", true);
      }
    } else {
      if (!changedSet) {
        setChanged(false);
        setInitialValue(value);
      }
    }

    // if values are changed back to original value, set changed to false
    // if(changed) {
    // 	console.log("beeep")
    // 	if(issEquivalent) {
    // 		console.log("ayooo")
    // 		setChanged(false);
    // 		parentForm.setFieldValue("changed", false);
    // 	}
    // }
  }, [value]);

  // handle mount and dismount
  React.useEffect(() => {
    /* add any mount logic here


		 */

    // dismount
    return () => {
      // set changed to true
      // parentForm.setFieldValue("changed", true);
    };
  }, []);
};

export default useChange;
