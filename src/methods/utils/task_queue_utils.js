import store from '../../redux/store'
import {useSelector} from "react-redux";
import {isHumanTask, isMiRTask} from "./route_utils";
import {DEVICE_CONSTANTS} from "../../constants/device_constants";

export const isRouteInQueue = (routeId, deviceType) => {
	const taskQueue = store.getState().taskQueueReducer.taskQueue
	const routes = store.getState().tasksReducer.tasks

	for(const currTaskQueueItem of Object.values(taskQueue)) {
		const {
			device_type: currDeviceType = "",
			taskId: currRouteId = ""
		} = currTaskQueueItem || {}

		const currRoute = routes[currRouteId] || {}
		const {
			handoff: currRouteIsHandoff = false
		} = currRoute

		if (currRouteId === routeId && !currRouteIsHandoff  && deviceType === currDeviceType) {
			// task already in queue
			return true
		}

	}

	// not in queue
	return false
}

export const getSidebarDeviceType = (route) => {
	// if task is MiR enabled, return MiR
	if (isMiRTask(route)) {
		return DEVICE_CONSTANTS.MIR_100
	}

	// otherwise human
	return DEVICE_CONSTANTS.HUMAN
}
