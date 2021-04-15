import React, { useState, useEffect, useContext } from 'react'
import * as styled from '../tasks_content.style'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { ThemeContext } from 'styled-components'

import Portal from '../../../../../higher_order_components/portal'
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
import IconButton from '../../../../basic/icon_button/icon_button'

// Import Components
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import LoadUnloadFields from './fields/load_unload_fields'
import ObjectEditor from '../object_editor/object_editor'


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
import { setSelectedHoveringTask, editingTask } from '../../../../../redux/actions/tasks_actions'
import { processHover } from '../../../../../redux/actions/widget_actions'
import { putObject, postObject, deleteObject, setSelectedObject, setRouteObject, setEditingObject } from '../../../../../redux/actions/objects_actions'

import {
    buildDefaultRouteName,
    getLoadStationId,
    getRouteProcesses,
    getUnloadStationId, isMiRTask,
    isNextRouteViable, isOnlyHumanTask
} from "../../../../../methods/utils/route_utils";
import TextField from "../../../../basic/form/text_field/text_field";
import TextboxSearchField from "../../../../basic/form/textbox_search_field/textbox_search_field";
import PropTypes from "prop-types";
import { isObject } from "../../../../../methods/utils/object_utils";
import useChange from "../../../../basic/form/useChange";
import { removeTask } from "../../../../../redux/actions/tasks_actions";
import { isArray } from "../../../../../methods/utils/array_utils";
import usePrevious from "../../../../../hooks/usePrevious";
import * as taskActions from "../../../../../redux/actions/tasks_actions";
import { pageDataChanged } from "../../../../../redux/actions/sidebar_actions"

