import React, { useState } from "react";
import { isEquivalent } from "../../../methods/utils/utils";

// Updates fields in parent form
const useChanged = (form) => {
	const [changed, setChanged] = useState(false);

	React.useEffect(() => {
		const issEquivalent = isEquivalent(form.initialValues, form.values);

		// if values have changed from initial values, set changed to true
		if(!changed) {
			if(!issEquivalent) {
				setChanged(true);
				form.setFieldValue("changed", true);
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

	}, [form.values]);

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

export default useChanged