import React  from "react";

// Updates fields in parent form
const useWarn = (validationSchema, {status, setStatus, values}) => {

	React.useEffect(() => {

		validationSchema.validate(values, {abortEarly: false})
			.then(() => {
				setStatus({
					...status,
					warnings: {}
				})

			})
			.catch((err) => {
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
