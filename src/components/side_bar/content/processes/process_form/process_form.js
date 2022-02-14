import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Formik} from "formik";
import {getProcessSchema} from "../../../../../methods/utils/form_schemas";
import {ProcessField} from "../process_field/process_field";
import uuid from 'uuid'
import {
	deleteRouteClean,
	deleteTask,
	postTask,
	putTask,
	saveFormRoute,
	setSelectedTask
} from "../../../../../redux/actions/tasks_actions";
import {
	deleteProcessClean,
	postProcesses,
	putProcesses,
	setSelectedProcess,
	setProcessAttributes,
	setEditingValues
} from "../../../../../redux/actions/processes_actions";

import {isObject} from "../../../../../methods/utils/object_utils";
import { pageDataChanged } from "../../../../../redux/actions/sidebar_actions"
import { flattenProcessStations } from '../../../../../methods/utils/processes_utils';
import { BASIC_LOT_TEMPLATE } from '../../../../../constants/lot_contants';
import { CYCLE_TIME_DICT } from '../../../../../constants/location_constants';
import { getLotTemplates, deleteLotTemplate, postLotTemplate } from '../../../../../redux/actions/lot_template_actions';
import { deepCopy } from '../../../../../methods/utils/utils';
import { putStation } from '../../../../../redux/actions/stations_actions';

