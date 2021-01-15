import {useSelector} from "react-redux";
import {Formik} from "formik";
import {processSchema} from "../../../../../methods/utils/form_schemas";
import React from "react";
import {ProcessField} from "../edit_process/process_field";
import uuid from 'uuid'

const ProcessForm = (props) => {

	const {
		selectedProcessCopy,
		setSelectedProcessCopy,
		toggleEditingProcess,
	} = props

	const tasks = useSelector(state => state.tasksReducer.tasks)

	return (
		<Formik
			initialValues={{
				name: selectedProcessCopy ? selectedProcessCopy.name : "",
				routes: (selectedProcessCopy && selectedProcessCopy.routes && Array.isArray(selectedProcessCopy.routes)) ? selectedProcessCopy.routes.map((currRouteId) => tasks[currRouteId])  : [],
				broken: selectedProcessCopy ? selectedProcessCopy.broken : false,
				_id: selectedProcessCopy ? selectedProcessCopy._id : uuid.v4(),
				new: selectedProcessCopy.new
			}}

			// validation control
			validationSchema={processSchema}
			validateOnChange={true}
			validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
			validateOnBlur={true}

			// enableReinitialize={true} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
			onSubmit={async (values, formikHelpers) => {

				const {
					setSubmitting,
					setTouched,
					resetForm
				} = formikHelpers

				// set submitting to true, handle submit, then set submitting to false
				// the submitting property is useful for eg. displaying a loading indicator
				const {
					buttonType
				} = values

				setSubmitting(true)
				// await handleSubmit(values, formMode)
				setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
				setSubmitting(false)

			}}
		>
			{formikProps => {



				return(
					<ProcessField
						formikProps={formikProps}
						toggleEditingProcess={toggleEditingProcess}
					/>
				)

			}}

		</Formik>

	)
}


export default ProcessForm