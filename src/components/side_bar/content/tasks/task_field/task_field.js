import React, { useState, useEffect } from 'react'
import * as styled from '../tasks_content.style'
import { useSelector, useDispatch } from 'react-redux'


/*
*
* Should track quantity / fraction option only display if there is an obj? in master it always displays
*
* When creating new process
*   when adding route, should click add create the route in mongo, or should this wait until the process is made as well
*       If we don't wait till the process is saved, if you leave the page / refresh / cancel, the route will already be made without the process. I think wait - Justin
*
* */



// Import Basic Components
import ContentHeader from '../../content_header/content_header'
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'

// Import Components
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import LoadUnloadFields from './fields/load_unload_fields'

// Import utils
import uuid from 'uuid'
import { deepCopy } from '../../../../../methods/utils/utils'
import { willRouteDeleteBreakProcess, willRouteAdditionFixProcess } from '../../../../../methods/utils/processes_utils'

// Import actions
import * as taskActions from '../../../../../redux/actions/tasks_actions'
import { setSelectedTask } from '../../../../../redux/actions/tasks_actions'
import * as dashboardActions from '../../../../../redux/actions/dashboards_actions'
import { putDashboard, postDashboard } from '../../../../../redux/actions/dashboards_actions'
import * as objectActions from '../../../../../redux/actions/objects_actions'
import { putProcesses, setSelectedProcess, setFixingProcess } from '../../../../../redux/actions/processes_actions'
import { putStation } from '../../../../../redux/actions/stations_actions'
import { deselectLocation } from '../../../../../redux/actions/locations_actions'
import { getRouteProcesses} from "../../../../../methods/utils/route_utils";
import TextField from "../../../../basic/form/text_field/text_field";
import TextboxSearchField from "../../../../basic/form/textbox_search_field/textbox_search_field";
import PropTypes from "prop-types";
import {isObject} from "../../../../../methods/utils/object_utils";
import useChange from "../../../../basic/form/useChange";

