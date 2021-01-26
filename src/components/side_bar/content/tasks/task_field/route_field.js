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
import { getPreviousRoute, willRouteAdditionFixProcess } from '../../../../../methods/utils/processes_utils'

// Import actions
import { putDashboard, postDashboard } from '../../../../../redux/actions/dashboards_actions'
import * as objectActions from '../../../../../redux/actions/objects_actions'
import { setFixingProcess } from '../../../../../redux/actions/processes_actions'
import { putStation } from '../../../../../redux/actions/stations_actions'
import { setSelectedStation } from '../../../../../redux/actions/stations_actions'
import { setSelectedPosition } from '../../../../../redux/actions/positions_actions'
import {
    buildDefaultRouteName,
    getLoadStationId,
    getRouteProcesses,
    getUnloadStationId,
    isNextRouteViable
} from "../../../../../methods/utils/route_utils";
import TextField from "../../../../basic/form/text_field/text_field";
import TextboxSearchField from "../../../../basic/form/textbox_search_field/textbox_search_field";
import PropTypes from "prop-types";
import { isObject } from "../../../../../methods/utils/object_utils";
import useChange from "../../../../basic/form/useChange";
import { removeTask } from "../../../../../redux/actions/tasks_actions";
import { isArray } from "../../../../../methods/utils/array_utils";
import usePrevious from "../../../../../hooks/usePrevious";

