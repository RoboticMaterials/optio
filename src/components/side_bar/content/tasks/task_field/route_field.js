import React, { useState, useEffect, useMemo } from 'react'
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
import { setSelectedHoveringTask, editingTask, showRouteConfirmation, setRouteConfirmationLocation, autoAddRoute, deleteRouteClean } from '../../../../../redux/actions/tasks_actions'
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
import NumberField from '../../../../basic/form/number_field/number_field'
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
        values,
        errors: formikErrors,

        setFieldValue,
        setFieldTouched,
        validateForm,

        onSave,
        onRemove,
        onBack
    } = props

    const { routes: processRoutes } = values;

    const [confirmExitModal, setConfirmExitModal] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)

    const { tasks: routes, selectedTask: selectedRoute } = useSelector(state => state.tasksReducer)
    const { stations } = useSelector(state => state.stationsReducer)

    const dispatch = useDispatch()
    const dispatchDeleteRouteClean = async (routeId) => await dispatch(deleteRouteClean(routeId))

    const editingIdx = processRoutes.findIndex(route => route._id === selectedRoute._id)
    const editingRoute = processRoutes[editingIdx]
    const fieldName = `routes[${editingIdx}]`

    const prevLoadStationId = usePrevious(editingRoute?.load)
    const prevUnloadStationId = usePrevious(editingRoute?.unload)

    const errors = (typeof formikErrors?.routes === 'object') && formikErrors.routes
    const errorCount = Object.keys(errors).length // get number of field errors
    const submitDisabled = ((errorCount > 0))// || (!changed)) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once
    
    console.log(processRoutes)

    useEffect(() => {
        // The changes to load an unload only happen on the map so we need to reflect
        // the changes in formik when they occur
        if (editingRoute.load !== selectedRoute.load) {
            setFieldValue(`${fieldName}.load`, selectedRoute.load)
        }
        if (editingRoute.unload !== selectedRoute.unload) {
            setFieldValue(`${fieldName}.unload`, selectedRoute.unload)
        }

        // Update the name if the load/unload has changed ONLY if the name is a default name
        const prevLoadName = stations[prevLoadStationId]?.name || ""
        const prevUnloadName = stations[prevUnloadStationId]?.name || "" 
        const prevName = buildDefaultRouteName(prevLoadName, prevUnloadName)

        const loadName = stations[editingRoute.load]?.name || ""
        const unloadName = stations[editingRoute.unload]?.name || ""
        const newName = buildDefaultRouteName(loadName, unloadName)

        if ((editingRoute.name === prevName) || !editingRoute.name) {
            setFieldValue(`${fieldName}.name`, newName, false)
        }

        validateForm()

    }, [editingRoute])

    /**
     * checks if there are other routes with the same load location. This meeds the load
     * station is a diverging node and the user needs to decide whether its a split or choice.
     */
    const isDivergingRoute = useMemo(() => {
        const isDiverging = Object.values(processRoutes).find(route => route._id !== selectedRoute._id && route.load === selectedRoute.load) !== undefined
        if (isDiverging && !!selectedRoute.divergeType) {
            updateDivergingRoutes('split');
        }
        return isDiverging;
    }, [processRoutes, selectedRoute])

    const updateDivergingRoutes = (type) => {
        const siblingRoutes = Object.values(processRoutes).find(route => route._id !== selectedRoute._id && route.load === selectedRoute.load)
        processRoutes.forEach((route, idx) => {
            if (route.load === selectedRoute.load) {
                setFieldValue(`routes[${idx}].divergeType`, type);
            }
        })
    }

    return (
        <>
            <styled.TaskContainer schema={"tasks"}>
                <styled.ContentContainer>

                    <ConfirmDeleteModal
                        isOpen={!!confirmExitModal}
                        title={"Are you sure you want to go back? Any progress will not be saved"}
                        button_1_text={"Yes"}
                        button_2_text={"No"}
                        handleClose={() => setConfirmExitModal(null)}
                        handleOnClick1={() => {
                            onBack(selectedRoute._id)
                        }}
                        handleOnClick2={() => {
                            setConfirmExitModal(null)
                        }}
                    />

                    <ConfirmDeleteModal
                        isOpen={!!confirmDeleteModal}
                        title={`Are you sure you want to delete this Route?`}
                        button_1_text={"Yes"}
                        handleOnClick1={() => {
                            onRemove(selectedRoute._id)
                        }}
                        button_2_text={"No"}
                        handleOnClick2={() => setConfirmDeleteModal(null)}
                        handleClose={() => setConfirmDeleteModal(null)}
                    />

                    <ContentHeader
                        content={'tasks'}
                        mode={'create'}
                        onClickBack={() => {
                            if (JSON.stringify(selectedRoute) !== JSON.stringify(values)) {
                                setConfirmExitModal(true)
                            }
                            else {
                                onBack(selectedRoute._id)
                            }
                        }}
                    />


                    <div style={{ margin: '0.5rem 0.5rem 2rem 0' }}>
                        <styled.Title>Route Name</styled.Title>
                        <TextField
                            placeholder='Name of route'
                            value={editingRoute.name}
                            schema={'routes'}
                            name={`${fieldName}.name`}
                            InputComponent={Textbox}
                            inputStyle={{ background: 'white' }}
                            style={{ fontSize: '1.2rem', fontWeight: '100' }}
                            textboxContainerStyle={{ border: "none" }}
                            containerStyle={{marginBottom: '1rem'}}
                        />

                        <styled.Title>Part Name</styled.Title>
                        <TextField
                            placeholder='Name of transported part'
                            value={editingRoute.part}
                            schema={'routes'}
                            name={`${fieldName}.part`}
                            InputComponent={Textbox}
                            inputStyle={{ background: 'white' }}
                            style={{ fontSize: '1.2rem', fontWeight: '100' }}
                            textboxContainerStyle={{ border: "none" }}
                            containerStyle={{marginBottom: '1rem'}}
                        />


                        {isDivergingRoute &&
                            <>
                                <styled.Title style={{ alignSelf: 'center' }}>Diverging Type</styled.Title>
                                <styled.RowContainer style={{ justifyContent: 'center', marginBottom: '1rem'}}>
                                    <styled.DualSelectionButton
                                        style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                                        onClick={() => {
                                            updateDivergingRoutes('split')
                                        }}
                                        selected={editingRoute.divergeType === 'split'}
                                    >
                                        Split
                                    </styled.DualSelectionButton>

                                    <styled.DualSelectionButton
                                        style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                                        onClick={() => {
                                            updateDivergingRoutes('choice')
                                        }}
                                        selected={editingRoute.divergeType === 'choice'}

                                    >
                                        Choice
                                    </styled.DualSelectionButton>

                                </styled.RowContainer>
                            </>
                        }

                    <styled.Title>In-Out Ratio</styled.Title>
                    <NumberField
                        minValue={1}
                        maxValue={100}
                        name={`${fieldName}.inOutRatio`}

                        containerStyle={{width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center'}}
                        buttonStyle={{fontSize: '2.5rem'}}
                        inputStyle={{height: '2.5rem', width: '5rem', fontSize: '1.4rem'}}
                    />
                    </div>


                    <>
                        <Button
                            schema={'tasks'}
                            disabled={submitDisabled}
                            onClick={async () => {
                                await onSave(selectedRoute._id)
                            }}
                        >{(editingRoute.isNew ? 'Add' : 'Save')} Route</Button>


                        {/* Remove Task From Process Button */}
                        <Button
                            schema={'error'}
                            disabled={!!selectedRoute && !selectedRoute.isNew}
                            secondary
                            onClick={() => {
                                onRemove(selectedRoute._id)
                            }}
                        >
                            Remove Route
                        </Button>


                    </>

                </styled.ContentContainer>
            </styled.TaskContainer>
        </>
    )
}

// Specifies propTypes
TaskField.propTypes = {

};

// Specifies the default values for props:
TaskField.defaultProps = {

};

export default TaskField
