import {useDispatch, useSelector} from "react-redux";
import {Formik} from "formik";
import {processSchema} from "../../../../../methods/utils/form_schemas";
import React, {useEffect} from "react";
import {ProcessField} from "../process_field/process_field";
import uuid from 'uuid'
import {
	deleteRouteClean,
	deleteTask,
	putRouteClean,
	putTask, saveFormRoute,
	setSelectedTask
} from "../../../../../redux/actions/tasks_actions";
import {
	deleteProcess, deleteProcessClean,
	postProcesses,
	putProcesses,
	setSelectedProcess
} from "../../../../../redux/actions/processes_actions";
import * as taskActions from "../../../../../redux/actions/tasks_actions";
import {isObject} from "../../../../../methods/utils/object_utils";
import {isArray} from "../../../../../methods/utils/array_utils";

const ProcessForm = (props) => {

	const {
		toggleEditingProcess,
	} = props

	const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))


	const dispatch = useDispatch()
	const dispatchPostProcess = async (process) => await dispatch(postProcesses(process))

	const dispatchPutProcess = async (process) => await dispatch(putProcesses(process))

	const dispatchPostRouteClean = async (route) => await dispatch(taskActions.postRouteClean(route))
	const dispatchPutRouteClean = (task, ID) => dispatch(putRouteClean(task, ID))

	const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
	const dispatchDeleteProcessClean = async (ID) => await dispatch(deleteProcessClean(ID))
	const dispatchDeleteRouteClean = (routeId) => dispatch(deleteRouteClean(routeId))
	const dispatchSaveFormRoute = async (formRoute) => await dispatch(saveFormRoute(formRoute))

	const tasks = useSelector(state => state.tasksReducer.tasks)
	const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
	const objects = useSelector(state => state.objectsReducer.objects)
	const currentMap = useSelector(state => state.mapReducer.currentMap)

	useEffect(() => {
		return () => {
			dispatchSetSelectedTask(null)
			dispatchSetSelectedProcess(null)
		}
	}, []);

	const handleSave = async (values, close) => {

		// extract some values
		const {
			newRoute,
			changed,
			...remainingValues
		} = values

		// perform any updates for routes
		for (const currRoute of remainingValues.routes) {
			await dispatchSaveFormRoute(currRoute)
			cleanRoute(currRoute)
		}

		dispatchSetSelectedTask(null) // clear selected task
		const mappedRoutes = remainingValues.routes.map((currRoute) => currRoute._id)

		// if new, POST
		if (remainingValues.new) {
			await dispatchPostProcess({
				...remainingValues,
				routes: mappedRoutes,
				map_id: currentMap._id,
			})
		}

		// Else put
		else {
			await dispatchPutProcess({
				...remainingValues,
				routes: mappedRoutes,
				map_id: currentMap._id,
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
			selectedProcess.routes.forEach(route => {
				if(isObject(route)) {
					dispatchDeleteRouteClean(route._id)
				}
				else {
					dispatchDeleteRouteClean(route)
				}
			})
		}

		await dispatchDeleteProcessClean(selectedProcess._id)

		dispatchSetSelectedTask(null)
		dispatchSetSelectedProcess(null)
		toggleEditingProcess(false)
	}

	const handleDeleteWithoutRoutes = async () => {

		await dispatchDeleteProcessClean(selectedProcess._id)

		dispatchSetSelectedTask(null)
		dispatchSetSelectedProcess(null)
		toggleEditingProcess(false)
	}

	const handleDefaultObj = (objId, prevObj) => {

		if(isObject(objects[objId])) {
			return objects[objId]
		}
		else if (prevObj) {
			return prevObj
		}
		else {
			return null
		}
	}

	const handleInitialRoutes = () => {
		if(selectedProcess && selectedProcess.routes && Array.isArray(selectedProcess.routes)) {
			let prevObj = null

			return selectedProcess.routes
				.filter((currRouteItem) => {
					return isObject(isObject(currRouteItem) ? currRouteItem : tasks[currRouteItem])
				})
				.map((currRouteItem) => {

				const route = isObject(currRouteItem) ? currRouteItem : tasks[currRouteItem]

				const obj = handleDefaultObj(route.obj, prevObj)
				prevObj = obj

				return {
					...route,
					obj
				}
			})
		}

		// otherwise initialize to empty array
		return []

	}


	return (
		<Formik
			initialValues={{
				name: selectedProcess ? selectedProcess.name : "",
				routes: handleInitialRoutes(),
				broken: selectedProcess ? selectedProcess.broken : false,
				_id: selectedProcess ? selectedProcess._id : uuid.v4(),
				new: selectedProcess.new,
				newRoute: null,
				map_id: currentMap._id,
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
