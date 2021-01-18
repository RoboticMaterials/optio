import {useSelector} from "react-redux";
import {Formik} from "formik";
import {processSchema} from "../../../../../methods/utils/form_schemas";
import React from "react";
import {ProcessField} from "../edit_process/process_field";
import uuid from 'uuid'
import {deleteTask, putTask, setSelectedTask} from "../../../../../redux/actions/tasks_actions";
import {
	deleteProcesses,
	postProcesses,
	putProcesses,
	setSelectedProcess
} from "../../../../../redux/actions/processes_actions";
import * as taskActions from "../../../../../redux/actions/tasks_actions";

const ProcessForm = (props) => {

	const {
		selectedProcessCopy,
		setSelectedProcessCopy,
		toggleEditingProcess,
	} = props

	const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))

	const tasks = useSelector(state => state.tasksReducer.tasks)
	const dispatchPostProcess = async (process) => await dispatch(postProcesses(process))
	const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
	const dispatchPutProcess = async (process) => await dispatch(putProcesses(process))
	const dispatchPostRoute = async (route) => await dispatch(taskActions.postTask(route))
	const dispatchPutTask = (task, ID) => dispatch(putTask(task, ID))
	const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
	const dispatchDeleteProcess = async (ID) => await dispatch(deleteProcesses(ID))
	const dispatchDeleteTask = (ID) => dispatch(deleteTask(ID))

	const handleSave = async (values) => {

		dispatchSetSelectedTask(null)

		// If the id is new then post
		if (selectedProcess.new) {
			await dispatchPostProcess(selectedProcess)
		}

		// Else put
		else {
			await dispatchPutProcess(selectedProcess)
		}

		for (const currRoute of values.routes) {
			if(currRoute.new) {
				delete currRoute.new
				delete currRoute.changed
				delete currRoute.needsSubmit
				await dispatchPostRoute(currRoute)
			}
			else {
				delete currRoute.new
				delete currRoute.changed
				delete currRoute.needsSubmit
				await dispatchPutTask(currRoute, currRoute._id)
			}
		}

		dispatchSetSelectedProcess(null)
		toggleEditingProcess(false)
	}

	const handleBack = async () => {
		await dispatchSetSelectedTask(null)
		dispatchSetSelectedProcess(null)
		toggleEditingProcess(false)
	}

	const handleDeleteWithRoutes = async () => {

		// If there's routes in this process, delete the routes
		if (selectedProcess.routes.length > 0) {
			selectedProcess.routes.forEach(route => dispatchDeleteTask(route))
		}

		await dispatchDeleteProcess(selectedProcess._id)

		dispatchSetSelectedTask(null)
		dispatchSetSelectedProcess(null)
		toggleEditingProcess(false)
	}

	const handleDeleteWithoutRoutes = async () => {

		await dispatchDeleteProcess(selectedProcess._id)

		dispatchSetSelectedTask(null)
		dispatchSetSelectedProcess(null)
		toggleEditingProcess(false)
	}

	return (
		<Formik
			initialValues={{
				name: selectedProcessCopy ? selectedProcessCopy.name : "",
				routes: (selectedProcessCopy && selectedProcessCopy.routes && Array.isArray(selectedProcessCopy.routes)) ? selectedProcessCopy.routes.map((currRouteId) => tasks[currRouteId])  : [],
				broken: selectedProcessCopy ? selectedProcessCopy.broken : false,
				_id: selectedProcessCopy ? selectedProcessCopy._id : uuid.v4(),
				new: selectedProcessCopy.new,
				newRoute: null
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