import React, { useState, useEffect } from 'react'
import * as styled from '../tasks_content.style'
import { useSelector, useDispatch } from 'react-redux'

// Import Basic Components
import ContentHeader from '../../content_header/content_header'
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'
import TextBoxSearch from '../../../../basic/textbox_search/textbox_search'
import ContentList from '../../content_list/content_list'

// Import Components
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import LoadUnloadFields from './fields/load_unload_fields'

// Import utils
import uuid from 'uuid'
import { deepCopy } from '../../../../../methods/utils/utils'
import { willRouteDeleteBreakProcess, isBrokenProcess, willRouteAdditionFixProcess } from '../../../../../methods/utils/processes_utils'

// Import actions
import * as taskActions from '../../../../../redux/actions/tasks_actions'
import { setSelectedTask, deleteTask, getTasks, putTask } from '../../../../../redux/actions/tasks_actions'
import * as dashboardActions from '../../../../../redux/actions/dashboards_actions'
import { putDashboard, postDashboard } from '../../../../../redux/actions/dashboards_actions'
import * as objectActions from '../../../../../redux/actions/objects_actions'
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import { putProcesses, setSelectedProcess, setFixingProcess } from '../../../../../redux/actions/processes_actions'
import { putStation } from '../../../../../redux/actions/stations_actions'
import { select } from 'd3-selection'