const TaskField = (props) => {

    const {
        isTransportTask,
        toggleEditing,
        isProcessTask,
        fieldParent,
        setFieldValue,
        setValues,
        setFieldTouched,
        getFieldMeta,
        onSave,
        onBackClick,
        onRemove
    } = props

    const fieldMeta = getFieldMeta(fieldParent)

    const {
        value: values,
        error: errors = {},
        touched,
    } = fieldMeta

    // sets values.changed to true when a change occurs
    useChange(fieldParent)

    const {
        name,
        obj,
        track_quantity,
        _id: routeId,
        changed
    } = values

    const routeProcesses = getRouteProcesses(routeId)
    console.log("EditTask props",props)
    console.log("EditTask fieldMeta",fieldMeta)

    console.log("EditTask fieldParent",fieldParent)
    console.log("EditTask touched",touched)
    console.log("EditTask values",values)
    console.log("EditTask errors",errors)
    console.log("EditTask values[fieldParent]",values[fieldParent])
    console.log("EditTask name",name)
    console.log("EditTask track_quantity",track_quantity)

    const errorCount = Object.keys(errors).length // get number of field errors
    // const touchedCount = Object.values(touched).length // number of touched fields
    const submitDisabled = ((errorCount > 0) || (!changed)) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once



    const dispatch = useDispatch()
    const dispatchPutProcesses = async (process) => await dispatch(putProcesses(process))
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const dispatchPutStation = (station, ID) => dispatch(putStation(station, ID))
    const dispatchPutDashboard = (dashboard, ID) => dispatch(putDashboard(dashboard, ID))
    const dispatchPostDashboard = (dashboard) => dispatch(postDashboard(dashboard))
    const dispatchSetFixingProcess = (bool) => dispatch(setFixingProcess(bool))
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

    // const [selectedTaskCopy, setSelectedTaskCopy] = useState(null)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    useEffect(() => {

        // update load & unload from selectedTask - currently have to do it this way since selectedTask is used in so many places
        if(selectedTask && selectedTask.load) {
            setFieldValue(fieldParent ? `${fieldParent}.load` : "load", selectedTask.load)
        }
        if(selectedTask && selectedTask.unload) {
            setFieldValue(fieldParent ? `${fieldParent}.unload` : "unload", selectedTask.unload)
        }

        // set touched if changes
        return () => {
            if(selectedTask && selectedTask.load) {
                setFieldTouched(fieldParent ? `${fieldParent}.load` : "load", true)
            }
            if(selectedTask && selectedTask.unload) {
                setFieldTouched(fieldParent ? `${fieldParent}.unload` : "unload", true)
            }
        }
    }, [selectedTask])

    useEffect(() => {

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
            return <styled.DirectionText>Click a position on the map to be the load (or start) position.</styled.DirectionText>
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
                return <LoadUnloadFields
                    fieldParent={fieldParent}
                    values={values}
                    setFieldValue={setFieldValue}
                />

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

                currButtons = currButtons.filter(button => button.task_id !== routeId)

                // update dashboard
                dispatch(dashboardActions.putDashboard({
                    ...currDashboard,
                    buttons: currButtons
                }, currDashboard._id.$oid))
            }
        )

        // remove route from any processes
        const routeProcesses = getRouteProcesses(routeId)
        routeProcesses.forEach(async (currProcess) => {

            var updatedProcess = {...currProcess}

            const willBreak = willRouteDeleteBreakProcess(updatedProcess, routeId, routes)
            // If the route removal breaks the process then update the process
            if (willBreak) {
                updatedProcess.broken = willBreak
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


        await dispatch(taskActions.deleteTask(routeId));


        toggleEditing(false)
        dispatchSetSelectedTask(null)
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

    console.log("editT ASK obj",obj)
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

    const handleObject = () => {
            return obj
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

                {confirmDeleteModal &&
                <ConfirmDeleteModal
                    isOpen={!!confirmDeleteModal}
                    title={

                        `Are you sure you want to delete this Route?

                    ${routeProcesses.length > 0 ?
                            `This task is a part of processes:

                        ${routeProcesses.map((process) => {
                                // Try catch for error with editing an existing task that belongs to a new process
                                try {
                                    return ` '${process.name}'`

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
                }


                <div style={{ marginBottom: '1rem' }}>
                    {selectedTask &&
                    <ContentHeader
                        content={'tasks'}
                        mode={(!!isProcessTask && selectedTask.new) ? 'add' : 'create'}
                        // Disables the button if load and unloads have not been selected for a task/route in a process
                        // disabled={selectedTask !== null && (!selectedTask.load.position || selectedTask.unload.position === null)}
                        disabled={submitDisabled}
                        onClickSave={async () => {
                            await onSave()
                        }}

                        onClickBack={() => {
                            onBackClick(routeId)
                        }}
                    />
                    }

                </div>

                {/*
                If it's a process route and its a new route then add the ability to select already existing routes.
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
                                    console.log("Existing task",task)

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

                                        var previousRoute
                                        if(isObject(previousRouteID)) {
                                            previousRoute = previousRouteID
                                        }
                                        else {
                                            previousRoute = routes[previousRouteID]
                                        }



                                        // Gets the previous route unload location
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
                        name={fieldParent ? `${fieldParent}.existingRoute` : "existingRoute"}
                        onChange={dropdownValues => {

                            // If this task is part of a process and not already in the array of routes, then add the task to the selected process
                            if (!selectedProcess.routes.includes(selectedTask._id)) {

                                if (!!fixingProcess) {

                                    // If the route addition fixes, process check to see if the process is still broken
                                    // If it fixes the process, it returns false because if it breaks the process it returns an int which is truthy
                                    if (!willRouteAdditionFixProcess(selectedProcess, dropdownValues[0], routes)) {
                                        // selectedProcess.broken = null
                                    }
                                    else {
                                        // selectedProcess.broken = willRouteAdditionFixProcess(selectedProcess, values[0], routes)
                                    }

                                    // Splice in the new route into the correct position
                                    // selectedProcess.routes.splice(selectedProcess.broken - 1, 0, values[0]._id)

                                } else {
                                    // selectedProcess.routes.push(values[0]._id);
                                }

                                // setFieldValue
                                if(fieldParent) {
                                    setFieldValue(fieldParent, {...values, ...dropdownValues[0] })
                                }
                                else {
                                    setValues(...values, ...dropdownValues[0])
                                }

                                onSave()


                                // dispatchSetSelectedProcess(selectedProcess)
                                //
                                // dispatchPutTask(
                                //     {
                                //         ...values[0],
                                //         processes: [...values[0].processes, selectedProcess._id]
                                //     }
                                //     , values[0]._id)
                            }

                            // dispatch(taskActions.deselectTask())    // Deselect
                            // setSelectedTaskCopy(null)                   // Reset the local copy to null
                            // toggleEditing(false)                            // No longer editing
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
                <TextField
                    InputComponent={Textbox}
                    name={fieldParent ? `${fieldParent}.name` : "name"}
                    placeholder="Route Name"
                    // defaultValue={!!selectedTask && selectedTask.name}
                    schema={'tasks'}
                    focus={!name}
                    // onChange={(e) => {
                    //     dispatch(taskActions.setTaskAttributes(selectedTask._id, { name: e.target.value }))
                    //
                    // }}
                    style={{ fontSize: '1.2rem', fontWeight: '600' }}
                />

                {isTransportTask &&
                <>
                    <TextboxSearchField
                        mapInput={(val)=>{
                            if(!val) return []

                            if(Array.isArray(val)) return val

                            return [val]
                        }}
                        name={fieldParent ? `${fieldParent}.obj` : "obj"}
                        placeholder="Object"
                        label={!values.obj?._id  ? "New object will be created" : null}
                        labelField="name"
                        valueField="name"
                        options={Object.values(objects).filter((obj) => obj.map_id === currentMap._id)}
                        defaultValue={obj}
                        textboxGap={0}
                        closeOnSelect="true"
                        className="w-100"
                        schema="tasks"
                        disbaled={!isTransportTask}
                        containerStyle={{ marginTop: '1rem', marginBottom: "1rem" }}
                    />

                    <styled.HelpText>
                        Select the object that will be transported. Either search & select an existing object, or type the
                        name of a new object to create one.
                    </styled.HelpText>

                    {(obj) &&
                    <>
                        <styled.Label>Track Using Quantity or Fractions</styled.Label>
                        <styled.RowContainer style={{ justifyContent: 'center' }}>
                            <styled.DualSelectionButton
                                style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                                onClick={() => {
                                    setFieldValue(fieldParent ? `${fieldParent}.track_quantity` : "track_quantity", true)
                                }}
                                selected={values.track_quantity}
                            >
                                Quantity
                            </styled.DualSelectionButton>

                            <styled.DualSelectionButton
                                style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                                onClick={() => {
                                    setFieldValue(fieldParent ? `${fieldParent}.track_quantity` : "track_quantity", false)
                                }}
                                selected={!values.track_quantity}

                            >
                                Fraction
                            </styled.DualSelectionButton>

                        </styled.RowContainer>
                    </>
                    }
                </>
                }

                {/* Load and Unload Parameters */}
                <div style={{ height: "100%", paddingTop: "1rem" }}>
                    {renderLoadUnloadParameters()}
                </div>

                <hr />

                {/* Remove Task From Process Button */}
                {selectedTask.new ?
                <>
                    <Button
                        schema={'tasks'}
                        // disabled={!!selectedTask && !!selectedTask._id && !!selectedTask.new}
                        secondary
                        onClick={()=>onBackClick(routeId)}
                    >
                        Cancel
                    </Button>
                </>
                    :
                    <>
                        {selectedProcess &&
                        <Button
                            schema={'tasks'}
                            disabled={!!selectedTask && !!selectedTask._id && !!selectedTask.new}
                            primary
                            onClick={() => {
                                onRemove(routeId)
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
                    </>
                }

            </styled.ContentContainer>
            }
        </>

    )
}

// Specifies propTypes
TaskField.propTypes = {
    onSave: PropTypes.func,
    toggleEditing: PropTypes.func,
    fieldParent: null,
    setFieldValue: PropTypes.func,
    setValues: PropTypes.func,
    setFieldTouched: PropTypes.func,
    getFieldMeta: PropTypes.func,
    onBackClick: PropTypes.func,
    onRemove: PropTypes.func,
};

// Specifies the default values for props:
TaskField.defaultProps = {
    onSave: () => {},
    toggleEditing: () => {},
    fieldParent: null,
    setFieldValue: () => {},
    setValues: () => {},
    setFieldTouched: () => {},
    getFieldMeta: () => {},
    onBackClick: () => {},
    onRemove: () => {},
};

export default TaskField
