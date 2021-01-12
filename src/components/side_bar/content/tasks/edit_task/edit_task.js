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
import { selectLocation, deselectLocation } from '../../../../../redux/actions/locations_actions'
import { select } from 'd3-selection'
import {DEVICE_CONSTANTS} from "../../../../../constants/device_constants";
import {generateAssociatedTask} from "../../../../../methods/utils/route_utils";

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
    const dispatchPutProcesses = async (process) => await dispatch(putProcesses(process))
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const dispatchDeleteTask = (ID) => dispatch(deleteTask(ID))
    const dispatchPutStation = (station, ID) => dispatch(putStation(station, ID))
    const dispatchPutDashboard = (dashboard, ID) => dispatch(putDashboard(dashboard, ID))
    const dispatchPutTask = (task, id) => dispatch(putTask(task, id))
    const dispatchPostDashboard = (dashboard) => dispatch(postDashboard(dashboard))
    const dispatchSetFixingProcess = (bool) => dispatch(setFixingProcess(bool))
    const dispatchSetSelectedLocation = (id) => dispatch(selectLocation(id))
    const dispatchDeselectLocation = () => dispatch(deselectLocation())

    let routes = useSelector(state => state.tasksReducer.tasks)
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
        setSelectedTaskCopy(selectedTask)

        // Commented out for now
        // Used to disable locations from being selected
        // if (!!isProcessTask && selectedProcess.routes.length > 0 && selectedTask.load.position === null) {

        //     const previousRoute = selectedProcess.routes[selectedProcess.routes.length - 1]

        //     const previousTask = tasks[previousRoute]

        //     if (!!previousTask.unload) {
        //         const unloadStationID = previousTask.unload.station
        //         console.log('QQQQ Should be highlighting location', unloadStationID)

        //         dispatchSetSelectedLocation(unloadStationID)
        //     }

        // }

        return () => {
            // When unmounting edit task, always set fixing process to false
            // This will take care of when it's set to true in edit process
            dispatchSetFixingProcess(false)
            dispatchDeselectLocation()

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
            ).forEach(currDashboard => {
                var currButtons = [...currDashboard.buttons]

                let ind = currButtons.findIndex(button => button.task_id == selectedTask._id)
                if (ind !== -1) {
                    // remove button at index
                    currButtons.splice(ind, 1)

                    // update dashboard
                    dispatch(dashboardActions.putDashboard({
                        ...currDashboard,
                        buttons: currButtons
                    }, currDashboard._id.$oid))
                }
            }
            )

        // If the task has associated processes, then remove that task from that process
        if (selectedTask.processes.length > 0) {
            selectedTask.processes.map(async (process) => {
                let updatedProcess = processes[process]

                // If the route removal breaks the process then update the process
                if (!!willRouteDeleteBreakProcess(updatedProcess, selectedTask, routes)) {
                    updatedProcess.broken = willRouteDeleteBreakProcess(updatedProcess, selectedTask, routes)
                }

                // Removes the task from the array of routes
                const index = updatedProcess.routes.indexOf(selectedTask._id)
                updatedProcess.routes.splice(index, 1)

                // Update the process if need be
                if (!!selectedProcess && selectedProcess._id === updatedProcess._id) {
                    await dispatchSetSelectedProcess({
                        ...updatedProcess,
                    })
                }

                await dispatchPutProcesses({
                    ...updatedProcess,
                })

            })
        }

        await dispatch(taskActions.deleteTask(selectedTask._id));

        dispatchSetSelectedTask(null)
        toggleEditing(false)
    }

    const updateDashboard = () => {
        // Add the task automatically to the associated load station dashboard
        // Since as of now the only type of task we are doing is push, only need to add it to the load location
        let updatedStation = deepCopy(stations[selectedTask.load.station])

        let updatedDashboard = dashboards[updatedStation.dashboards[0]]

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
    }

    const createObject = () => {
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

        return objectId
    }


    const onSave = async () => {
        console.log("editTask onSave")
        // modifiable copy of task
        var updatedSelectedTask = {...selectedTask}

        // handle object creation
        updatedSelectedTask.obj = createObject()

        // update task process info
        updateProcessInfo(updatedSelectedTask)

        // Save Task
        if (!!updatedSelectedTask.new) { // If task is new, POST
            console.log("editTask onSave NEW")

            // POST new task
            await dispatch(taskActions.postTask(updatedSelectedTask))

            // dashboard needs to be updated with button for new task
            updateDashboard()

        } else {    // If task is not new, PUT
            console.log("editTask onSave EDIT")
            dispatch(taskActions.putTask(updatedSelectedTask, updatedSelectedTask._id))
        }

        toggleEditing(false)                            // No longer editing ***NOTE: THIS SHOULD COME BEFORE DESELECTING THE TASK IN ORDER TO AVOID CRASH IN EDIT_PROCESS - QUICK AND DIRTY FIX, REALLY THE WHOLE FUNCTION NEEDS TO BE REWRITTEN***
        dispatch(taskActions.deselectTask())    // Deselect
        setSelectedTaskCopy(null)                   // Reset the local copy to null
    }


    const updateProcessInfo = (task) => {
        // If this task is part of a process and not already in the graph of routes, then add the task to the selected process
        if (isProcessTask && !selectedProcess.routes.includes(task._id)) {

            if (!!fixingProcess) {

                // If the route addition fixes, process check to see if the process is still broken
                // If it fixes the process, it returns false because if it breaks the process it returns an int which is truethy
                if (!willRouteAdditionFixProcess(selectedProcess, task, routes)) {
                    selectedProcess.broken = null
                }
                else {
                    // Update the broken location with the new array position
                    selectedProcess.broken = willRouteAdditionFixProcess(selectedProcess, task, routes)
                }

                // Splice in the new route into the correct position
                selectedProcess.routes.splice(selectedProcess.broken - 1, 0, task._id)

            } else {
                selectedProcess.routes.push(task._id);

            }

            dispatchSetSelectedProcess(
                selectedProcess
            )

            if(!task.processes.includes(selectedProcess._id)) task.processes.push(selectedProcess._id)

            // return {
            //     ...task,
            //     processes: [...task.processes, selectedProcess._id]
            // }
        }
    }

    /**
     * Removes the route from the array of routes for a process
     */
    const handleRemove = () => {
        var updatedProcess = {...selectedProcess}

        const willBreak = willRouteDeleteBreakProcess(updatedProcess, selectedTask, routes)

        // If the route removal breaks the process then updatte the process
        if (!!willBreak) {
            updatedProcess.broken = willBreak
        }
        // Remove the route from the process
        const index = updatedProcess.routes.indexOf(selectedTask._id)
        var updatedRoutes = [...updatedProcess.routes]
        updatedRoutes.splice(index, 1)

        dispatchSetSelectedProcess({
            ...updatedProcess,
            routes: updatedRoutes
        })

        // Remove process from the route
        const routeIndex = selectedTask.processes.indexOf(updatedProcess._id)
        var updatedProcesses = [...selectedTask.processes]
        updatedProcesses.splice(routeIndex, 1)

        dispatchPutTask({
            ...selectedTask,
            processes: updatedProcesses
        }, selectedTask._id)

        toggleEditing(false)
        dispatch(taskActions.deselectTask()) // Deselect
        setSelectedTaskCopy(null) // Reset the local copy to null
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
            if(!!selectedTask){
              if (!!selectedTask.obj) {
                  return objects[selectedTask.obj]
              }
            }


            // Else if its a process and the last route in that process has an object, use that object as the default
            else if (selectedProcess.routes.length > 0 && !!routes[selectedProcess.routes[selectedProcess.routes.length - 1]].obj) {
                return objects[routes[selectedProcess.routes[selectedProcess.routes.length - 1]].obj]
            }

            else {
                return null
            }
        }

    }

    return (
        <>
            {!!selectedTask &&

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
                                        return ` '${processes[process].name}'`

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
                        {selectedTask &&
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
                        }

                    </div>

                    {/*
                If it's a process route and its a new route then add the ability to select alread existing routes.
                Some filtering is done based on certain conditions, see 'options' key
            */}
                    {!!selectedTask && isProcessTask && !!selectedTask.new &&
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

                                    Object.values(routes)

                                        .filter(task => {

                                            // This filters out tasks when fixing a process
                                            // If the process is broken, then you can only select tasks that are associated with the last route before break's unload station
                                            if (!!fixingProcess) {

                                                // Gets the route before break
                                                const routeIdBeforeBreak = selectedProcess.routes[selectedProcess.broken - 1]
                                                const routeBeforeBreak = routes[routeIdBeforeBreak]

                                                if (!!routeBeforeBreak.unload) {
                                                    const unloadStationID = routeBeforeBreak.unload.station

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
                                                const previousRoute = routes[previousRouteID]

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
                                            if (!willRouteAdditionFixProcess(selectedProcess, values[0], routes)) {
                                                selectedProcess.broken = null
                                            }
                                            else {
                                                selectedProcess.broken = willRouteAdditionFixProcess(selectedProcess, values[0], routes)
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

                    {!!selectedTask && isProcessTask && !!selectedTask.new &&

                        <styled.Label style={{ marginTop: '1rem' }}>
                            <styled.LabelHighlight>Or</styled.LabelHighlight> make a new one
                </styled.Label>

                    }

                    {/* Task Title */}
                    <Textbox
                        placeholder="Route Name"
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
                                                    track_quantity: true
                                                })
                                                setSelectedTaskCopy({
                                                    ...selectedTask,
                                                    track_quantity: false
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
                                                    track_quantity: false
                                                })
                                                setSelectedTaskCopy({
                                                    ...selectedTask,
                                                    track_quantity: false
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
                            Remove Route
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
                        Delete Route
            </Button>
                </styled.ContentContainer>
            }
        </>

    )
}

export default EditTask