const EditTask = (props) => {

    const {
        selectedTaskCopy,
        setSelectedTaskCopy,
        shift,
        isTransportTask,
        toggleEditing,
        isProcessTask
    } = props

    const dispatch = useDispatch()
    const dispatchPostTaskQueue = (ID) => dispatch(postTaskQueue(ID))
    const dispatchPutProcesses = (process) => dispatch(putProcesses(process))
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const dispatchDeleteTask = (ID) => dispatch(deleteTask(ID))
    const dispatchPutStation = (station, ID) => dispatch(putStation(station, ID))
    const dispatchPutDashboard = (dashboard, ID) => dispatch(putDashboard(dashboard, ID))
    const dispatchPutTask = (task, id) => dispatch(putTask(task, id))
    const dispatchPostDashboard = (dashboard) => dispatch(postDashboard(dashboard))
    const dispatchSetFixingProcess = (bool) => dispatch(setFixingProcess(bool))

    let tasks = useSelector(state => state.tasksReducer.tasks)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const objects = useSelector(state => state.objectsReducer.objects)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const processes = useSelector(state => state.processesReducer.processes)
    const fixingProcess = useSelector(state => state.processesReducer.fixingProcess)

    const stations = useSelector(state => state.locationsReducer.stations)

    const [obj, setObject] = useState({}) // The current object (may or may not be on backend, but if not it will be posted when task is saved)
    // const [selectedTaskCopy, setSelectedTaskCopy] = useState(null)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);


    useEffect(() => {
        console.log('QQQQ Selected Task', selectedTask)
        setSelectedTaskCopy(selectedTask)

        return () => {
            // When unmounting edit task, always set fixing process to false
            // This will take care of when it's set to true in edit process
            dispatchSetFixingProcess(false)
        }
    }, [])


    const renderLoadUnloadParameters = () => {
        if (selectedTask.load.position === null) {
            // No load position has been defined - ask user to define load (start) position
            return <styled.DirectionText>Click a position on the map to be the load (or start) postion.</styled.DirectionText>
        } else if (selectedTask.load.station === null) {
            // Load position is not tied to a station - task is no longer a transport task
            return (
                <>
                    {selectedTask.unload.position === null &&
                        <styled.DirectionText>Click on a position on the map to be the end position.</styled.DirectionText>
                    }
                    <styled.HelpText>Since the start position is not tied to a station, this task is no longer a transport task</styled.HelpText>
                </>
            )
        } else {
            // Load position has been defined and is a station - now handle unload position
            if (selectedTask.unload.position === null) {
                // No unload position has been defined - ask user to define load (end) position
                return <styled.DirectionText>Click on a position on the map to be the unload (or end) position.</styled.DirectionText>
            } else if (selectedTask.unload.station === null) {
                // Unload position is not a station - task is no longer a transport task
                return <styled.HelpText>Since the end position is not tied to a station, this task is no longer a transport task</styled.HelpText>
            } else {
                // Load AND Unload positions have been defined. Display load/unload parameter fields
                return <LoadUnloadFields />

            }
        }
    }

    const onDelete = async () => {
        // Delete all dashboard buttons associated with that task
        Object.values(dashboards)
            .filter(dashboard =>
                dashboard.station == selectedTask.load.station || dashboard.station == selectedTask.unload.station
            ).forEach(dashboard => {
                let ind = dashboard.buttons.findIndex(button => button.task_id == selectedTask._id)
                if (ind !== -1) {
                    dashboard.buttons.splice(ind, 1)
                    dispatch(dashboardActions.putDashboard(dashboard, dashboard._id.$oid))
                }
            }
            )

        // If the task has associated processes, then remove that task from that process
        if (selectedTask.processes.length > 0) {

            selectedTask.processes.map((process) => {
                let updatedProcess = processes[process]

                // If the route removal breaks the process then updatte the process
                if (!!willRouteDeleteBreakProcess(updatedProcess, selectedTask, tasks)) {
                    updatedProcess.broken = willRouteDeleteBreakProcess(updatedProcess, selectedTask, tasks)
                }

                // Removes the task from the array of routes
                const index = updatedProcess.routes.indexOf(selectedTask._id)
                updatedProcess.routes.splice(index, 1)

                // Update the process if need be
                if (selectedProcess._id === updatedProcess._id) {
                    dispatchSetSelectedProcess({
                        ...updatedProcess,
                    })
                }

                dispatchPutProcesses({
                    ...updatedProcess,
                })

            })
        }

        // If the selected task has an associated task, (usually for device and human task)
        // Delete the associated task
        if (!!selectedTask.associated_task) {
            dispatch(taskActions.deleteTask(selectedTask.associated_task));
        }

        dispatch(taskActions.deleteTask(selectedTask._id));

        // dispatch(taskActions.deselectTask());
        dispatchSetSelectedTask(null)
        toggleEditing(false)
    }

    const onSave = async () => {
        // Save object
        let objectId
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

        Object.assign(selectedTask, { obj: objectId })

        let taskId = ''

        // Save Task
        if (!!selectedTask.new) { // If task is new, POST

            // If it's apart of a device, need to post 2 tasks and associate them with each other
            // 1 robot task and 1 human task
            // This allows for the ability for humans to do the task and seperates statistics between types
            if (selectedTask.device_type === 'MiR_100') {

                const newID = uuid.v4()

                const humanTask = {
                    ...deepCopy(selectedTask),
                    device_type: 'human',
                    _id: newID,
                    associated_task: selectedTask._id,
                }

                const deviceTask = {
                    ...deepCopy(selectedTask),
                    associated_task: humanTask._id,
                }

                console.log('QQQQ Human task', humanTask)
                console.log('QQQQ Device task', deviceTask)

                dispatch(taskActions.postTask(deviceTask))
                dispatch(taskActions.postTask(humanTask))

                // Temp fix for a weird issue with redux and posting tasks to fast
                // setTimeout(onGetTasks(), 500)

            }
            else {
                console.log('QQQQ human task', deepCopy(selectedTask))
                dispatch(taskActions.postTask(selectedTask))

            }

            // Add the task automatically to the associated load station dashboard
            // Since as of now the only type of task we are doing is push, only need to add it to the load location
            let updatedStation = deepCopy(stations[selectedTask.load.station])
            console.log('QQQQ Station', updatedStation)

            let updatedDashboard = dashboards[updatedStation.dashboards[0]]
            console.log('QQQQ Dashboard', updatedDashboard)

            if (updatedDashboard === undefined) {
                let defaultDashboard = {
                    name: updatedStation.name + ' Dashboard',
                    buttons: [],
                    station: updatedStation._id
                }
                const postDashboardPromise = dispatchPostDashboard(defaultDashboard)
                postDashboardPromise.then(async postedDashboard => {
                    alert('Added dashboard to location. There already should be a dashboard tied to this location, so this is an temp fix')
                    console.log('QQQQ Posted dashboard', postedDashboard)
                    updatedStation.dashboards = [postedDashboard._id.$oid]
                    await dispatchPutStation(updatedStation, updatedStation._id)

                })
            }

            const newDashboardButton = {
                color: '#bcbcbc',
                id: selectedTask._id,
                name: selectedTask.name,
                task_id: selectedTask._id
            }
            updatedDashboard.buttons.push(newDashboardButton)
            dispatchPutDashboard(updatedDashboard, updatedDashboard._id.$oid)


            // dispatch(taskActions.removeTask(selectedTask._id)) // Remove the temporary task from the local copy of tasks

        } else {    // If task is not new, PUT
            taskId = selectedTask._id

            // If the task device type is human and has an associated task, then this task must have gone from device to human based
            // so delete the robot task and keep the associated human task from the new human task, keeps previous human task data
            // If this doesn't make sense, look at the if statement above
            // Hint, if there is a task that has 2 tasks because its a device task, only the device task is showed in the list
            if (selectedTask.device_type === 'human' && !!selectedTask.associated_task) {

                const updatedHumanTask = {
                    ...deepCopy(tasks[selectedTask.associated_task])
                }

                delete updatedHumanTask.associated_task

                dispatch(taskActions.putTask(updatedHumanTask, updatedHumanTask._id))
                dispatchDeleteTask(selectedTask._id)

            }

            // If the task is an associated task, also update the associated task
            else if (!!selectedTask.associated_task) {

                const updatedAssociatedTask = {
                    ...deepCopy(selectedTask),
                    device_type: tasks[selectedTask.associated_task].device_type,
                    _id: selectedTask.associated_task
                }

                dispatch(taskActions.putTask(selectedTask, selectedTask._id))
                dispatch(taskActions.putTask(updatedAssociatedTask, selectedTask.associated_task))

            }

            // If the task is not a human based task but it has no associated tasks
            // that means it was a human based task that is now a device task
            // So make a new device task
            else if (selectedTask.device_type !== 'human' && !selectedTask.associated_task) {

                // New Device task
                const newTask = {
                    ...deepCopy(selectedTask),
                    associated_task: selectedTask._id,
                    _id: uuid.v4(),
                }

                // Old human task
                const updatedTask = {
                    ...deepCopy(selectedTask),
                    device_type: 'human',
                    associated_task: newTask._id,
                }

                dispatch(taskActions.putTask(updatedTask, selectedTask._id))
                dispatch(taskActions.postTask(newTask))

            }



            // Else its just a plain jane task
            else {
                dispatch(taskActions.putTask(selectedTask, selectedTask._id))
            }

        }

        // If this task is part of a process and not already in the graph of routes, then add the task to the selected process
        if (isProcessTask && !selectedProcess.routes.includes(selectedTask._id)) {

            /**
             * The structure of a routes that belong to a process is a directed graph
             * The way it works is the all stations involved with a process are added as keys
             * The values of each station are routes that have that station as the unload station
             * 
             * This means that the very first station in a process wont have a route associated with it because it only loads and doesnt unload
             * 
             * EX:
             * 
             * Station 1 has a route that goes to Station 2 (route1) and Station 3 (route2)
             * Station 2 has a route that goes to Station 3 (route3)
             * Station 3 has no routes that leave the station
             * 
             * So the data structure would look like this:
             * {
             *  station1: [], // No routes that unload here
             *  station2: [route1] // Route 1 unloads here
             *  station3: [route2, route3] // Route 2 and 3 unload here
             * }
             */

            //  Commented out for now
            // let processRoutes = selectedProcess.routes

            // // If the task is already incuded in the process then skip over
            // if (Object.keys(processRoutes).includes(selectedTask.unload.station) && processRoutes[selectedTask.unload.station].includes(selectedTask._id)) return

            // // Else if the process includes the station, then add task to the station
            // else if (Object.keys(processRoutes).includes(selectedTask.unload.station)) {
            //     processRoutes[selectedTask.unload.station].push(selectedTask._id)
            // }

            // // Else the process does not include station, so add station and route
            // else {
            //     processRoutes[selectedTask.unload.station] = [selectedTask._id]
            // }

            // // If the process does not include the load station then add it with no attatched routes (See directed graph explanation above)
            // if(!processRoutes[selectedTask.load.station]) {
            //     processRoutes[selectedTask.load.station] = []
            // }

            if (!!fixingProcess) {

                // If the route addition fixes, process check to see if the process is still broken
                // If it fixes the process, it returns false because if it breaks the process it returns an int which is truethy
                if (!willRouteAdditionFixProcess(selectedProcess, selectedTask, tasks)) {
                    selectedProcess.broken = null
                }
                else {
                    // Update the broken location with the new array position
                    selectedProcess.broken = willRouteAdditionFixProcess(selectedProcess, selectedTask, tasks)
                }

                // Splice in the new route into the correct position
                selectedProcess.routes.splice(selectedProcess.broken - 1, 0, selectedTask._id)

            } else {
                selectedProcess.routes.push(selectedTask._id);

            }

            dispatchSetSelectedProcess(
                selectedProcess
            )

            // Add the process to the task
            selectedTask.processes.push(selectedProcess._id);
            dispatch(taskActions.putTask(selectedTask, selectedTask._id))

        }

        dispatch(taskActions.deselectTask())    // Deselect
        setSelectedTaskCopy(null)                   // Reset the local copy to null
        toggleEditing(false)                            // No longer editing
    }

    /**
     * Removes the route from the array of routes for a process
     */
    const handleRemove = () => {

        // If the route removal breaks the process then updatte the process
        if (!!willRouteDeleteBreakProcess(selectedProcess, selectedTask, tasks)) {
            selectedProcess.broken = willRouteDeleteBreakProcess(selectedProcess, selectedTask, tasks)
        }
        // Remove the route from the process
        const index = selectedProcess.routes.indexOf(selectedTask._id)
        selectedProcess.routes.splice(index, 1)

        dispatchSetSelectedProcess(selectedProcess)

        // Remove from the Route
        const routeIndex = selectedTask.processes.indexOf(selectedProcess._id)
        selectedTask.processes.splice(routeIndex, 1)

        dispatchPutTask(selectedTask, selectedTask._id)

        dispatch(taskActions.deselectTask()) // Deselect
        setSelectedTaskCopy(null) // Reset the local copy to null
        toggleEditing(false)
    }

    const handleBack = () => {
        // Discard the task changes
        if (!!selectedTask.new) {
            dispatch(taskActions.removeTask(selectedTask._id))   // If the task is new, simply remove it from the local copy of tasks
        } else {
            dispatch(taskActions.updateTask(selectedTaskCopy))  // Else, revert the task back to the copy we saved when user started editing
            // dispatch(taskActions.updateTask(tasks[selectedTask._id]))  // Else, revert the task back to the copy we saved when user started editing
        }
        dispatch(taskActions.deselectTask())    // Deselect
        setSelectedTaskCopy(null)                   // Reset the local copy to null
        toggleEditing(false)                            // No longer editing
    }

    const handleObject = () => {

        // If not selected process, then set it to the selected task if the task has an object
        if (!selectedProcess) {
            if (!!selectedTask && !!selectedTask.obj) {
                return objects[selectedTask.obj]
            } else {
                return null
            }
        }

        // Else, it's part of a process
        else {
            // If the selected task already has a object, set it to that
            if (!!selectedTask && !!selectedTask.obj) {
                return objects[selectedTask.obj]
            }

            // Else if its a process and the last route in that process has an object, use that object as the default
            else if (selectedProcess.routes.length > 0 && !!tasks[selectedProcess.routes[selectedProcess.routes.length - 1]].obj) {
                return objects[tasks[selectedProcess.routes[selectedProcess.routes.length - 1]].obj]
            }

            else {
                return null
            }
        }

    }

    return (
        <styled.ContentContainer>

            <ConfirmDeleteModal
                isOpen={!!confirmDeleteModal}
                title={

                    `Are you sure you want to delete this Route? 
                    

                    ${selectedTask.processes.length > 0 ?
                        `This task is a part of processes: 

                        ${selectedTask.processes.map((process) => {
                            // Try catch for error with editing an existing task that belongs to a new process
                            try {
                                return `'${processes[process].name}', `
                                
                            } catch (error) {
                                return ``                             
                            }
                        })}

                        and will be removed from these processes if deleted.
                        `
                        :
                        ''
                    }
                    `
                }
                button_1_text={"Yes"}
                handleOnClick1={() => {
                    onDelete()
                    setConfirmDeleteModal(null)
                }}
                button_2_text={"No"}
                handleOnClick2={() => setConfirmDeleteModal(null)}
                handleClose={() => setConfirmDeleteModal(null)}
            />

            <div style={{ marginBottom: '1rem' }}>
                <ContentHeader
                    content={'tasks'}
                    mode={(!!isProcessTask && selectedTask.new) ? 'add' : 'create'}
                    // Disables the button if load and unloads have not been selected for a task/route in a process
                    disabled={selectedTask !== null && (!selectedTask.load.position || selectedTask.unload.position === null)}
                    onClickSave={async () => {
                        await onSave()
                    }}

                    onClickBack={() => {
                        handleBack()
                    }}
                />
            </div>

            {/*
                If it's a process route and its a new route then add the ability to select alread existing routes.
                Some filtering is done based on certain conditions, see 'options' key
            */}
            {isProcessTask && !!selectedTask.new &&
                <>
                    <styled.Label>
                        <styled.LabelHighlight>Either</styled.LabelHighlight> choose an existing Route...
                    </styled.Label>
                    <DropDownSearch

                        placeholder="Select Existing Route"
                        label="Choose An Existing Route"
                        labelField="name"
                        valueField="name"

                        options={

                            Object.values(tasks)

                                .filter(task => {

                                    // This filters out tasks when fixing a process
                                    // If the process is broken, then you can only select tasks that are associated with the last route before break's unload station
                                    if (!!fixingProcess) {

                                        // Gets the route before break
                                        const routeBeforeBreak = selectedProcess.routes[selectedProcess.broken - 1]
                                        const taskBeforeBreak = tasks[routeBeforeBreak]

                                        if (!!taskBeforeBreak.unload) {
                                            const unloadStationID = taskBeforeBreak.unload.station

                                            if (task.load.station === unloadStationID) {
                                                return true

                                            }
                                        }
                                    }

                                    // If the selected process has routes, then filter out tasks that have load stations that arent the last route's unload station
                                    // This eliminates 'broken' processes with tasks that are between non-connected stations
                                    else if (selectedProcess.routes.length > 0) {

                                        // Gets the previous route
                                        const previousRouteID = selectedProcess.routes[selectedProcess.routes.length - 1]
                                        const previousRoute = tasks[previousRouteID]

                                        // Gets the previouse route unload location
                                        const unloadStationID = previousRoute.unload.station

                                        // If the load and unload station match, then this route can be added to this process
                                        if (task.load.station === unloadStationID) {
                                            return true
                                        }
                                    }

                                    else {
                                        return true
                                    }
                                })

                                // Filter outs any human tasks that have associated tasks (AKA it only shows the associated device task)
                                .filter(task => !task.associated_task || (!!task.associated_task && task.device_type !== 'human'))

                        }
                        // values={!!selectedTask.idle_location ? [positions[selectedTask.idle_location]] : []}
                        dropdownGap={5}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {

                            const newRoute = values[0]._id



                            // If this task is part of a process and not already in the array of routes, then add the task to the selected process
                            if (!selectedProcess.routes.includes(selectedTask._id)) {

                                if (!!fixingProcess) {

                                    // If the route addition fixes, process check to see if the process is still broken
                                    // If it fixes the process, it returns false because if it breaks the process it returns an int which is truethy
                                    if (!willRouteAdditionFixProcess(selectedProcess, values[0], tasks)) {
                                        selectedProcess.broken = null
                                    }
                                    else {
                                        selectedProcess.broken = willRouteAdditionFixProcess(selectedProcess, values[0], tasks)
                                    }

                                    // Splice in the new route into the correct position
                                    selectedProcess.routes.splice(selectedProcess.broken - 1, 0, values[0]._id)

                                } else {
                                    selectedProcess.routes.push(values[0]._id);
                                }

                                dispatchSetSelectedProcess(selectedProcess)

                                dispatchPutTask(
                                    {
                                        ...values[0],
                                        processes: [...values[0].processes, selectedProcess._id]
                                    }
                                    , values[0]._id)
                            }

                            dispatch(taskActions.deselectTask())    // Deselect
                            setSelectedTaskCopy(null)                   // Reset the local copy to null
                            toggleEditing(false)                            // No longer editing
                        }}
                        className="w-100"
                        schema="tasks"
                    />
                </>
            }

            {isProcessTask && !!selectedTask.new &&

                <styled.Label style={{ marginTop: '1rem' }}>
                    <styled.LabelHighlight>Or</styled.LabelHighlight> make a new one
                </styled.Label>

            }

            {/* Task Title */}
            <Textbox
                placeholder="Task Name"
                defaultValue={!!selectedTask && selectedTask.name}
                schema={'tasks'}
                focus={!!selectedTask && selectedTask.name == ''}
                onChange={(e) => {
                    dispatch(taskActions.setTaskAttributes(selectedTask._id, { name: e.target.value }))

                }}
                style={{ fontSize: '1.2rem', fontWeight: '600' }}
            />

            {isTransportTask &&
                <>
                    <TextBoxSearch
                        placeholder="Object"
                        label={obj._id === undefined ? "New object will be created" : null}
                        labelField="name"
                        valueField="name"
                        options={Object.values(objects).filter((obj) => obj.map_id === currentMap._id)}
                        defaultValue={handleObject()}
                        textboxGap={0}
                        closeOnSelect="true"
                        onChange={(values) => {
                            setObject(values[0])
                            // dispatchSetSelectedTask({
                            //     ...selectedTask,
                            //     load: {
                            //         ...selectedTask.load,
                            //         instructions: objects[selectedTask.obj] && !selectedTask.load.instructions.includes(objects[selectedTask.obj])`Load ${!selectedTask.load.instructions.includes(objects[selectedTask.obj])  }`
                            //     },
                            //     unload: {
                            //         ...selectedTask.unload,
                            //         instructions: `Unload ${values[0].name}`
                            //     },
                            // })
                        }}
                        className="w-100"
                        schema="tasks"
                        disbaled={!isTransportTask}
                        style={{ marginTop: '1rem' }}
                    />

                    <styled.HelpText>
                        Select the object that will be transported. Either search & select an existing object, or type the
                        name of a new object to create one.
                    </styled.HelpText>

                    {(!!selectedTask.obj || !!obj) &&
                        <>
                            <styled.Label>Track Using Quantity or Fractions</styled.Label>
                            <styled.RowContainer style={{ justifyContent: 'center' }}>
                                <styled.DualSelectionButton
                                    style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                                    onClick={() => {
                                        dispatchSetSelectedTask({
                                            ...selectedTask,
                                            track_quantity: !selectedTask.track_quantity
                                        })
                                    }}
                                    selected={selectedTask.track_quantity}
                                >
                                    Quantity
                            </styled.DualSelectionButton>

                                <styled.DualSelectionButton
                                    style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                                    onClick={() => {
                                        dispatchSetSelectedTask({
                                            ...selectedTask,
                                            track_quantity: !selectedTask.track_quantity
                                        })
                                    }}
                                    selected={!selectedTask.track_quantity}

                                >
                                    Fraction
                            </styled.DualSelectionButton>

                            </styled.RowContainer>
                        </>
                    }
                </>
            }

            {/* Commented out for now, will posibly re-introduce later */}
            {/* Pull VS Push */}
            {/* <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', marginTop: '1rem' }}>
                <Button schema={'tasks'} style={{ height: '1.8rem', fontSize: '1rem', flexGrow: '1' }}
                    onClick={() => { // If the shift key is pressed and the other button is pressed, change type to 'both'
                        if (shift && selectedTask.type == 'pull') {
                            dispatch(taskActions.setTaskAttributes(selectedTask._id, { type: 'both' }))
                        } else {
                            dispatch(taskActions.setTaskAttributes(selectedTask._id, { type: 'push' }))
                        }
                    }}
                    disabled={!isTransportTask}
                    active={selectedTask.type == 'push' || selectedTask.type == 'both'}>Push</Button>
                <Button schema={'tasks'} style={{ height: '1.8rem', fontSize: '1rem', flexGrow: '1' }}
                    onClick={() => { // If the shift key is pressed and the other button is pressed, change type to 'both'
                        if (shift && selectedTask.type == 'push') {
                            dispatch(taskActions.setTaskAttributes(selectedTask._id, { type: 'both' }))
                        } else {
                            dispatch(taskActions.setTaskAttributes(selectedTask._id, { type: 'pull' }))
                        }
                    }}
                    disabled={!isTransportTask}
                    active={selectedTask.type == 'pull' || selectedTask.type == 'both'}>Pull</Button>
            </div>
            {isTransportTask &&
                <styled.HelpText>
                    A push task will be called by the user at the load location; while a pull task will be called
                by the user at the unload location. To have the task display at both stations <b>Shift-Click</b>.
            </styled.HelpText>
            } */}

            {/* Load and Unload Parameters */}
            <div style={{ height: "100%", paddingTop: "1rem" }}>
                {renderLoadUnloadParameters()}
            </div>

            <hr />

            {/* Remove Task From Process Button */}
            {selectedProcess &&
                <Button
                    schema={'tasks'}
                    disabled={!!selectedTask && !!selectedTask._id && !!selectedTask.new}
                    primary
                    onClick={() => {
                        handleRemove()
                    }}
                >
                    Remove
            </Button>
            }


            {/* Delete Task Button */}
            <Button
                schema={'tasks'}
                disabled={!!selectedTask && !!selectedTask._id && !!selectedTask.new}
                secondary
                onClick={() => {
                    setConfirmDeleteModal(true)
                }}
            >
                Delete
            </Button>
        </styled.ContentContainer>

    )
}

export default EditTask