const ProcessForm = (props) => {

	const {
		toggleEditingProcess,
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
	const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
	const dispatchPostProcess = async (process) => await dispatch(postProcesses(process))

	const dispatchPutProcess = async (process) => await dispatch(putProcesses(process))
	const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates());
	const dispatchDeleteLotTemplate = async (ID) => await dispatch(deleteLotTemplate(ID))
	const dispatchPostRoute = async (route) => await dispatch(postTask(route))
    const dispatchPutRoute = async (route) => await dispatch(putTask(route, route._id))
	const dispatchPutStation = async (station) => await dispatch(putStation(station))

	const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
	const dispatchSetProcessAttributes = async (id, attr) => await dispatch(setProcessAttributes(id, attr))
	const dispatchPostLotTemplate = (lotTemplate) => dispatch(postLotTemplate(lotTemplate))
	const dispatchDeleteProcessClean = async (ID) => await dispatch(deleteProcessClean(ID))
	const dispatchDeleteRouteClean = (routeId) => dispatch(deleteRouteClean(routeId))
	const dispatchSaveFormRoute = async (formRoute) => await dispatch(saveFormRoute(formRoute))
	const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))
	const dispatchSetEditingValues = (process) => dispatch(setEditingValues(process))
	const dispatchDeleteTask = (id) => dispatch(deleteTask(id))

	const tasks = useSelector(state => state.tasksReducer.tasks)
	const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
	const currentMapId = useSelector(state => state.localReducer.localSettings.currentMapId)
	const stations = useSelector(state => state.stationsReducer.stations);
	const lotTemplates = useSelector(state => state.lotTemplatesReducer.lotTemplates)
	const [processCopy, setProcessCopy] = useState(selectedProcess)	// Initial process, used when changes are not to be saved (onBack)

	useEffect(() => {
		dispatchGetLotTemplates() // We will use these when we save the process

		return () => {
			dispatchSetSelectedTask(null)
			dispatchSetSelectedProcess(null)
			dispatchSetEditingValues(null)
		}
	}, []);

	useEffect(() => {
		var {
			...remainingInitialValues
		} = initialValues

		var {
			changed,
			...remainingValues
		} = values

		if(JSON.stringify(remainingInitialValues)!==JSON.stringify(remainingValues)){
			dispatchPageDataChanged(true)
		}

		return () => {
			dispatchPageDataChanged(false)
		}

	}, [values])

	const handleDeleteRemovedRoutes = (processRoutes) => {

		Object.values(tasks).forEach((task) => {
			const found = !!processRoutes.find((route) => route === task._id)
			if(!found && task.processId===selectedProcess._id) dispatchDeleteTask(task._id)
		})
	}

	const handleSave = async (values, close) => {
		// extract some values
		const {
			changed,
			...remainingValues
		} = values

		// // perform any updates for routes
		// for (const currRoute of remainingValues.routes) {
		// 	await dispatchSaveFormRoute(currRoute)
		// 	cleanRoute(currRoute)
		// }

		for (var savingRoute of remainingValues.routes) {
			let exists = selectedProcess.routes.find(routeID => routeID === savingRoute._id)
			if (!exists) {
				dispatchPostRoute(savingRoute);
			} else {
				dispatchPutRoute(savingRoute);
			}
		}

		dispatchSetSelectedTask(null) // clear selected task
		const mappedRoutes = remainingValues.routes.map((currRoute) => currRoute._id)

		const currDate = new Date();

		const nodes = flattenProcessStations(remainingValues.routes, stations)
		let savedProcess;

		// if new, POST
		if (remainingValues.new) {
			delete remainingValues.new
			savedProcess = await dispatchPostProcess({
				...remainingValues,
				routes: mappedRoutes,
				map_id: currentMapId,
				created_at: currDate.getTime(),
				edited_at: currDate.getTime(),
				flattened_stations: nodes
			})

			await dispatchPostLotTemplate({...BASIC_LOT_TEMPLATE, processId: savedProcess._id})
		}

		// Else put
		else {
			savedProcess = await dispatchPutProcess({
				...remainingValues,
				routes: mappedRoutes,
				map_id: currentMapId,
				edited_at: currDate.getTime(),
				flattened_stations: nodes
			})
		}

		// When a process changes, we need to go through every station involved and make sure they
		// have a cycle time dict for every product group in the process.
		for (const node of nodes) {
			let stationCopy = deepCopy(stations[node.stationID])

			let stationCycleTimesObj
			if ('cycle_times' in stationCopy) {
				stationCycleTimesObj = stationCopy.cycle_times;
			} else {
				stationCycleTimesObj = {}
			}

			let changed = false;
			for (var lotTemplate of Object.values(lotTemplates)) {
				if (!(lotTemplate._id in stationCycleTimesObj)) {
					changed = true;
					stationCycleTimesObj = {[lotTemplate._id]: CYCLE_TIME_DICT, ...stationCycleTimesObj};
				}
			}

			if (changed) {
				stationCopy.cycle_times = stationCycleTimesObj;
				dispatchPutStation(stationCopy)
			}
		}

		// close editor
		if(close) {
			dispatchSetSelectedProcess(null)
			toggleEditingProcess(false)
		}
		handleDeleteRemovedRoutes(mappedRoutes)
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
		await dispatchSetProcessAttributes(selectedProcess._id, processCopy)
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

		Object.values(lotTemplates)
			.filter(lotTemplate => lotTemplate.processId === selectedProcess._id)
			.forEach(lotTemplate => dispatchDeleteLotTemplate(lotTemplate._id))

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

	const handleInitialRoutes = () => {
		// If process already has routes
		if(selectedProcess && selectedProcess.routes && Array.isArray(selectedProcess.routes)) {
			return selectedProcess.routes.map(routeId => tasks[routeId]);
		}

		// otherwise initialize to empty array
		return [];

	}


	return (
		<Formik
			initialValues={{
				name: selectedProcess ? selectedProcess.name : "",
				routes: handleInitialRoutes(),
				_id: selectedProcess ? selectedProcess._id : uuid.v4(),
				broken: selectedProcess ? selectedProcess.broken : false,
				new: selectedProcess.new,
				map_id: currentMapId,
				startDivergeType: selectedProcess.new ? null: selectedProcess.startDivergeType,
				showStatistics: selectedProcess.new ? true: selectedProcess.showStatistics,
				showQueue: selectedProcess.new || selectedProcess.showQueue === undefined ? true: selectedProcess.showQueue,
				showFinish: selectedProcess.new || selectedProcess.showFinish === undefined ? true: selectedProcess.showFinish,
			}}

			// validation control
			validationSchema={getProcessSchema(stations)}
			innerRef = {formRef}
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
					setFieldValue,
					touched,
					values,
					initialValues,
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
