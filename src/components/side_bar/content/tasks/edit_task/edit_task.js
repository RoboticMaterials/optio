import React, { useState, useEffect } from 'react'
import * as styled from '../tasks_content.style'
import { useSelector, useDispatch } from 'react-redux'

import ContentHeader from '../../content_header/content_header'
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'
import TextBoxSearch from '../../../../basic/textbox_search/textbox_search'

import ContentList from '../../content_list/content_list'


import * as taskActions from '../../../../../redux/actions/tasks_actions'
import * as dashboardActions from '../../../../../redux/actions/dashboards_actions'
import * as objectActions from '../../../../../redux/actions/objects_actions'
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import { putProcesses, setSelectedProcess } from '../../../../../redux/actions/processes_actions'

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

    let tasks = useSelector(state => state.tasksReducer.tasks)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const sounds = useSelector(state => state.soundsReducer.sounds)
    const objects = useSelector(state => state.objectsReducer.objects)

    const stations = useSelector(state => state.locationsReducer.stations)
    const positions = useSelector(state => state.locationsReducer.positions)
    const locations = useSelector(state => state.locationsReducer.locations)


    const [obj, setObject] = useState({}) // The current object (may or may not be on backend, but if not it will be posted when task is saved)


    const loadUnloadFields = () => {
        return (
            <>
                <styled.Header>Load</styled.Header>
                <Textbox
                    defaultValue={!!selectedTask && selectedTask.load.instructions}
                    schema={'tasks'}
                    focus={!!selectedTask && selectedTask.type == null}
                    onChange={e => {
                        let load = selectedTask.load
                        load.instructions = e.target.value
                        dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { load }))
                    }}
                    lines={2}>
                </Textbox>
                <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                    <styled.Label>Sound </styled.Label>
                    <DropDownSearch
                        placeholder="Select Sound"
                        label="Sound to be played upon arrival"
                        labelField="name"
                        valueField="name"
                        options={sounds}
                        values={sounds.filter(sound => sound.name == 'None')}
                        dropdownGap={5}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {
                            let load = selectedTask.load
                            load.sound = values[0]._id
                            dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { load }))
                        }}
                        className="w-100"
                        schema="tasks" />
                </div>

                <styled.Header>Unload</styled.Header>
                <Textbox
                    defaultValue={!!selectedTask && selectedTask.unload.instructions}
                    schema={'tasks'}
                    focus={!!selectedTask && selectedTask.type == null}
                    onChange={e => {
                        let unload = selectedTask.unload
                        unload.instructions = e.target.value
                        dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { unload }))
                    }}
                    lines={2}>
                </Textbox>
                <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                    <styled.Label>Sound </styled.Label>
                    <DropDownSearch
                        placeholder="Select Sound"
                        label="Sound to be played upon arrival"
                        labelField="name"
                        valueField="name"
                        options={sounds}
                        values={sounds.filter(sound => sound.name == 'None')}
                        dropdownGap={5}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {
                            let unload = selectedTask.unload
                            unload.sound = values[0]._id
                            dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { unload }))
                        }}
                        className="w-100"
                        schema="tasks" />
                </div>
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

    const handleDelete = () => {
        // Delete all dashboard buttons associated with that task
        Object.values(dashboards)
            .filter(dashboard =>
                dashboard.station == selectedTask.load.station || dashboard.station == selectedTask.unload.station
            ).forEach(dashboard => {
                let ind = dashboard.buttons.findIndex(button => button.task_id == selectedTask._id.$oid)
                if (ind !== -1) {
                    dashboard.buttons.splice(ind, 1)
                    dispatch(dashboardActions.putDashboard(dashboard, dashboard._id.$oid))
                }
            }
            )

        if (isProcessTask) {

            // Removes the task from the array of routes
            const index = selectedProcess.routes.indexOf(selectedTask._id.$oid)
            const newRoutes = selectedProcess.routes.splice(index, 1)

            onSetSelectedProcess({
                ...selectedProcess,
                routes: [...newRoutes]
            })
            onPutProcesses({
                ...selectedProcess,
                routes: [...newRoutes]
            })
        }
        dispatch(taskActions.deleteTask(selectedTask._id.$oid));
        dispatch(taskActions.deselectTask());
        toggleEditing(false)
    }

    const handleSave = async () => {
        // Save object
        let objectId
        if ('name' in obj) {
            if (obj._id == undefined) { // If the object does not currently exist, make a new one
                const postedObject = await dispatch(objectActions.postObject({
                    name: obj.name,
                    description: "",
                    modelName: "",
                    dimensions: null
                }))
                objectId = postedObject._id.$oid
            } else { //  Otherwise just set the task obj to the existing obj
                objectId = obj._id.$oid
            }
        }

        Object.assign(selectedTask, { obj: objectId })

        let taskId = ''

        // Save Task
        if (selectedTask._id.$oid == '__NEW_TASK') { // If task is new, POST
            delete selectedTask._id
            const postTaskPromise = dispatch(taskActions.postTask(selectedTask))

            // Uses this promise to find the ID for processes
            postTaskPromise.then(postedTask => {
                console.log('QQQQ posted task',postedTask )
                taskId = postedTask._id.$oid

                // If this task is part of a process, then add the task to the selected process
                // Have to do this function twice because it seems that you cant await the promise
                if (isProcessTask) {
                    onSetSelectedProcess({
                        ...selectedProcess,
                        routes: [...selectedProcess.routes, taskId]
                    })
                    // onPutProcesses({
                    //     ...selectedProcess,
                    //     routes: [...selectedProcess.routes, taskId]
                    // })
                }
            })

            dispatch(taskActions.removeTask('__NEW_TASK')) // Remove the temporary task from the local copy of tasks
        } else {    // If task is not new, PUT
            taskId = selectedTask._id.$oid
            await dispatch(taskActions.putTask(selectedTask, selectedTask._id.$oid))

            // If this task is part of a process, then add the task to the selected process
            // Have to do this function twice because it seems that you cant await the promise
            if (isProcessTask) {
                onSetSelectedProcess({
                    ...selectedProcess,
                    routes: [...selectedProcess.routes, taskId]
                })
                // onPutProcesses({
                //     ...selectedProcess,
                //     routes: [...selectedProcess.routes, taskId]
                // })
            }
        }



        dispatch(taskActions.deselectTask())    // Deselect
        setSelectedTaskCopy(null)                   // Reset the local copy to null
        toggleEditing(false)                            // No longer editing
    }

    const handleBack = () => {
        // Discard the task changes

        if (selectedTask._id.$oid == '__NEW_TASK') {
            dispatch(taskActions.removeTask('__NEW_TASK'))   // If the task is new, simply remove it from the local copy of tasks
        } else {
            dispatch(taskActions.updateTask(selectedTaskCopy))  // Else, revert the task back to the copy we saved when user started editing
        }
        dispatch(taskActions.deselectTask())    // Deselect
        setSelectedTaskCopy(null)                   // Reset the local copy to null
        toggleEditing(false)                            // No longer editing
    }

    return (
        <styled.ContentContainer>
            <div style={{ marginBottom: '1rem' }}>
                <ContentHeader
                    content={'tasks'}
                    mode={!!isProcessTask ? 'add' : 'create'}
                    // Disables the button if load and unloads have not been selected for a task/route in a process
                    disabled={!!isProcessTask && (!selectedTask.load.position || selectedTask.unload.position === null)}
                    onClickSave={async () => {
                        await handleSave()
                    }}

                    onClickBack={() => {
                        handleBack()
                    }}
                />
            </div>
            {/* Task Title */}
            <Textbox
                placeholder="Task Name"
                defaultValue={!!selectedTask && selectedTask.name}
                schema={'tasks'}
                focus={!!selectedTask && selectedTask.name == ''}
                onChange={(e) => { dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { name: e.target.value })) }}
                style={{ fontSize: '1.2rem', fontWeight: '600' }}>
            </Textbox>

            {isTransportTask &&
                <>
                    <TextBoxSearch
                        placeholder="Object"
                        label={obj._id == undefined ? "New object will be created" : null}
                        labelField="name"
                        valueField="name"
                        options={Object.values(objects)}
                        defaultValue={!!selectedTask && !!selectedTask.obj ? objects[selectedTask.obj] : null}
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

            {/* Pull VS Push */}
            <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '1', marginTop: '1rem' }}>
                <Button schema={'tasks'} style={{ height: '1.8rem', fontSize: '1rem', flexGrow: '1' }}
                    onClick={() => { // If the shift key is pressed and the other button is pressed, change type to 'both'
                        if (shift && selectedTask.type == 'pull') {
                            dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { type: 'both' }))
                        } else {
                            dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { type: 'push' }))
                        }
                    }}
                    disabled={!isTransportTask}
                    active={selectedTask.type == 'push' || selectedTask.type == 'both'}>Push</Button>
                <Button schema={'tasks'} style={{ height: '1.8rem', fontSize: '1rem', flexGrow: '1' }}
                    onClick={() => { // If the shift key is pressed and the other button is pressed, change type to 'both'
                        if (shift && selectedTask.type == 'push') {
                            dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { type: 'both' }))
                        } else {
                            dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { type: 'pull' }))
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
            }

            {/* Load and Unload Parameters */}
            <div style={{ height: "100%", paddingTop: "1rem" }}>
                {handleLoadUnloadParameters()}
            </div>

            {/* Delete Task Button */}
            <Button
                schema={'tasks'}
                disabled={!!selectedTask && !!selectedTask._id && selectedTask._id.$oid == '__NEW_TASK'}
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