const TaskField = (props) => {

    const {
        isTransportTask,
        isProcessTask,
        fieldParent,
        setFieldValue,
        setValues,
        setFieldTouched,
        setFieldError,
        getFieldMeta,
        onSave,
        onBackClick,
        onRemove,
        validateForm,
        onDelete,
        isNew,
    } = props

    const fieldMeta = getFieldMeta(fieldParent)

    const {
        value: values = {},
        error: errors = {},
        touched,
    } = fieldMeta || {}
    // sets values.changed to true when a change occurs
    useChange(fieldParent)

    const themeContext = useContext(ThemeContext)

    const {
        name,
        obj,
        track_quantity,
        _id: routeId,
        changed,
        temp
    } = values || {}


    const {
        insertIndex
    } = temp || {}

    const routeProcesses = getRouteProcesses(routeId) || []
    const isProcessRoute = routeProcesses.length > 0 || fieldParent
    const errorCount = Object.keys(errors).length // get number of field errors
    // const touchedCount = Object.values(touched).length // number of touched fields
    const submitDisabled = ((errorCount > 0) || (!changed)) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once
    const params = useParams()
    const dispatch = useDispatch()
    const dispatchPutStation = (station, ID) => dispatch(putStation(station, ID))
    const dispatchPutDashboard = (dashboard, ID) => dispatch(putDashboard(dashboard, ID))
    const dispatchPostDashboard = (dashboard) => dispatch(postDashboard(dashboard))
    const dispatchSetFixingProcess = (bool) => dispatch(setFixingProcess(bool))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))
    const dispatchSetEditing = async (props) => await dispatch(editingTask(props))
    const dispatchSetSelectedHoveringTask = async (task) => await dispatch(setSelectedHoveringTask(task))
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))
    const dispatchPutObject = (object, id) => dispatch(putObject(object, id))
    const dispatchPostObject = (object, id) => dispatch(postObject(object, id))
    const dispatchSetSelectedObject = (object) => dispatch(setSelectedObject(object))
    const dispatchDeleteObject = (id) => dispatch(deleteObject(id))
    const dispatchSetRouteObject = (object) => dispatch(setRouteObject(object))
    const dispatchSetEditingObject = (bool) => dispatch(setEditingObject(bool))

    let routes = useSelector(state => state.tasksReducer.tasks)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedObject = useSelector(state => state.objectsReducer.selectedObject)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const objects = useSelector(state => state.objectsReducer.objects)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const fixingProcess = useSelector(state => state.processesReducer.fixingProcess)
    const hoveringTask = useSelector(state => state.tasksReducer.selectedHoveringTask)
    const stations = useSelector(state => state.stationsReducer.stations)
    const routeObject = useSelector(state=>state.objectsReducer.routeObject)
    const editingObject = useSelector(state=> state.objectsReducer.editingObject)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)
    const [showEditor, setShowEditor] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [confirmExitModal, setConfirmExitModal] = useState(false);
    const [confirmDeleteObjectModal, setConfirmDeleteObjectModal] = useState(false);
    const [needsValidate, setNeedsValidate] = useState(false);
    const [didSetHandoff, setDidSetHandoff] = useState(false);
    const [showObjectSelector, setShowObjectSelector] = useState(false);
    const [objectSaveDisabled, setObjectSaveDisabled] = useState(true);
    const [contentType, setContentType] = useState('new')
    const previousLoadStationId = usePrevious(getLoadStationId(values))
    const previousUnloadStationId = usePrevious(getUnloadStationId(values))
    const url = useLocation().pathname
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

        if (selectedTask && selectedTask.device_types) {
            setFieldValue(fieldParent ? `${fieldParent}.device_types` : "device_types", selectedTask.device_types, false)
        }

        if (isMiRTask(selectedTask) && isNew) {
            if (values.handoff) setFieldValue(fieldParent ? `${fieldParent}.handoff` : "handoff", false)
        }

        else if (isOnlyHumanTask(selectedTask)) {
            if (!values.handoff && !didSetHandoff && isNew) {
                setDidSetHandoff(true)
                setFieldValue(fieldParent ? `${fieldParent}.handoff` : "handoff", true)
            }
        }

        const loadStation = stations[loadStationId] || { name: "" }
        const {
            name: loadName
        } = loadStation
        const prevLoadStation = stations[previousLoadStationId] || { name: "" }
        const {
            name: prevLoadName
        } = prevLoadStation

        const unloadStation = stations[unloadStationId] || { name: "" }
        const {
            name: unloadName
        } = unloadStation
        const prevUnloadStation = stations[previousUnloadStationId] || { name: "" }
        const {
            name: prevUnloadName
        } = prevUnloadStation

        const prevName = buildDefaultRouteName(prevLoadName, prevUnloadName)
        const newName = buildDefaultRouteName(loadName, unloadName)
        const newObj = ""

        if ((name === prevName) || !name) {
            setFieldValue(fieldParent ? `${fieldParent}.name` : "name", newName, false)
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
    }, [selectedTask, selectedObject])

    useEffect(() => {

        dispatchSetEditing(true) // set editing to true
        dispatchSetRouteObject(selectedTask.route_object)
        dispatchSetSelectedObject(selectedTask.route_object)

        return () => {
            // When unmounting edit task, always set fixing process to false
            // This will take care of when it's set to true in edit process
            dispatchSetFixingProcess(false)
            dispatchSetSelectedPosition(null)
            dispatchSetSelectedStation(null)
            dispatchSetEditing(false)

        }
    }, [])

    useEffect(() => {
      if(!!showObjectSelector){
        if (selectedObject) {
            setFieldValue(fieldParent ? `${fieldParent}.obj` : "obj", selectedObject, false)
        }

        if (!selectedObject) {
            setFieldValue(fieldParent ? `${fieldParent}.obj` : "obj", null, false)
        }
      }

    },[editingObject])





    // calls save function when values.needsSubmit is true - used for auto submit when selecting route from existing
    useEffect(() => {
        if (values.needsSubmit) onSave()
    }, [values.needsSubmit])

    // calls save function when values.needsSubmit is true - used for auto submit when selecting route from existing
    useEffect(() => {
        if (needsValidate) {
            validateForm()
            setNeedsValidate(false)
        }
    }, [needsValidate])


    useEffect(() => {
        if (!!obj && !!selectedObject) {
            if ((obj.name !== selectedObject.name || obj.description !== selectedObject.description) && obj.name !== "") {
                setObjectSaveDisabled(false)
            }
            else {
                setObjectSaveDisabled(true)
            }
        }
    }, [obj?.description, obj?.name])

    useEffect(() => {
      if(contentType === "existing" && selectedTask.load.station!== null){
        setContentType("new")
      }
    }, [selectedTask])

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
                    isProcess={isProcessTask}
                />

            }
        }

    }

    const onSaveObject = async () => {
        const object = {
            name: obj.name,
            description: obj.description,
            modelName: "",
            dimensions: null,
            map_id: currentMap._id,
            _id: !!selectedObject.new ? uuid.v4() : obj._id,
        }

        if (!!selectedObject.new) {
            dispatchPostObject(object)
        }
        else {
            await dispatchPutObject(object, obj._id)
        }

        dispatchSetEditingObject(false)
        dispatchSetSelectedObject(null)
        setFieldTouched(fieldParent ? `${fieldParent}.obj` : "obj", false)


    }

    const onAddObject = async () => {
        const object = {
            name: "",
            description: "",
            modelName: "",
            dimensions: null,
            map_id: currentMap._id,
            _id: uuid.v4(),
            new: true,
        }

        dispatchSetSelectedObject(object)
    }

    const onSelectObject = () => {
      dispatchSetRouteObject(selectedObject)
      setShowObjectSelector(false)
      dispatchPageDataChanged(true)
      setFieldValue(fieldParent ? `${fieldParent}.route_object` : "route_object", selectedObject, false)
    }

    const onObjectBackClick = () => {
        if (!!editingObject) {
            dispatchSetEditingObject(false)
            dispatchSetSelectedObject(routeObject)
            setFieldTouched(fieldParent ? `${fieldParent}.obj` : "obj", false)

        }
        else {
            setShowObjectSelector(false)
            dispatchSetSelectedObject(selectedTask.route_object)
        }
    }

    const updateDashboard = () => {
        // Add the task automatically to the associated load station dashboard
        // Since as of now the only type of task we are doing is push, only need to add it to the load location
        let updatedStation = deepCopy(stations[selectedTask.load.station])

        let updatedDashboard = dashboards[updatedStation.dashboards[0]]

        if (updatedDashboard === undefined) {
            let defaultDashboard = {
                name: updatedStation.name + ' Dashboard',
                locked: false,
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
                    <ConfirmDeleteModal
                        isOpen={!!confirmDeleteObjectModal}
                        title={"Are you sure you want to delete This Object?"}
                        button_1_text={"Yes"}
                        button_2_text={"No"}
                        handleClose={() => setConfirmDeleteObjectModal(null)}
                        handleOnClick1={() => {
                            dispatchDeleteObject(selectedObject._id)
                            setConfirmDeleteObjectModal(null)

                        }}
                        handleOnClick2={() => {
                            setConfirmDeleteObjectModal(null)
                        }}
                    />

                    <ConfirmDeleteModal
                        isOpen={!!confirmExitModal}
                        title={"Are you sure you want to go back? Any progress will not be saved"}
                        button_1_text={"Yes"}
                        button_2_text={"No"}
                        handleClose={() => setConfirmExitModal(null)}
                        handleOnClick1={() => {
                          onBackClick(routeId)
                          dispatchSetEditingObject(false)
                          dispatchPageDataChanged(false)
                        }}
                        handleOnClick2={() => {
                            setConfirmExitModal(null)
                        }}
                    />

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

                    {/*
                If it's a process route and its a new route then add the ability to select already existing routes.
                Some filtering is done based on certain conditions, see 'options' key
            */}
                    {!!selectedTask && isProcessTask && !!selectedTask.new &&
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                <ContentHeader
                                    content={'tasks'}
                                    mode={'create'}
                                    onClickBack={() => {
                                      if(!!pageInfoChanged){
                                        setConfirmExitModal(true)
                                      }
                                      else{
                                        onBackClick(routeId)
                                        dispatchSetEditingObject(false)
                                        dispatchPageDataChanged(false)
                                      }
                                    }}
                                />
                            </div>
                            <styled.RowContainer style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                                <styled.DualSelectionButton
                                    style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                                    onClick={() => {
                                        setContentType('existing')
                                    }}
                                    selected={contentType === 'existing'}
                                >
                                    Existing
                                </styled.DualSelectionButton>

                                <styled.DualSelectionButton
                                    style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                                    onClick={() => {
                                        setContentType('new')
                                    }}
                                    selected={contentType === 'new'}

                                >
                                    New Route
                                </styled.DualSelectionButton>

                            </styled.RowContainer>

                            {contentType === 'existing' &&
                                <div style={{ marginBottom: '1rem', paddingBottom: '2rem', borderBottom: `2px solid ${themeContext.bg.tertiary}` }}>
                                    <styled.Label>
                                        Select an <styled.LabelHighlight>existing</styled.LabelHighlight> Route
                                    </styled.Label>
                                    <div style={{ height: 'fit-content' }}>
                                        <DropDownSearch
                                            placeholder="Select Existing Route"
                                            label="Choose An Existing Route"
                                            labelField="name"
                                            create={true}
                                            valueField="name"
                                            onMouseEnter={(item) => {
                                                dispatchSetSelectedHoveringTask(item)
                                            }}
                                            onMouseLeave={(item) => dispatchSetSelectedHoveringTask(null)}
                                            onCreateNew={() => setShowEditor(true)}
                                            options={
                                                Object.values(routes)
                                                    .filter(task => {
                                                        if (task.map_id !== currentMap._id) return false

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
                                                            if (insertIndex === 0) {
                                                                const firstTask = selectedProcess.routes[0]
                                                                return isNextRouteViable(task, firstTask)
                                                            }
                                                            else {
                                                                // Gets the previous route
                                                                const previousRoute = getPreviousRoute(selectedProcess.routes, values._id)
                                                                return isNextRouteViable(previousRoute, task)
                                                            }
                                                        }

                                                        else {
                                                            return true
                                                        }
                                                    })
                                            }
                                            // values={!!selectedTask.idle_location ? [positions[selectedTask.idle_location]] : []}
                                            dropdownGap={2}
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

                                                    var selectedRoute = { ...selectedValue, needsSubmit: true, obj: selectedObject ? selectedObject : null, temp: values.temp }
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
                                            style={{ background: themeContext.bg.primary, zIndex: 100 }}
                                        />
                                    </div>
                                </div>
                            }
                        </>
                    }

                    {contentType === 'new' &&
                        <div>
                            {!!selectedTask && isProcessTask && !!selectedTask.new ?

                                <styled.Label style={{ marginTop: '1rem' }}>
                                    Make a <styled.LabelHighlight>new</styled.LabelHighlight> Route
                            </styled.Label>
                                :
                                <div style={{ marginBottom: '1rem' }}>
                                    <ContentHeader
                                        content={'tasks'}
                                        mode={'create'}
                                        onClickBack={() => {
                                          if(!!pageInfoChanged){
                                            setConfirmExitModal(true)
                                          }
                                          else{
                                            onBackClick(routeId)
                                            dispatchSetEditingObject(false)
                                            dispatchPageDataChanged(false)
                                          }
                                        }}
                                    />
                                </div>

                            }

                            {/* Task Title */}
                            {/* <styled.Header style={{ marginTop: '0rem',marginRight: ".5rem", fontSize: '1.2rem' }}>Route Name</styled.Header> */}

                            <TextField
                                InputComponent={Textbox}
                                name={fieldParent ? `${fieldParent}.name` : "name"}
                                placeholder={"New Route Name"}
                                label={"Route Name"}
                                schema={'tasks'}
                                focus={params.page === "tasks" ? !name : name}
                                inputStyle={{ background: isProcessTask ? themeContext.bg.primary : themeContext.bg.secondary }}
                                style={{ fontSize: '1.2rem', fontWeight: '600' }}
                            />

                            {isTransportTask &&
                                <>
                                    <styled.Header style={{ marginTop: '1.5rem', marginRight: ".5rem", fontSize: '1.2rem' }}>Object</styled.Header>

                                    {!showObjectSelector &&
                                        <>
                                            {!!routeObject && !!objects[routeObject?._id] ?
                                                <>
                                                    <styled.ListItem> {/* style = {{height: url==='/tasks' ? '4rem': '2.5rem', marginBottom: '0rem;'}}> */}
                                                        <styled.ItemContainer>
                                                            <styled.ListItemIcon
                                                                className='fas fa-box'
                                                            />
                                                            <styled.ListItemTitle>{routeObject ? objects[routeObject._id].name : ""}</styled.ListItemTitle>

                                                            <styled.Icon
                                                                className='fas fa-exchange-alt'
                                                                style={{ color: 'white', transform: 'rotate(-45deg)', fontSize: '1.1rem' }}
                                                                onClick={() => setShowObjectSelector(!showObjectSelector)}
                                                            />
                                                            <styled.Icon
                                                                className='far fa-minus-square'
                                                                style={{ color: 'white', marginLeft: '0.5rem' }}
                                                                onClick={() => {
                                                                    dispatchSetRouteObject(null)
                                                                    dispatchSetSelectedObject(null)
                                                                    setFieldValue(fieldParent ? `${fieldParent}.route_object` : "route_object", null, false)
                                                                }}
                                                            />
                                                        </styled.ItemContainer>
                                                    </styled.ListItem>

                                                </>
                                                :
                                                <Button
                                                    style={{ marginRight: '0', marginLeft: '0', width: '100%' }}
                                                    schema={'objects'}
                                                    secondary
                                                    // disabled={!!selectedTask && !!selectedTask._id && !!selectedTask.new}
                                                    onClick={() => setShowObjectSelector(!showObjectSelector)}
                                                >
                                                    Choose an Object...
                                    </Button>
                                            }
                                        </>
                                    }

                                    {!!showObjectSelector &&
                                        <ObjectEditor
                                            onBackClick={() => onObjectBackClick()}
                                            name={fieldParent ? `${fieldParent}.obj.name` : "obj.name"}
                                            description={fieldParent ? `${fieldParent}.obj.description` : "obj.description"}
                                            focus={!obj}
                                            onSaveObject={() => onSaveObject()}
                                            onAddObject={() => onAddObject()}
                                            onDeleteObject={() => {
                                                setConfirmDeleteObjectModal(true)
                                            }}
                                            onSelectObject={() => onSelectObject()}
                                            deleteDisabled={!!selectedObject?.new}
                                            saveDisabled={objectSaveDisabled}
                                        />
                                    }

                                    {!showObjectSelector &&
                                        <styled.HelpText style={{ fontSize: '.8rem', marginBottom: '1rem' }}>
                                            Select or create an object to be transported
                                </styled.HelpText>
                                    }

                                    {isProcessRoute &&
                                        <>
                                            <styled.Label style={{ fontSize: '1.2rem', alignSelf: 'center' }}>Tracking Type</styled.Label>
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
                        </div>
                    }
                    {contentType === 'new' &&
                        <>
                            <Button
                                schema={'tasks'}
                                disabled={submitDisabled || !!editingObject}
                                onClick={async () => {
                                    await onSave()
                                }}
                            >{(!!isProcessTask ? 'Add' : (selectedTask.new ? 'Create' : 'Save'))} Route</Button>


                            {/* Remove Task From Process Button */}
                            {!!isProcessTask && selectedProcess ?
                                <Button
                                    schema={'error'}
                                    disabled={!!selectedTask && !!selectedTask._id && isNew}
                                    secondary
                                    onClick={() => {
                                        onRemove(routeId)
                                    }}
                                >
                                    Remove Route
                            </Button>
                                :
                                <Button
                                    schema={'error'}
                                    secondary
                                    disabled={!!selectedTask && !!selectedTask._id && !!selectedTask.new}
                                    onClick={() => {
                                        setConfirmDeleteModal(true)
                                    }}

                                >
                                    Delete Route
                            </Button>
                            }
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
