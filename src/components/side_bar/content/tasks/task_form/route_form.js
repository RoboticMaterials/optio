import {Formik} from "formik";
import {routeSchema} from "../../../../../methods/utils/form_schemas";
import React, {useEffect, useRef} from "react";
import TaskField from "../task_field/route_field";
import {deleteRouteClean, saveFormRoute, setSelectedTask} from "../../../../../redux/actions/tasks_actions";
import {setEditingValues} from "../../../../../redux/actions/processes_actions";
import {useDispatch, useSelector} from "react-redux";
import * as taskActions from "../../../../../redux/actions/tasks_actions";
import { pageDataChanged } from "../../../../../redux/actions/sidebar_actions"

const TaskForm = (props) => {

	const {
		initialVals,
		toggleEditing,
		isNew,
		...remainingProps
	} = props

	const formRef = useRef(null)	// gets access to form state

	const {
			current
	} = formRef || {}
	const {
			values = {},
			initialValues = {}
	} = current || {}

	const dispatch = useDispatch()
	const dispatchSaveFormRoute = async (formRoute) => await dispatch(saveFormRoute(formRoute))
	const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
	const dispatchRemoveTask = async (taskId) => await dispatch(taskActions.removeTask(taskId))
	const dispatchDeleteRouteClean = async (routeId) => await dispatch(taskActions.deleteRouteClean(routeId))
	const onEditing = async (props) => await dispatch(taskActions.editingTask(props))
	const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))

	const tasks = useSelector(state => state.tasksReducer.tasks)
	const editing = useSelector(state => state.tasksReducer.editingTask) //Moved to redux so the variable can be accesed in the sideBar files for confirmation modal

	useEffect(() => {
		return () => {
			dispatchSetSelectedTask(null)
		}

	}, []);


	const handleSubmit = async (values) => {

		await dispatchSaveFormRoute(values)

		dispatchSetSelectedTask(null)
		onEditing(false)
	}

	const handleBackClick = (routeId) => {
		dispatchSetSelectedTask(null)
		if(tasks[routeId] && tasks[routeId].new) {
			dispatchRemoveTask(routeId)
		}
		onEditing(false)
	}

	const handleDelete = async (routeId) => {


		await dispatchDeleteRouteClean(routeId)
		onEditing(false)
		dispatchSetSelectedTask(null)
	}

	return (
		<Formik
			initialValues={initialVals}
			innerRef = {formRef}

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
					submitForm,
					touched,
					initialValues,
					values
				} = formikProps

				return(
					<TaskField
						{...formikProps}
						onDelete={handleDelete}
						isNew={isNew}
						isTransportTask={true}
						toggleEditing={toggleEditing}
						isProcessTask={null}
						onSave={null}
						onBackClick={handleBackClick}
						onRemove={handleDelete}
						{...remainingProps}
					/>
				)
			}}
		</Formik>
	)
}

export default TaskForm
