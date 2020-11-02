import React, { useState, useMemo, useRef, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'


import HILModals from '../../components/hil_modals/hil_modals'

const HILModal = () => {

    const params = useParams()
    const dispatch = useDispatch()

    // Adds HIL timer to taskQueueReducer so it can be used in other areas such as status_header
    const onSetHilTimers = (timers) => dispatch({ type: 'HIL_TIMERS', payload: timers })
    const onSetActiveHilDashboards = (active) => dispatch({ type: 'ACTIVE_HIL_DASHBOARDS', payload: active })

    let status = useSelector(state => { return state.statusReducer.status })
    const dashboards = useSelector(state => { return state.dashboardsReducer.dashboards })
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const taskQueueItemClicked = useSelector(state => state.taskQueueReducer.taskQueueItemClicked)
    const locations = useSelector(state => state.locationsReducer.locations)
    const hilTimers = useSelector(state => state.taskQueueReducer.hilTimers)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const hilResponse = useSelector(state => state.taskQueueReducer.hilResponse)
    const activeHilDashboards = useSelector(state => state.taskQueueReducer.activeHilDashboards)

    const [statusTimerIntervals, setStatusTimerIntervals] = useState({})

    /**
     * Handles any task that should be displaying a HIL
     * useMemo for performance reasons, should only rerender if taskQueue changes and dashbaordID params
     */
    const handleHilsInTaskQueue = useMemo(() => {

        // Handles if a task queue item was clicked and displays that item
        if (!!taskQueueItemClicked && taskQueue[taskQueueItemClicked] && !!taskQueue[taskQueueItemClicked].hil_station_id) {
            const item = taskQueue[taskQueueItemClicked]
            const hilType = tasks[item.task_id].type

            return <HILModals hilMessage={item.hil_message} hilType={hilType} taskQuantity={item.quantity} taskQueueID={taskQueueItemClicked} item={item} />
        }

        // Used to hide the HIL if success was clicked. (See HIL_Modals)
        if (hilResponse === 'success') return

        return Object.keys(taskQueue).map((id, ind) => {

            const item = taskQueue[id]

            // If the task queue item has a HIL and it's corresponding dashboard id is not in the activeHILDasbaords list then display HIL.
            // Dashboards can only have 1 HIL at a time, if the task queue has 2 HILS for the same dashboards, then only read the 
            // most recent in the list 
            if (!!item.hil_station_id) {

                // Loops through all ascociated dashboards at that location
                locations[item.hil_station_id].dashboards.map((dashboard, ind) => {

                    // if the list of active hil dashboards does not include the dashboard then add
                    if (!Object.keys(activeHilDashboards).includes(dashboard)) {
                        // activeHilDashboards.push(dashboard)
                        onSetActiveHilDashboards({
                            ...activeHilDashboards,
                            [dashboard]: id,
                        })
                    }

                })

                // If active hils matches the dashboard selected (found in params) then display hil
                // if (params.dashboardID === item.hil_station_id && !dashboards[params.dashboardID].unsubcribedHILS.includes(item.hil.taskID)) {
                if (Object.keys(activeHilDashboards).includes(params.dashboardID)) {

                    const hilType = tasks[item.task_id].type

                    return <HILModals hilMessage={item.hil_message} hilType={hilType} taskQuantity={item.quantity} taskQueueID={id} item={item} key={id} />
                }
                else {
                    return null
                }
            }


        })

    }, [taskQueue, params.dashboardID, taskQueueItemClicked, hilResponse])


    /**
     * Handles HIL timers and adds them to Redux
     * 
     * Logic in this function is a little confusing at first.
     * 
     * What this does is map through each item in the task Q and give that Item an interval based on the times sent from the back end
     * But, if this item already has an interval, don't add a new one to it.
     * If the interval is running, but the Task Q item does not have a station ID, then a HIL should not be displaying so remove the current interval
     * 
     * After the first maping loop there's an if statement to make sure that the interval's task Q item is still in the task Q, if it's not, then remove the interval
     */
    const handleHILTimers = useMemo(() => {

        Object.keys(taskQueue).map((id, ind) => {

            const item = taskQueue[id]

            // If the item in task queue has an ascociated station_id, a hil must be displaying 
            if (!!item.hil_station_id) {

                // If the state of timers running includes the task queue id, that means the timer is still running
                if (!!statusTimerIntervals[id]) {
                }

                // If the state doesnt include the task queue id, then the timer hasn't started yet on the front end
                else if (!statusTimerIntervals[id]) {

                    // Add the timer to the state, so multiple timers are not started
                    setStatusTimerIntervals({
                        ...statusTimerIntervals,
                        [id]: true,
                    })

                    let startTime = item.hil_start_time
                    let timer = item.hil_timeout

                    //Get the time since Epoch
                    const frontEndTime = Date.now() / 1000

                    //Find the difference between the time of the front end vs the backend and set timer
                    const biasedTime = frontEndTime - startTime
                    let biasedTimer = timer - biasedTime

                    //Timer interval in seconds
                    const timerInterval = 1

                    //Set the timer in state
                    setStatusTimerIntervals({
                        ...statusTimerIntervals,
                        [id]: setInterval(() => {

                            // Can change the timer interval 
                            biasedTimer = biasedTimer - timerInterval

                            // Add the timer to redux
                            onSetHilTimers({
                                ...hilTimers,
                                [item._id.$oid]: biasedTimer.toFixed(0),
                            })
                            //If the timer goes to Zero then stop the timer
                            if (biasedTimer <= 0) {
                                onSetHilTimers({
                                    ...hilTimers,
                                    [item._id.$oid]: 0,
                                })

                                // Update redux
                                delete hilTimers[item._id.$oid]
                                onSetHilTimers({
                                    ...hilTimers,
                                })

                                //  Delete the timer in the state
                                if (!!statusTimerIntervals[id]) {
                                    clearInterval(statusTimerIntervals[id])
                                    delete statusTimerIntervals[id]
                                    setStatusTimerIntervals({
                                        ...statusTimerIntervals,
                                    })
                                }

                            }

                        }, timerInterval * 1000)
                    })
                }

            }

            // If the task queue item does not have a station id but has a timer running, that means the timer should stop
            else if (!item.hil_station_id && !!statusTimerIntervals[id]) {
                if (!!statusTimerIntervals[id]) {

                    // Deletes the dashboard id from active list for the hil that has been responded too
                    onSetActiveHilDashboards(delete (activeHilDashboards[item.hil_station_id]))

                    // Clear the interval which is stored in state and delete that ID from state
                    clearInterval(statusTimerIntervals[id])
                    delete statusTimerIntervals[id]
                    setStatusTimerIntervals({
                        ...statusTimerIntervals,
                    })

                    // Update redux
                    delete hilTimers[item._id.$oid]
                    onSetHilTimers({
                        ...hilTimers,
                    })
                }

            }

        })

        // If the length of intervals is greater then 0 check to make sure the ascoiated task q item is still in task q
        if (Object.keys(statusTimerIntervals).length > 0) {

            Object.keys(statusTimerIntervals).map((id, ind) => {

                // If Item is not in task q, end the interval
                if (!taskQueue[id]) {
                    clearInterval(statusTimerIntervals[id])
                    delete statusTimerIntervals[id]
                    setStatusTimerIntervals({
                        ...statusTimerIntervals,
                    })
                }
            })
        }

    }, [taskQueue, hilTimers])

    const handleActiveHilDashboardRemoved = () => {

        let hilRemoved = true

        Object.keys(taskQueue).map((id, ind) => {
            const item = taskQueue[id]

        })

    }

    return (
        <>
            {/* <HILModals status={status.hil}/> */}
            {handleHilsInTaskQueue}
            {handleHILTimers}
        </>
    )
}

export default HILModal