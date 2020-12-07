import React, { useState, useEffect } from 'react'
import * as styled from '../tasks_content.style'
import { useSelector, useDispatch } from 'react-redux'

// Import Basic Components
import ContentHeader from '../../content_header/content_header'
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'
import TextBoxSearch from '../../../../basic/textbox_search/textbox_search'
import Switch from 'react-ios-switch';
// import TimePicker from '../../../../basic/time_picker/TimePicker'
import moment from 'moment';

// import TimePickerField from '../../../../basic/form/time_picker_field/time_picker_field';

import TimePicker from 'rc-time-picker';

import ContentList from '../../content_list/content_list'

// Import utils
import uuid from 'uuid'
import { deepCopy } from '../../../../../methods/utils/utils'

// Import actions
import * as taskActions from '../../../../../redux/actions/tasks_actions'
import { setSelectedTask, deleteTask, getTasks } from '../../../../../redux/actions/tasks_actions'
import * as dashboardActions from '../../../../../redux/actions/dashboards_actions'
import { putDashboard } from '../../../../../redux/actions/dashboards_actions'
import * as objectActions from '../../../../../redux/actions/objects_actions'
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import { putProcesses, setSelectedProcess } from '../../../../../redux/actions/processes_actions'
import { putStation } from '../../../../../redux/actions/stations_actions'

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
    const onPostTaskQueue = (ID) => dispatch(postTaskQueue(ID))
    const onPutProcesses = (process) => dispatch(putProcesses(process))
    const onSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const onSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const onDeleteTask = (ID) => dispatch(deleteTask(ID))
    const onGetTasks = () => dispatch(getTasks())
    const onPutStation = (station, ID) => dispatch(putStation(station, ID))
    const onPutDashboard = (dashboard, ID) => dispatch(putDashboard(dashboard, ID))

    let tasks = useSelector(state => state.tasksReducer.tasks)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const sounds = useSelector(state => state.soundsReducer.sounds)
    const objects = useSelector(state => state.objectsReducer.objects)
    const currentMap = useSelector(state => state.mapReducer.currentMap)

    const stations = useSelector(state => state.locationsReducer.stations)
    const positions = useSelector(state => state.locationsReducer.positions)
    const locations = useSelector(state => state.locationsReducer.locations)


    const [obj, setObject] = useState({}) // The current object (may or may not be on backend, but if not it will be posted when task is saved)

    useEffect(() => {
        console.log('QQQQ Selected Task', selectedTask)
        return () => {

        }
    }, [])


    const loadUnloadFields = () => {

        // This handles if any position of a route is a human position, then it cant be done by a robot
        let humanPosition = false
        if (positions[selectedTask.load.position].type === 'human_position' || positions[selectedTask.unload.position].type === 'human_position') {
            humanPosition = true

            if (selectedTask.device_type !== 'human') {
                onSetSelectedTask({
                    ...selectedTask,
                    device_type: 'human',
                })
            }

        }

        return (
            <>
                {!humanPosition &&
                    <>
                        <styled.RowContainer>
                            <styled.Header>Robot Enabled</styled.Header>
                            <Switch
                                checked={selectedTask.device_type !== 'human'}
                                onChange={() => {

                                    const device_type = selectedTask.device_type !== 'human' ? 'human' : 'MiR_100'
                                    onSetSelectedTask({
                                        ...selectedTask,
                                        // Just setting this to MiR100 for now. Need to expand in the future for other devices
                                        device_type: device_type
                                    })
                                }}
                                onColor='red'
                                style={{ marginRight: '1rem' }}
                            />

                        </styled.RowContainer>
                        <styled.HelpText>Do you want a robot to perform this task? If selected, there will be an option for a person to take over the task when the button is placed onto the dashboard.</styled.HelpText>
                    </>
                }



                <styled.RowContainer style={{ marginTop: '2rem' }}>

                    <styled.Header style={{ marginTop: '0rem' }}>Load</styled.Header>
                    <styled.RowContainer style={{ justifyContent: 'flex-end', alignItems: 'baseline' }}>
                        <styled.HelpText style={{ fontSize: '1rem', marginRight: '.5rem' }}>TimeOut: </styled.HelpText>

                        <TimePicker
                            // format={'mm:ss'}
                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
                            showHour={false}
                            className="xxx"
                            allowEmpty={false}
                            defaultOpenValue={!!selectedTask.load.timeout ? moment().set({ 'minute': selectedTask.load.timeout.split(':')[0], 'second': selectedTask.load.timeout.split(':')[1] }) : moment().set({ 'minute': 1, 'second': 0 })}
                            defaultValue={!!selectedTask.load.timeout ? moment().set({ 'minute': selectedTask.load.timeout.split(':')[0], 'second': selectedTask.load.timeout.split(':')[1] }) : moment().set({ 'minute': 1, 'second': 0 })}
                            onChange={(time) => {
                                onSetSelectedTask({
                                    ...selectedTask,
                                    load: {
                                        ...selectedTask.load,
                                        timeout: time.format("mm:ss")
                                    }
                                })
                            }}

                        />
                    </styled.RowContainer>

                </styled.RowContainer>

                <Textbox
                    defaultValue={!!selectedTask && selectedTask.load.instructions}
                    schema={'tasks'}
                    focus={!!selectedTask && selectedTask.type == null}
                    onChange={e => {
                        let load = selectedTask.load
                        load.instructions = e.target.value
                        dispatch(taskActions.setTaskAttributes(selectedTask._id, { load }))
                    }}
                    lines={2}>
                </Textbox>

                {selectedTask.device_type !== 'human' &&
                    <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                        <styled.Label>Sound </styled.Label>
                        <DropDownSearch
                            placeholder="Select Sound"
                            label="Sound to be played upon arrival"
                            labelField="name"
                            valueField="name"
                            options={Object.values(sounds)}
                            values={!!selectedTask.load.sound ? [sounds[selectedTask.load.sound]] : []}
                            dropdownGap={5}
                            noDataLabel="No matches found"
                            closeOnSelect="true"
                            onChange={values => {
                                onSetSelectedTask({
                                    ...selectedTask,
                                    load: {
                                        ...selectedTask.load,
                                        sound: values[0]._id,
                                    }
                                })
                            }}
                            className="w-100"
                            schema="tasks" />
                    </div>
                }

                <styled.Header>Unload</styled.Header>
                <Textbox
                    defaultValue={!!selectedTask && selectedTask.unload.instructions}
                    schema={'tasks'}
                    focus={!!selectedTask && selectedTask.type == null}
                    onChange={e => {
                        let unload = selectedTask.unload
                        unload.instructions = e.target.value
                        dispatch(taskActions.setTaskAttributes(selectedTask._id, { unload }))
                    }}
                    lines={2}>
                </Textbox>

                {selectedTask.device_type !== 'human' &&

                    <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                        <styled.Label>Sound </styled.Label>
                        <DropDownSearch
                            placeholder="Select Sound"
                            label="Sound to be played upon arrival"
                            labelField="name"
                            valueField="name"
                            options={Object.values(sounds)}
                            values={!!selectedTask.unload.sound ? [sounds[selectedTask.unload.sound]] : []}
                            dropdownGap={5}
                            noDataLabel="No matches found"
                            closeOnSelect="true"
                            onChange={values => {

                                onSetSelectedTask({
                                    ...selectedTask,
                                    unload: {
                                        ...selectedTask.unload,
                                        sound: values[0]._id,
                                    }
                                })

                            }}
                            className="w-100"
                            schema="tasks" />
                    </div>
                }


                {selectedTask.device_type === 'MiR_100' &&
                    <>
                        <styled.Header>Idle Location</styled.Header>
                        <DropDownSearch
                            placeholder="Select Location"
                            label="Idle Location for MiR Cart"
                            labelField="name"
                            valueField="name"
                            options={Object.values(positions)}
                            values={!!selectedTask.idle_location ? [positions[selectedTask.idle_location]] : []}
                            dropdownGap={5}
                            noDataLabel="No matches found"
                            closeOnSelect="true"
                            onChange={values => {

                                const idleLocation = values[0]._id

                                onSetSelectedTask({
                                    ...selectedTask,
                                    idle_location: idleLocation,
                                })
                            }}
                            className="w-100"
                            schema="tasks"
                        />
                    </>
                }


            </>
        )
    }

    const handleLoadUnloadParameters = () => {
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
                return loadUnloadFields()
            }
        }
    }

    const handleDelete = async () => {
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

        if (!!isProcessTask) {

            // Removes the task from the array of routes
            const copyProcess = deepCopy(selectedProcess)
            const index = copyProcess.routes.indexOf(selectedTask._id)
            copyProcess.routes.splice(index, 1)

            onSetSelectedProcess({
                ...copyProcess,
            })
            onPutProcesses({
                ...copyProcess,
            })
        }

        // If the selected task has an associated task, (usually and device and human task)
        // Delete the associated task
        if (!!selectedTask.associated_task) {
            dispatch(taskActions.deleteTask(selectedTask.associated_task));
        }

        dispatch(taskActions.deleteTask(selectedTask._id));

        // dispatch(taskActions.deselectTask());
        onSetSelectedTask(null)
        toggleEditing(false)
    }

    const handleSave = async () => {
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
            let updatedDashboard = dashboards[updatedStation.dashboards[0]]
            const newDashboardButton = {
                color: '#bcbcbc',
                id: selectedTask._id,
                name: selectedTask.name,
                task_id: selectedTask._id
            }
            updatedDashboard.buttons.push(newDashboardButton)
            onPutDashboard(updatedDashboard, updatedDashboard._id.$oid)


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
                onDeleteTask(selectedTask._id)

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

        // If this task is part of a process and not already in the array of routes, then add the task to the selected process
        if (isProcessTask && !selectedProcess.routes.includes(selectedTask._id)) {
            onSetSelectedProcess({
                ...selectedProcess,
                routes: [...selectedProcess.routes, selectedTask._id]
            })
        }

        dispatch(taskActions.deselectTask())    // Deselect
        setSelectedTaskCopy(null)                   // Reset the local copy to null
        toggleEditing(false)                            // No longer editing
    }

    /**
     * Removes the route from the array of routes for a process
     */
    const handleRemove = () => {

        const index = selectedProcess.routes.indexOf(selectedTask._id)
        const updatedRoutes = deepCopy(selectedProcess.routes)

        updatedRoutes.splice(index, 1)

        onSetSelectedProcess({
            ...selectedProcess,
            routes: updatedRoutes
        })

        dispatch(taskActions.deselectTask()) // Deselect
        setSelectedTaskCopy(null) // Reset the local copy to null
        toggleEditing(false)
    }

    const handleBack = () => {
        // Discard the task changes

        if (!!selectedTask.new) {
            dispatch(taskActions.removeTask(selectedTask._id))   // If the task is new, simply remove it from the local copy of tasks
        } else {
            dispatch(taskActions.updateTask(selectedTask))  // Else, revert the task back to the copy we saved when user started editing
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

            <div style={{ marginBottom: '1rem' }}>
                <ContentHeader
                    content={'tasks'}
                    mode={(!!isProcessTask && selectedTask.new) ? 'add' : 'create'}
                    // Disables the button if load and unloads have not been selected for a task/route in a process
                    disabled={selectedTask !== null && (!selectedTask.load.position || selectedTask.unload.position === null)}
                    onClickSave={async () => {
                        await handleSave()
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

                                    // If the selected process has routes, then filter out tasks that have load stations that arent the last route's unload station
                                    // This eliminates 'broken' processes with tasks that are between non-connected stations
                                    if (selectedProcess.routes.length > 0) {

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

                        }
                        // values={!!selectedTask.idle_location ? [positions[selectedTask.idle_location]] : []}
                        dropdownGap={5}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {

                            const newRoute = values[0]._id

                            console.log('QQQQ route', newRoute)

                            // If this task is part of a process and not already in the array of routes, then add the task to the selected process
                            if (!selectedProcess.routes.includes(selectedTask._id)) {
                                onSetSelectedProcess({
                                    ...selectedProcess,
                                    routes: [...selectedProcess.routes, newRoute]
                                })
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
                        onChange={(values) => setObject(values[0])}
                        className="w-100"
                        schema="tasks"
                        disbaled={!isTransportTask}
                        style={{ marginTop: '1rem' }} />
                    <styled.HelpText>
                        Select the object that will be transported. Either search & select an existing object, or type the
                        name of a new object to create one.
                    </styled.HelpText>
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
                {handleLoadUnloadParameters()}
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
                    handleDelete()
                }}
            >
                Delete
            </Button>
        </styled.ContentContainer>

    )
}

export default EditTask