const TaskField = (props) => {

    const {
        isTransportTask,
        isProcessTask,
        fieldParent,
        setFieldValue,
        setValues,
        setFieldTouched,
        getFieldMeta,
        onSave,
        onBackClick,
        onRemove,
        validateForm,
        onDelete
    } = props

    console.log("TaskField fieldParent",fieldParent)
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

    console.log("EditTask fieldParent", fieldParent)
    console.log("EditTask values", values)
    console.log("EditTask errors", errors)
    console.log("EditTask touched", touched)

    const errorCount = Object.keys(errors).length // get number of field errors
    // const touchedCount = Object.values(touched).length // number of touched fields
    const submitDisabled = ((errorCount > 0) || (!changed)) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

    const dispatch = useDispatch()
    const dispatchPutStation = (station, ID) => dispatch(putStation(station, ID))
    const dispatchPutDashboard = (dashboard, ID) => dispatch(putDashboard(dashboard, ID))
    const dispatchPostDashboard = (dashboard) => dispatch(postDashboard(dashboard))
    const dispatchSetFixingProcess = (bool) => dispatch(setFixingProcess(bool))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))

    let routes = useSelector(state => state.tasksReducer.tasks)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const objects = useSelector(state => state.objectsReducer.objects)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const fixingProcess = useSelector(state => state.processesReducer.fixingProcess)

    const stations = useSelector(state => state.stationsReducer.stations)

    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [userTypedName, setUserTypedName] = useState(!!name);
    const [autoGeneratedName, setAutoGeneratedName] = useState("");
    const [needsValidate, setNeedsValidate] = useState(false);
    // const [, setConfirmDeleteModal] = useState(false);

    const previousLoadStationId = usePrevious(values.load.station)
    const previousUnloadStationId = usePrevious(values.unload.station)

    useEffect(() => {
        const loadStationId = getLoadStationId(selectedTask)
        const unloadStationId = getUnloadStationId(selectedTask)

        // update load & unload from selectedTask - currently have to do it this way since selectedTask is used in so many places
        if (selectedTask && selectedTask.load) {
            setFieldValue(fieldParent ? `${fieldParent}.load.station` : "load.station", selectedTask.load.station, false)
            setFieldValue(fieldParent ? `${fieldParent}.load.position` : "load.position", selectedTask.load.position, false)
        }
        if (selectedTask && selectedTask.unload) {
            setFieldValue(fieldParent ? `${fieldParent}.unload.station` : "unload.station", selectedTask.unload.station, false)
            setFieldValue(fieldParent ? `${fieldParent}.unload.position` : "unload.position", selectedTask.unload.position, false)
        }

        if (selectedTask && selectedTask.type) {
            setFieldValue(fieldParent ? `${fieldParent}.type` : "type", selectedTask.type, false)
        }

        if(!name || !userTypedName) {
            // setUserTypedName(false) // set userTypedName to false to auto generate name

            const loadStation = stations[loadStationId] || {name: ""}
            const {
                name: loadName
            } = loadStation
            const prevLoadStation = stations[previousLoadStationId] || {name: ""}
            const {
                name: prevLoadName
            } = prevLoadStation

            const unloadStation = stations[unloadStationId] || {name: ""}
            const {
                name: unloadName
            } = unloadStation
            const prevUnloadStation = stations[previousUnloadStationId] || {name: ""}
            const {
                name: prevUnloadName
            } = prevUnloadStation

            console.log("previousLoadStationId",previousLoadStationId)
            console.log("selectedTask.load.station",selectedTask.load.station)
            console.log("selectedTask.load.station",selectedTask.load.station)
            const prevName = buildDefaultRouteName(prevLoadName, prevUnloadName)
            const newName = buildDefaultRouteName(loadName, unloadName)



            if((name === prevName) || !name) {
                setFieldValue(fieldParent ? `${fieldParent}.name` : "name", newName, false)
            }

            // setAutoGeneratedName(loadStation.name + " => " + unloadStation.name)

        }

        setNeedsValidate(true)

        // set touched if changes
        return () => {


            if (selectedTask && selectedTask.load) {
                setFieldTouched(fieldParent ? `${fieldParent}.load` : "load", true)
            }
            if (selectedTask && selectedTask.unload) {
                setFieldTouched(fieldParent ? `${fieldParent}.unload` : "unload", true)
            }
        }
    }, [selectedTask])

    useEffect(() => {

        return () => {
            // When unmounting edit task, always set fixing process to false
            // This will take care of when it's set to true in edit process
            dispatchSetFixingProcess(false)
            dispatchSetSelectedPosition(null)
            dispatchSetSelectedStation(null)

        }
    }, [])

    // calls save function when values.needsSubmit is true - used for auto submit when selecting route from existing
    useEffect(() => {
        if (values.needsSubmit) onSave()
    }, [values.needsSubmit])

    // calls save function when values.needsSubmit is true - used for auto submit when selecting route from existing
    useEffect(() => {
        if (needsValidate) {
            console.log("In validate effect")
            validateForm()
            setNeedsValidate(false)
        }
    }, [needsValidate])




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

    const createObject = async () => {
        // Save object
        let objectId = null
        if (isObject(obj) && ('name' in obj)) {
            if (obj._id == undefined) { // If the object does not currently exist, make a new one
                const newObject = {
                    name: obj.name,
                    description: "",
                    modelName: "",
                    dimensions: null,
                    map_id: currentMap._id,
                    _id: uuid.v4(),
                }
                const response = await dispatch(objectActions.postObject(newObject))
                console.log("response", response)
                setFieldValue(fieldParent ? `${fieldParent}.obj` : "obj", newObject)


                objectId = newObject._id
            } else { //  Otherwise just set the task obj to the existing obj
                objectId = obj._id
            }

        }

        setFieldValue(fieldParent ? `${fieldParent}.needsSubmit` : "needsSubmit", true)

        return objectId
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
                                onDelete(routeId)
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
                                    await createObject()
                                    // await onSave()
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
                                            console.log("Existing task", task)

                                            // This filters out tasks when fixing a process
                                            // If the process is broken, then you can only select tasks that are associated with the last route before break's unload station
                                            if (fixingProcess) {

                                                // Gets the route before break
                                                const routeBeforeBreak = selectedProcess.routes[selectedProcess.broken - 1]

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
                                                const previousRoute = getPreviousRoute(selectedProcess.routes, values._id)

                                                return isNextRouteViable(previousRoute, task)

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
                                onChange={async (dropdownValues) => {

                                    const selectedValue = dropdownValues[0] || {}

                                    const {
                                        obj: selectedObjId = "",
                                        _id: selectedRouteId = ""
                                    } = selectedValue || {}

                                    const selectedObj = selectedObjId ? (objects[selectedObjId] || null) : null

                                    // If this task is part of a process and not already in the array of routes, then add the task to the selected process
                                    if (!selectedProcess.routes.includes(selectedRouteId)) {

                                        var selectedRoute = { ...selectedValue, needsSubmit: true, obj: selectedObj, temp: values.temp }
                                        // setFieldValue
                                        if (fieldParent) {
                                            setFieldValue(fieldParent, selectedRoute)
                                        }
                                        else {
                                            await setValues(selectedRoute)
                                        }

                                    }
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
                        placeholder={values.autoGenName ? values.autoGenName : "Route Name"}
                        onChange={()=>setUserTypedName(true)} // user changed value, so stop auto generating name
                        schema={'tasks'}
                        focus={!name}
                        style={{ fontSize: '1.2rem', fontWeight: '600' }}
                    />

                    {isTransportTask &&
                        <>
                            <TextboxSearchField
                                mapInput={(val) => {
                                    if (!val) return []

                                    if (Array.isArray(val)) return val

                                    return [val]
                                }}
                                name={fieldParent ? `${fieldParent}.obj` : "obj"}
                                placeholder="Object"
                                label={!values.obj?._id ? "New object will be created" : null}
                                labelField="name"
                                onChange={(val) => {
                                    console.log("TextboxSearchField onChange val", val)
                                }}

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
                                onClick={() => onBackClick(routeId)}
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
    onDelete: PropTypes.func,
};

// Specifies the default values for props:
TaskField.defaultProps = {
    onSave: () => { },
    toggleEditing: () => { },
    fieldParent: null,
    setFieldValue: () => { },
    setValues: () => { },
    setFieldTouched: () => { },
    getFieldMeta: () => { },
    onBackClick: () => { },
    onRemove: () => { },
    onDelete: () => { },
};

export default TaskField
