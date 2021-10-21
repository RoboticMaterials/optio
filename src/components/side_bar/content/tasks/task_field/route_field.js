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

// Import Components
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'

// Import utils

// Import actions
import { setEditingValues } from '../../../../../redux/actions/processes_actions'
import { editingTask, setSelectedTask } from '../../../../../redux/actions/tasks_actions'
import {
    buildDefaultRouteName,
} from "../../../../../methods/utils/route_utils";
import TextField from "../../../../basic/form/text_field/text_field";

import usePrevious from "../../../../../hooks/usePrevious";

const TaskField = (props) => {

    const {
        values,
        errors: formikErrors,
        setFieldValue,
        setFieldTouched,
        validateForm,
        formikProps,
        touched,
        setTouched,
        onSave,
        routeCopy
    } = props

    const { routes: processRoutes } = values;
    const [confirmExitModal, setConfirmExitModal] = useState(false)
    const [enableSave, setEnableSave] = useState(false)
    const { tasks: routes, selectedTask: selectedRoute } = useSelector(state => state.tasksReducer)
    const { stations } = useSelector(state => state.stationsReducer)

    const [initialNameSet, setInitialNameSet] = useState(false)

    const dispatch = useDispatch()
    const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const onEditing = async (props) => await dispatch(editingTask(props))
    const dispatchSetEditingValues = (process) => dispatch(setEditingValues(process))

    const editingIdx = processRoutes.findIndex(route => route._id === selectedRoute._id)
    const editingRoute = processRoutes[editingIdx]
    const fieldName = `routes[${editingIdx}]`

    const prevLoadStationId = usePrevious(editingRoute?.load)
    const prevUnloadStationId = usePrevious(editingRoute?.unload)

    const errors = (typeof formikErrors?.routes === 'object') && formikErrors.routes
    const errorCount = Object.keys(errors).length // get number of field errors
    const submitDisabled = ((errorCount > 0) || (!enableSave))// || (!changed)) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

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
        const partName = buildDefaultRouteName(loadName, unloadName)


        if ((editingRoute.name === prevName) || (!editingRoute.name && !initialNameSet)) {
            setFieldValue(`${fieldName}.name`, newName, false)
            setInitialNameSet(true)
        }


        validateForm()

    }, [editingRoute])
    useEffect(() => {
        setTouched({})
    }, [])

    useEffect(() => {
      let route = {}
      for(const ind in values.routes){
        if(values.routes[ind]._id === selectedRoute._id){
          route = values.routes[ind]
        }
      }
      if (JSON.stringify(routeCopy) !== JSON.stringify(route)) {
          setEnableSave(true)
      }
      else {
          setEnableSave(false)
      }
    }, [values])

    useEffect(() => {

      for(const ind in values.routes){
        if(values.routes[ind]._id === selectedRoute?._id){
          if(selectedRoute.unload!== values.routes[ind].unload || selectedRoute.load!==values.routes[ind].load){
            setFieldValue(`routes[${ind}].unload`, selectedRoute.unload);
            setFieldValue(`routes[${ind}].load`, selectedRoute.load);
          }
        }
      }

    }, [selectedRoute])


    /***
     * Updates all sibling routes with the diverging type that has been selected
     */
    const updateDivergingRoutes = (type) => {
        processRoutes.forEach((route, idx) => {
            if (route.load === selectedRoute.load) {
                console.log(values.routes[idx].name, 'updated to', type)
                setFieldValue(`routes[${idx}].divergeType`, type);
            }
        })
    }

    const onRemoveRoute = (id) => {
      let updatedRoutes = []
      let removedRouteInd = 0
      for(const ind in values.routes){
        if(values.routes[ind]._id !== id){
          updatedRoutes.push(values.routes[ind])
        }
        else removedRouteInd = ind
      }

      //If you're removing a route that is split with another, revert the other
      //route to not split. However, if 2 or more sibling routes exist dont revert as they
      //are still split
      if(values.routes[removedRouteInd].divergeType === 'split'){
        let numRoutes = 0
        let newUpdatedRoutes = updatedRoutes
        for(const idx in newUpdatedRoutes){
            if(newUpdatedRoutes[idx].load === values.routes[removedRouteInd].load){
              delete newUpdatedRoutes[idx].divergeType
              numRoutes++
            }
          }
          if(numRoutes===1) updatedRoutes = newUpdatedRoutes
        }


      dispatchSetSelectedTask(null)
      onEditing(false)
      setFieldValue(`routes`, updatedRoutes);
      dispatchSetEditingValues({...values, routes: updatedRoutes})
    }

    const onRouteBack = async (id) => {
        const updatedRoutes = []
        for(const ind in values.routes){
          if(values.routes[ind]._id === id){
            if(!!routeCopy){
              updatedRoutes.push(routeCopy)
            }
          }
          else updatedRoutes.push(values.routes[ind])
        }
        onEditing(false)
        dispatchSetSelectedTask(null)
        setFieldValue(`routes`, updatedRoutes)
        dispatchSetEditingValues({...values, routes: updatedRoutes})
    }

    const onSaveRoute =() => {
        onEditing(false)
        dispatchSetSelectedTask(null)
        dispatchSetEditingValues(values)

    }


    /**
     * checks if there are other routes with the same load location. This meeds the load
     * station is a diverging node and the user needs to decide whether its a split or choice.
     */
    const isDivergingRoute = useMemo(() => {
        const isDiverging = Object.values(processRoutes).find(route => route._id !== selectedRoute._id && route.load === selectedRoute.load) !== undefined
        if (isDiverging && editingRoute.divergeType === undefined) {
            updateDivergingRoutes('split');
        }
        return isDiverging;
    }, [processRoutes, editingRoute])

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
                          onRouteBack(selectedRoute._id)
                       }}
                        handleOnClick2={() => {
                            setConfirmExitModal(null)
                        }}
                    />
                    <ContentHeader
                        content={'tasks'}
                        mode={'create'}
                        onClickBack={() => {
                            onRouteBack(selectedRoute._id)
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

                    {/* <styled.Title>In-Out Ratio</styled.Title>
                    <NumberField
                        minValue={1}
                        maxValue={100}
                        name={`${fieldName}.inOutRatio`}

                        containerStyle={{width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center'}}
                        buttonStyle={{fontSize: '2.5rem'}}
                        inputStyle={{height: '2.5rem', width: '5rem', fontSize: '1.4rem'}}
                    /> */}
                    </div>

                    <styled.ErrorText>{Array.isArray(errors) && typeof errors[errors.length-1] === 'string' && errors[errors.length-1]}</styled.ErrorText>


                    <>
                        <Button
                            type = {'button'}
                            schema={'tasks'}
                            disabled={submitDisabled}
                            onClick={() => {
                                onSaveRoute()
                            }}
                        >Add Route</Button>


                        {/* Remove Task From Process Button */}
                        <Button
                            schema={'error'}
                            disabled={false}
                            secondary
                            onClick={() => {
                                onRemoveRoute(selectedRoute._id)
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
