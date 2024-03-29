import React, { useState, useEffect, useRef, useMemo, useContext } from 'react'

// external functions
import {v4 as uuid} from "uuid"
import { useSelector, useDispatch } from 'react-redux'

// internal components
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'
import TaskField from '../../tasks/task_field/route_field'
import ContentHeader from '../../content_header/content_header'
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import TextField from "../../../../basic/form/text_field/text_field";
import ListItemField from "../../../../basic/form/list_item_field/list_item_field";

// Import actions
import {
    deleteTask,
    setSelectedTask,
    setSelectedHoveringTask,
    setTaskAttributes,
} from '../../../../../redux/actions/tasks_actions'
import { setProcessAttributes } from '../../../../../redux/actions/processes_actions'

// Import Utils
import { findProcessStartNodes } from "../../../../../methods/utils/processes_utils";
import { isEmpty } from "../../../../../methods/utils/object_utils";
import useChange from "../../../../basic/form/useChange";

// styles
import * as styled from './process_field.style'
import {ThemeContext} from "styled-components";
import { useTranslation } from 'react-i18next';

export const ProcessField = (props) => {

    const { t, i18n } = useTranslation();

    const {
        formikProps,
        onDelete,
        onSave,
        onBack,
    } = props

    // extract formik props
    const {
        errors,
        values,
        touched,
        isSubmitting,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        getFieldMeta,
        validateForm
    } = formikProps

    const themeContext = useContext(ThemeContext)

    useChange() // adds changed key to values - true if the field has changed
    let errorCount = 0
    Object.values(errors).forEach((currError) => {
        if (!isEmpty(currError)) errorCount++
    }) // get number of field errors
    const touchedCount = Object.values(touched).length // number of touched fields
    const submitDisabled = ((errorCount > 0)|| isSubmitting || !values.changed) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once
    const dispatch = useDispatch()
    const dispatchSetSelectedTask = async (task) => await dispatch(setSelectedTask(task))
    const dispatchSetTaskAttributes = async (id, attr) => await dispatch(setTaskAttributes(id, attr));
    const dispatchSetSelectedHoveringTask = (task) => dispatch(setSelectedHoveringTask(task))

    const dispatchDeleteRoute = async (routeId) => await dispatch(deleteTask(routeId))

    const dispatchSetProcessAttributes = async (id, attr) => await dispatch(setProcessAttributes(id, attr))

    const { tasks, selectedTask } = useSelector(state => state.tasksReducer)
    const stations = useSelector(state => state.stationsReducer.stations)
    const routes = useSelector(state => state.tasksReducer.tasks)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)

    const startNodes = useMemo(() => findProcessStartNodes(values.routes, stations), [values.routes])
    useEffect(() => {
        if (startNodes.length > 1 && !values.startDivergeType) {
            setFieldValue('startDivergeType', 'split')
        }
    }, [startNodes])


    // State definitions
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [confirmExitModal, setConfirmExitModal] = useState(false);
    const [routeCopy, setRouteCopy] = useState(null);
    // Handles a new route being drawn on the map
    useEffect(() => {
        if (selectedTask == null) {return}
        const formikSelectedTask = values.routes.find(route => route._id === selectedTask._id);
        if (!!selectedTask.unload && formikSelectedTask === undefined) {
            let processRoutesCopy = values.routes;

            const selectedTaskCopy = selectedTask

            processRoutesCopy.push(selectedTaskCopy);
            setFieldValue('routes', processRoutesCopy)
            dispatchSetProcessAttributes(selectedTask._id, {...selectedTaskCopy})
        }
    }, [selectedTask])


    // Maps through the list of existing routes
    const renderRoutes = (routes) => {
        return routes.map((currRoute, currIndex) => {

            const {
                _id: currRouteId = "",
            } = currRoute || {}

            const fieldName = `routes[${currIndex}]`

            return (
                <ListItemField
                    containerStyle={{ margin: '0.5rem' }}
                    name={fieldName}
                    onMouseEnter={() => {
                        dispatchSetSelectedHoveringTask(currRoute)
                    }}
                    onMouseLeave={() => {
                        dispatchSetSelectedHoveringTask(null)
                    }}
                    onEditClick={() => {
                        setRouteCopy(currRoute)
                        dispatchSetSelectedTask(currRoute)
                        dispatchSetSelectedHoveringTask(null)
                    }}
                    key={`li-${currIndex}`}
                />
            )
        })
    }


    return (
        <>

            <ConfirmDeleteModal
                isOpen={!!confirmExitModal}
                title={t("backwarning","Are you sure you want to go back? Any progress will not be saved")}
                button_1_text={t("yes","Yes")}
                button_2_text={t("no","No")}
                handleClose={() => setConfirmExitModal(null)}
                handleOnClick1={() => {
                    onBack()
                }}
                handleOnClick2={() => {
                    setConfirmExitModal(null)
                }}
            />

            <ConfirmDeleteModal
                isOpen={!!confirmDeleteModal}
                title={t("Editproc.deletewarning","WARNING! All lots currently in this process will be permanently deleted. Are you sure you want to delete this process?")}
                button_1_text={t("yes","Yes")}
                button_2_text={t("no","No")}
                handleClose={() => setConfirmDeleteModal(null)}
                handleOnClick1={() => {
                    onDelete(true)
                    setConfirmDeleteModal(null)
                }}
                handleOnClick2={() => {
                    setConfirmDeleteModal(null)
                }}
            />

            <styled.Container>

                <div style={{ marginBottom: '1rem' }}>

                    <ContentHeader
                        content={'processes'}
                        mode={'create'}
                        disabled={!!selectedTask || submitDisabled}
                        onClickSave={() => {
                            onSave(values, true)
                        }}

                        onClickBack={() => {
                            pageInfoChanged ? setConfirmExitModal(true) : onBack()
                        }}

                    />
                </div>

                <div >
                    <styled.Title schema={'default'}>{t("Editproc.name","Process Name")}</styled.Title>
                    <TextField
                        focus={!values.name}
                        placeholder={t("Editproc.name","Process Name")}
                        defaultValue={values.name}
                        schema={'processes'}
                        name={`name`}
                        InputComponent={Textbox}
                        style={{ fontSize: '1.2rem', fontWeight: '100' }}
                        textboxContainerStyle={{ border: "none" }}
                    />
                </div>
                {!selectedTask && startNodes.length>1 &&
                    <div style={{marginTop: '2.5rem'}}>
                        <styled.Title style={{ alignSelf: 'center' }}>Kickoff Diverging Type</styled.Title>
                        <styled.RowContainer style={{ justifyContent: 'space-between', borderBottom: "solid #b8b9bf 0.1rem", paddingBottom: "0.5rem", marginBottom: ".7rem" }}>

                            <styled.DualSelectionButton
                                style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                                onClick={() => {
                                    setFieldValue("startDivergeType", 'split')
                                }}
                                selected={values.startDivergeType === 'split'}
                            >
                                Split
                            </styled.DualSelectionButton>

                            <styled.DualSelectionButton
                                style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                                onClick={() => {
                                    setFieldValue("startDivergeType", 'choice')
                                }}
                                selected={values.startDivergeType === 'choice'}

                            >
                                Choice
                            </styled.DualSelectionButton>

                        </styled.RowContainer>
                    </div>
                }

                <styled.Title schema={'processes'} style={{ marginTop: "2rem", marginBottom: "1rem" }}>{t("routes","Routes")}</styled.Title>
                {selectedTask === null &&
                    <>
                        <styled.HelpText>{t("Editproc.clickstation","Click a station on the map to start a route")}</styled.HelpText>
                        {typeof errors.routes === 'string' &&
                            <styled.ErrorText>{errors.routes}</styled.ErrorText>
                        }
                    </>
                }

                {!!selectedTask && values.routes.find(route => route._id === selectedTask._id) !== undefined ?
                    <TaskField
                        {...formikProps}
                        routeCopy = {routeCopy}
                    />
                    :
                    <>
                      {renderRoutes(values.routes)}
                      <styled.ContentContainer>

                          {/* Save/Delete Buttons */}
                          <styled.ColumnContainer>
                              <Button
                                  schema={'processes'}
                                  disabled={!!selectedTask ||!!submitDisabled}
                                  onClick={() => {
                                      onSave(values, true)
                                  }}
                              >
                                  {t("save","Save")}
                              </Button>

                              <Button
                                  schema={'error'}
                                  disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                                  secondary
                                  onClick={() => {
                                      setConfirmDeleteModal(true)
                                  }}
                              >
                                  {t("delete","Delete")}
                              </Button>
                          </styled.ColumnContainer>
                      </styled.ContentContainer>
                    </>
                }

            </styled.Container>
        </>

    )
}

export default ProcessField
