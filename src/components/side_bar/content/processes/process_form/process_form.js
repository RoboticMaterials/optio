import {useDispatch, useSelector} from "react-redux";
import {Formik} from "formik";
import {processSchema} from "../../../../../methods/utils/form_schemas";
import React from "react";
import {ProcessField} from "../edit_process/process_field";
import uuid from 'uuid'
import {
	deleteRouteClean,
	deleteTask,
	putRouteClean,
	putTask,
	setSelectedTask
} from "../../../../../redux/actions/tasks_actions";
import {
	deleteProcesses,
	postProcesses,
	putProcesses,
	setSelectedProcess
} from "../../../../../redux/actions/processes_actions";
import * as taskActions from "../../../../../redux/actions/tasks_actions";
import {isObject} from "../../../../../methods/utils/object_utils";
import * as objectActions from "../../../../../redux/actions/objects_actions";

const ProcessForm = (props) => {

	const {
		selectedProcessCopy,
		toggleEditingProcess,
	} = props

	const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))


	const dispatch = useDispatch()
	const dispatchPostProcess = async (process) => await dispatch(postProcesses(process))

	const dispatchPutProcess = async (process) => await dispatch(putProcesses(process))

	const dispatchPostRouteClean = async (route) => await dispatch(taskActions.postRouteClean(route))
	const dispatchPutRouteClean = (task, ID) => dispatch(putRouteClean(task, ID))

	const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
	const dispatchDeleteProcess = async (ID) => await dispatch(deleteProcesses(ID))
	const dispatchDeleteRouteClean = (routeId) => dispatch(deleteRouteClean(routeId))

	const tasks = useSelector(state => state.tasksReducer.tasks)
	const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
	const objects = useSelector(state => state.objectsReducer.objects)
	const currentMap = useSelector(state => state.mapReducer.currentMap)

	const createObject = (obj) => {
		// Save object
		let objectId = null
		if ('name' in obj) {
			if (obj._id == undefined) { // If the object does not currently exist, make a new one
				const newObject = {
					name: obj.name,
					description: "",
					modelName: "",
					dimensions: null,
					map_id: currentMap._id,
					_id: uuid.v4(),
				}
				dispatch(objectActions.postObject(newObject))

				objectId = newObject._id
			} else { //  Otherwise just set the task obj to the existing obj
				objectId = obj._id
			}
		}

		return objectId
	}

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

			console.log("currRoutecurrRoute",currRoute)
			const {
				unsaved,
				new: isNew,
				changed,
				needsSubmit,
				obj = {},
				...remainingRoute
			} = currRoute

			const objectId = createObject(obj)

			cleanRoute(currRoute)



			const submitItem = {
				...remainingRoute,
				obj: objectId
			}

			// if not saved, POST
			if(unsaved) {
				await dispatchPostRouteClean(submitItem)
			}

			// otherwise, PUT
			else {
				await dispatchPutRouteClean(submitItem, submitItem._id)
			}
		}

		dispatchSetSelectedTask(null) // clear selected task
		const mappedRoutes = remainingValues.routes.map((currRoute) => currRoute._id)

		// if new, POST
		if (remainingValues.new) {
			await dispatchPostProcess({
				...remainingValues,
				routes: mappedRoutes
			})
		}

		// Else put
		else {
			await dispatchPutProcess({
				...remainingValues,
				routes: mappedRoutes
			})
		}



		// close editor
		if(close) {
			dispatchSetSelectedProcess(null)
			toggleEditingProcess(false)
		}

	}

	// remove keys from route that shouldn't be saved
	const cleanRoute = (route) => {
		delete route.new
		delete route.changed
		delete route.needsSubmit
		delete route.unsaved
	}

	const handleBack = async () => {
		// clear selectedTask, selectedProcess, and set toggleEditing to false
		await dispatchSetSelectedTask(null)
		dispatchSetSelectedProcess(null)
		toggleEditingProcess(false)
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
			selectedProcess.routes.forEach(route => dispatchDeleteRouteClean(route))
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
				routes: (selectedProcessCopy && selectedProcessCopy.routes && Array.isArray(selectedProcessCopy.routes)) ?
					selectedProcessCopy.routes.map((currRouteId) => {
						const route = tasks[currRouteId]
						const obj = isObject(objects[route.obj]) ? objects[route.obj] : null

						return {
							...route,
							obj
						}
					}

					)

					:
					[],
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