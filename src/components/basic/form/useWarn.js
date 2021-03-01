import React, { useState } from "react";
import { isEquivalent } from "../../../methods/utils/utils";
import {useField, useFormikContext} from "formik";
import {uniqueNameSchema} from "../../../methods/utils/form_schemas";

// Updates fields in parent form
const useWarn = (validationSchema, {status, setStatus, values}) => {

	React.useEffect(() => {
		console.log("use warn")
		console.log("validate values", values)


		validationSchema.validate(values, {abortEarly: false})
			.then((ayo) => {
				console.log("validate then")
				setStatus({
					...status,
					warnings: {}
				})

			})
			.catch((err) => {
				console.log("validate err",err)

				let warnings = {}

				err.inner.forEach((currErr) => {
					const {
						path,
						message
					} = currErr

					warnings[path] = message

				})

				setStatus({
					...status,
					warnings
				})
			});


	}, [values]);

};

export default useWarn
