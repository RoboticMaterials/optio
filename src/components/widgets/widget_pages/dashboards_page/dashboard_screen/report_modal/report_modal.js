import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

// external components
import { Formik } from "formik";
import Modal from 'react-modal';
import { useDispatch } from "react-redux";

import { Container, Draggable } from 'react-smooth-dnd';

// internal components
import Button from "../../../../../basic/button/button";

// utils

// actions
import { putDashboard } from "../../../../../../redux/actions/dashboards_actions";

// styles
import * as styled from './report_modal.style'
import { postReportEvent } from "../../../../../../redux/actions/report_event_actions";
import {isNonEmptyArray} from "../../../../../../methods/utils/array_utils";
import arrayMove from "array-move";
import ReportModalEditButtons from "./report_modal_edit_buttons/report_modal_edit_buttons";
import NewButtonForm from "./new_button_form/new_button_form";
import {checkPermission} from "../../../../../../methods/utils/permission_utils";
import {
    CREATE_REPORT_BUTTONS_REQUEST,
    EDIT_REPORT_BUTTONS_REQUEST,
} from "../../../../../../constants/permission_contants";
import ReportButton from "./report_button/report_button";
import {ThemeContext} from "styled-components";
import ScrollContainer from "../../../../../basic/scroll_container/scroll_container";

Modal.setAppElement('body');

const ReportModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit
    } = props

    const theme = useContext(ThemeContext);

    const dispatch = useDispatch()
    const dispatchPutDashboard = async (dashboardCopy, dashboardId) => await dispatch(putDashboard(dashboardCopy, dashboardId))
    const onPostReportEvent = (reportEvent) => dispatch(postReportEvent(reportEvent))

    const [noButtons, setNoButtons] = useState(true)
    const [addingNew, setAddingNew] = useState(false) // edit button form
    const [editing, setEditing] = useState(false)  // default editing to true if there are currently no buttons
    const [sending, setSending] = useState(false) // sending report
    const [reportButtons, setReportButtons] = useState(null) // sending report
    const [reportButtonId, setReportButtonId] = useState(null) // button being edited
    const [submitting, setSubmitting] = useState(false)
    const [dragging, setDragging] = useState(null)

    const formRef = useRef(null)	// gets access to form state
    const {
        current
    } = formRef || {}

    const {
        values = {},
        touched = {},
        errors = {},
        status = {},
        setValues = () => { },
        setErrors = () => { },
        resetForm = () => { },
        setTouched = () => { },
        setFieldValue = () => { },
        setStatus = () => { },
    } = current || {}

    useEffect(() => {
        setNoButtons(!isNonEmptyArray(dashboard?.report_buttons))
        setReportButtons(dashboard?.report_buttons || [])
    }, [dashboard])

    const sendReport = async (button) => {
        setSubmitting(true)
        const {
            id,
            iconClassName,
            color,
            ...rest
        } = button

        const reportEvent = {
            // save identifying info
            dashboardId: dashboard.id,
            stationId: dashboard.station,
            reportButtonId: id,
            date: new Date().getTime(),

            // spread rest of buttons data - commented out for now, get remaining data from actual report button when its needed
            // ...rest
        }

        // post reportEvent
        const result = await onPostReportEvent(reportEvent)

        // handle request failed
        if (result instanceof Error) {

            onSubmit(button.label, false)
        }

        // handle request success
        else {
            onSubmit(button.label, true)
        }
        setSubmitting(false)
        close()
    }

    const onDragStart = ({isSource, payload, willAcceptDrop}) => {
        setDragging(payload)
    }
    const handleDragEnd = () => {
        setDragging(null)
    }

    const handleDrop = (dropResult) => {
        const { removedIndex, addedIndex, payload, element } = dropResult || {}

        setDragging(payload)

        if (payload === null) { //  No new button, only reorder

        } else {
            if (addedIndex !== null && removedIndex !== null) {
                const shiftedButtons = arrayMove(reportButtons, removedIndex, addedIndex)
                setFieldValue("reportButtons",shiftedButtons)

                const updatedDashboard = {
                    ...dashboard,
                    report_buttons: shiftedButtons
                }

                // update dashboard
                dispatchPutDashboard(updatedDashboard, dashboard.id)
            }
        }

        setDragging(null)
    }

    const handleButtonClick = useCallback((button) => {
        const {
            id
        } = button

        if (editing) {
            setAddingNew(true)
            setReportButtonId(id)
        }
        else {
            sendReport(button)
        }
    }, [editing])

    return (
        <styled.Container
            isOpen={isOpen}
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 200,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(5px)',
                    transition: 'backdrop-filter 3s ease',
                },
                content: {
                    zIndex: 200,
                },
            }}
        >
            <styled.Header>
                <styled.Title>{editing ? "Edit Report" : "Send Report"}</styled.Title>

                <Button
                    onClick={close}
                    schema={'dashboards'}
                >
                    <i className="fa fa-times" aria-hidden="true" />
                </Button>
            </styled.Header>

            <styled.BodyContainer>
                {(addingNew || sending) ?
                    <NewButtonForm
                        cancel={() => {
                            setAddingNew(false)
                            setSending(false)
                            setReportButtonId(null)
                        }}
                        dashboard={dashboard}
                        reportButtonId={reportButtonId}
                        editing={true}
                    />
                    :
                    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <styled.ContentContainer>
                            <styled.AddNewButtonContainer
                                showBorder={!noButtons}
                            >
                                <ReportButton
                                    label={"Add Report Button"}
                                    invert={true}
                                    iconClassName={null}
                                    color={theme.schema.report.solid}
                                    onClick={() => setAddingNew(true)}
                                    className={null}
                                />

                            </styled.AddNewButtonContainer>

                            {!noButtons &&
                                    <ScrollContainer>
                                    {editing ?
                                        <Formik
                                            innerRef={formRef}
                                            enableReinitialize={true}
                                            initialValues={{
                                                reportButtons: reportButtons
                                            }}
                                        >
                                        <Container
                                            onDragStart={onDragStart}
                                            onDragEnd={handleDragEnd}
                                            onDrop={handleDrop}
                                            groupName="report-buttons"
                                            getChildPayload={index => values.reportButtons[index]}
                                            style={{
                                                alignSelf: "stretch",
                                                alignItems: "stretch",
                                                display: "flex",
                                                flexDirection: "column",
                                                minHeight: "fit-content",
                                                justifyContent: "flex-start"
                                            }}
                                            getGhostParent={()=>document.body}
                                            lockAxis={"y"}
                                        >
                                            <ReportModalEditButtons
                                                dragging={dragging}
                                                reportButtons={dashboard?.report_buttons}
                                                onClick={handleButtonClick}
                                                editing={editing}
                                            />
                                        </Container>
                                        </Formik>
                                        :
                                        <ReportModalEditButtons
                                            dragging={dragging}
                                            reportButtons={reportButtons}
                                            onClick={handleButtonClick}
                                            editing={editing}
                                        />
                                    }
                                    </ScrollContainer>
                            }
                        </styled.ContentContainer>

                        <styled.ButtonForm>
                            <Button
                                tertiary
                                schema={"dashboards"}
                                onClick={close}
                                label={"Close"}
                                type="button"
                            />

                            {
                                checkPermission(null, EDIT_REPORT_BUTTONS_REQUEST) &&
                                <Button
                                    primary
                                    schema={"dashboards"}
                                    onClick={() => setEditing(!editing)}
                                    label={editing ? "Done" : "Edit"}
                                    type="button"
                                />
                            }

                        </styled.ButtonForm>
                    </div>
                }
            </styled.BodyContainer>
        </styled.Container>
    );
};

export default ReportModal
