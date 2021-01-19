import {useDispatch, useSelector} from "react-redux";
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
		toggleEditingProcess,
	} = props

	const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))


	const dispatch = useDispatch()
	const dispatchPostProcess = async (process) => await dispatch(postProcesses(process))

	const dispatchPutProcess = async (process) => await dispatch(putProcesses(process))
	const dispatchPostRoute = async (route) => await dispatch(taskActions.postTask(route))
	const dispatchPutTask = (task, ID) => dispatch(putTask(task, ID))
	const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
	const dispatchDeleteProcess = async (ID) => await dispatch(deleteProcesses(ID))
	const dispatchDeleteTask = (ID) => dispatch(deleteTask(ID))

	const tasks = useSelector(state => state.tasksReducer.tasks)
	const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)

	const handleSave = async (values, close) => {
		console.log("handleSave values",values)

		// extract some values
		const {
			newRoute,
			changed,
			...remainingValues
		} = values

		// perform any updates for routes
		for (const currRoute of remainingValues.routes) {

			// if not saved, POST
			if(currRoute.unsaved) {
				cleanRoute(currRoute)
				await dispatchPostRoute(currRoute)
			}

			// otherwise, PUT
			else {
				cleanRoute(currRoute)
				await dispatchPutTask(currRoute, currRoute._id)
			}
		}

		dispatchSetSelectedTask(null) // clear selected task
		const mappedRoute = remainingValues.routes.map((currRoute) => currRoute._id)

		// if new, POST
		if (remainingValues.new) {
			await dispatchPostProcess({
				...remainingValues,
				routes: mappedRoute
			})
		}

		// Else put
		else {
			await dispatchPutProcess({
				...remainingValues,
				routes: mappedRoute
			})
		}



		// close editor
		if(close) {
			dispatchSetSelectedProcess(null)
			toggleEditingProcess(false)
		}

	}

	const handleBack = async () => {
		// clear selectedTask, selectedProcess, and set toggleEditing to false
		await dispatchSetSelectedTask(null)
		dispatchSetSelectedProcess(null)
		toggleEditingProcess(false)
	}

	// remove keys from route that shouldn't be saved
	const cleanRoute = (route) => {
		delete route.new
		delete route.changed
		delete route.needsSubmit
		delete route.unsaved
	}


	const handleDelete = (withRoutes) => {
		if(withRoutes) {
			handleDeleteWithRoutes()
		}

		else {
			handleDeleteWithoutRoutes()
		}
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
				const {
					setSubmitting,
					submitForm,
					setTouched,
					resetForm,
					setFieldValue
				} = formikProps


				return(
					<ProcessField
						onSave={async (values, close) => {
							setSubmitting(true)
							await handleSave(values, close)
							setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
							setSubmitting(false)

							// reset changed to false
							setFieldValue("changed", false)


							// resetForm()

						}}
						onBack={handleBack}
						onDelete={handleDelete}
						formikProps={formikProps}
						toggleEditingProcess={toggleEditingProcess}
					/>
				)
			}}
		</Formik>
	)
}

export default ProcessForm