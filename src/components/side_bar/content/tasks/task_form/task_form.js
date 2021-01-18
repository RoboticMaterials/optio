import {Formik} from "formik";
import {routeSchema} from "../../../../../methods/utils/form_schemas";
import React from "react";
import TaskField from "../task_field/task_field";

const TaskForm = (props) => {

	const {
		initialValues,
		toggleEditing,
		handleSubmit,
		handleBackClick,
		handleDelete,
		...remainingProps
	} = props

	return (
		<Formik
			initialValues={initialValues}

			// validation control
			validationSchema={routeSchema}
			validateOnChange={true}
			validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
			validateOnBlur={true}

			// enableReinitialize={true} // leave false, otherwise values may be reset when new data is fetched
			onSubmit={async (values, formikHelpers) => {

				const {
					setSubmitting,
					setTouched,
				} = formikHelpers

				// set submitting to true, handle submit, then set submitting to false
				// the submitting property is useful for eg. displaying a loading indicator
				// const {
				// 	buttonType
				// } = values

				setSubmitting(true)
				await handleSubmit(values)
				setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
				setSubmitting(false)

			}}
		>
			{formikProps => {

				const {
					submitForm
				} = formikProps

				return(
					<TaskField
						{...formikProps}
						onDelete={handleDelete}
						isTransportTask={null}
						toggleEditing={toggleEditing}
						isProcessTask={null}
						onSave={submitForm}
						onBackClick={handleBackClick}
						onRemove={null}
						{...remainingProps}
					/>
				)
			}}
		</Formik>
	)
}

export default TaskForm