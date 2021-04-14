import React, {useCallback, useEffect, useRef, useState} from "react";

// external components
import { Formik } from "formik";
import Modal from 'react-modal';
import { useDispatch, useSelector } from "react-redux";
import uuid from 'uuid'
import { Container, Draggable } from 'react-smooth-dnd';

// internal components
import ColorField from "../../../../../basic/form/color_field/color_field";
import WidgetButton from "../../../../../basic/widget_button/widget_button";
import Button from "../../../../../basic/button/button";
import Textbox from "../../../../../basic/textbox/textbox";
import TextField from "../../../../../basic/form/text_field/text_field";

// utils
import { faClassNames } from "../../../../../../methods/utils/class_name_utils";
import { FORM_MODES } from "../../../../../../constants/scheduler_constants";

// actions
import { putDashboard } from "../../../../../../redux/actions/dashboards_actions";

// styles
import * as styled from './report_modal.style'
import * as style from "../../dashboard_buttons/dashboard_button/dashboard_button.style";
import * as buttonFieldStyles from "../../dashboard_editor/button_fields/button_fields.style";
import DeleteFieldButton from "../../../../../basic/form/delete_field_button/delete_field_button";
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";
import { postReportEvent, putReportEvent } from "../../../../../../redux/actions/report_event_actions";
import { reportEventSchema, scheduleSchema } from "../../../../../../methods/utils/form_schemas";
import { DASHBOARD_BUTTON_COLORS } from "../../../../../../constants/dashboard_contants";
import {immutableDelete, immutableReplace} from "../../../../../../methods/utils/array_utils";
import arrayMove from "array-move";
import {isObject} from "../../../../../../methods/utils/object_utils";
import ReportModalEditButtons from "./report_modal_edit_buttons/report_modal_edit_buttons";

Modal.setAppElement('body');

const NewButtonForm = (props) => {

    const {
        cancel,
        dashboard,
        dashboardButtonId,
        reportButtonId,
        editing,
        setFieldValue
    } = props

    const report_buttons = dashboard?.report_buttons || []


    const dispatch = useDispatch()
    const dispatchPutDashboard = (dashboardCopy, dashboardId) => dispatch(putDashboard(dashboardCopy, dashboardId))

    const editingButton = report_buttons.find((currButton) => currButton._id === reportButtonId)
    const _id = editingButton?._id
    const description = editingButton?.description
    const iconClassName = editingButton?.iconClassName
    const color = editingButton?.color
    const label = editingButton?.label

    const formMode = _id ? FORM_MODES.UPDATE : FORM_MODES.CREATE

    const onSubmit = (values, formMode) => {

        // extract values and default values
        const description = values?.description || ""
        const iconClassName = values?.iconClassName
        const color = values?.color || "#ff4b4b"
        const label = values?.label || ""
        const old_report_buttons = dashboard?.report_buttons || []

        // get dashboard's buttons
        const {
            buttons = []
        } = dashboard || {}

        // get index of current dashboard button
        const dashboardButtonIndex = buttons.findIndex((currButton) => {
            const {
                id
            } = currButton || {}

            return id === dashboardButtonId
        })

        // get dashboard button
        const dashboardButton = buttons[dashboardButtonIndex]

        // get dashboard button's report buttons
        const {
            reportButtons = []
        } = dashboardButton || {}

        // handle logic for editing buttons
        if (editing) {

            // update existing button
            if (formMode === FORM_MODES.UPDATE) {

                const updatedDashboard = {
                    ...dashboard,
                    report_buttons: old_report_buttons.map((currButton) => {

                        // if this is the button being updating, update values
                        if (currButton._id === _id) {
                            return {
                                ...currButton,
                                description,
                                iconClassName,
                                color,
                                label
                            }
                        }

                        // if not current button being editing, return original
                        return currButton
                    })
                }

                // update dashboard
                dispatchPutDashboard(updatedDashboard, dashboard._id.$oid)
            }

            // create new button
            else if (formMode === FORM_MODES.CREATE) {

                const newReportButton = {
                    _id: uuid.v4(),
                    description,
                    iconClassName,
                    color,
                    label
                }

                const updatedDashboard = {
                    ...dashboard,
                    report_buttons: [
                        // spread original buttons and add new one with form values
                        ...old_report_buttons,
                        newReportButton
                    ],
                    buttons: immutableReplace(buttons, {
                        ...dashboardButton,
                        reportButtons: [...reportButtons, newReportButton._id]
                    }, dashboardButtonIndex)

                }

                // update dashboard
                dispatchPutDashboard(updatedDashboard, dashboard._id.$oid)
            }

            // close form
            cancel()
        }

        // handle submit logic for sending report
        else {

        }
    }

    const onDelete = () => {
        const {
            buttons = []
        } = dashboard || {}

        // get index of dashboard button
        const dashboardButtonIndex = buttons.findIndex((currButton) => {
            const {
                id
            } = currButton || {}

            return id === dashboardButtonId
        })

        // get dashboard button
        const dashboardButton = buttons[dashboardButtonIndex]

        // get dashboard button's report buttons
        const {
            reportButtons = []
        } = dashboardButton || {}

        // get index of current report button
        const currReportButtonIndex = reportButtons.indexOf(_id)

        // create updated dashboard
        const updatedDashboard = {
            ...dashboard,
            buttons: immutableReplace(buttons, {
                ...dashboardButton,
                reportButtons: immutableDelete(reportButtons, currReportButtonIndex)
            }, dashboardButtonIndex)
        }

        // update dashboard
        dispatchPutDashboard(updatedDashboard, dashboard._id.$oid)

        // close form
        cancel()
    }

    return (
        <Formik
            initialValues={{
                label: label ? label : "",
                description: description ? description : "",
                iconClassName: iconClassName ? iconClassName : null,
                color: color ? color : "#ff4b4b"
            }}

            // validation control
            validationSchema={reportEventSchema}
            validateOnChange={true}
            validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
            validateOnBlur={true}
            enableReinitialize={true} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
            onSubmit={async (values, { setSubmitting, setTouched, resetForm }) => {
                // set submitting to true, handle submit, then set submitting to false
                // the submitting property is useful for eg. displaying a loading indicator
                setSubmitting(true)
                await onSubmit(values, formMode)
                setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
                setSubmitting(false)
                resetForm()
            }}
        >
            {formikProps => {
                const {
                    values,
                    setFieldValue
                } = formikProps

                const {
                    color,
                    label,
                    iconClassName
                } = values

                return (
                    <styled.StyledForm>
                        {editing &&
                            <DashboardButton
                                title={label}
                                type={"button"}
                                iconClassName={iconClassName}
                                iconColor={color}
                                containerStyle={{ height: '4rem', minHeight: "4rem", lineHeight: '3rem', width: '80%', alignSelf: "center", marginBottom: "1rem" }}
                                hoverable={false}
                                color={color}
                                disabled={false}
                            />
                        }

                        <div style={{ marginBottom: "1rem" }}>
                            <styled.Label>Label</styled.Label>
                            {editing &&
                                <TextField
                                    name="label"
                                    type="text"
                                    placeholder="Label..."
                                    InputComponent={Textbox}
                                    style={{ borderRadius: ".5rem" }}
                                />
                            }
                        </div>

                        {editing ?
                            <div
                                style={{
                                    marginBottom: "1rem"
                                }}
                            >
                                <styled.Label>Description</styled.Label>
                                <TextField
                                    name="description"
                                    type="text"
                                    placeholder="Description..."
                                    InputComponent={Textbox}
                                    lines={2}
                                    style={{ borderRadius: "0.5rem" }}
                                />
                            </div>
                            :
                            description ?
                                <div
                                    style={{
                                        marginBottom: "1rem"
                                    }}
                                >
                                    <styled.Label>Description</styled.Label>
                                    <styled.TextboxDiv
                                        name="description"
                                        type="text"
                                        placeholder="Description..."
                                        readonly
                                    >
                                        {description}
                                    </styled.TextboxDiv>
                                </div>
                                :
                                null
                        }

                        {editing &&
                            <div
                                style={{
                                    marginBottom: "1rem"
                                }}
                            >
                                <styled.Label>Color</styled.Label>
                                <ColorField
                                    name={"color"}
                                    Container={styled.ColorFieldContainer}
                                    type={"button"}
                                    mode={"twitter"}
                                    colors={DASHBOARD_BUTTON_COLORS}
                                />
                            </div>
                        }
                        <styled.ButtonForm>
                            <Button
                                secondary
                                schema={"dashboards"}
                                onClick={onDelete}
                                label={"Delete"}
                                type="button"
                            />

                            <Button
                                primary
                                schema={"dashboards"}
                                label={editing ? "Save" : "Send"}
                                type="submit"
                            />
                        </styled.ButtonForm>
                    </styled.StyledForm>
                )
            }}
        </Formik>
    )
}

const ReportModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit,
        dashboardButtonId
    } = props


    const dispatch = useDispatch()
    const dispatchPutDashboard = async (dashboardCopy, dashboardId) => await dispatch(putDashboard(dashboardCopy, dashboardId))
    const onPostReportEvent = (reportEvent) => dispatch(postReportEvent(reportEvent))
    const onPutReportEvent = (id, reportEvent) => dispatch(putReportEvent(id, reportEvent))

    const [noButtons, setNoButtons] = useState(true)
    const [addingNew, setAddingNew] = useState(false) // edit button form
    const [editing, setEditing] = useState(false)  // default editing to true if there are currently no buttons
    const [sending, setSending] = useState(false) // sending report
    const [report_buttons, setReport_buttons] = useState([]) // sending report
    const [reportButtons, setReportButtons] = useState(null) // sending report
    const [reportButtonId, setReportButtonId] = useState(null) // button being edited
    const [submitting, setSubmitting] = useState(false)
    const [dragging, setDragging] = useState(null)
    const [didInitialCheckForButtons, setDidInitialCheckForButtons] = useState(false)
    const [dashboardButton, setDashboardButton] = useState({})
    const [dashboardButtonIndex, setDashboardButtonIndex] = useState(null)

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
        if(reportButtons !== null) {
            const matchingButtons = reportButtons.filter((currReportButtonId) => {
                return report_buttons.findIndex((currReportButton) => currReportButton._id === currReportButtonId) !== -1
            })
            setNoButtons(!(matchingButtons.length > 0))
            setDidInitialCheckForButtons(true)
        }
    }, [report_buttons, reportButtons])

    useEffect(() => {
        setReport_buttons(dashboard?.report_buttons || [])

        const {
            buttons = []
        } = dashboard || {}

        const dashboardButtonIndex = buttons.findIndex((currButton) => {
            const {
                id
            } = currButton || {}

            return id === dashboardButtonId
        })
        setDashboardButtonIndex(dashboardButtonIndex)

        const dashboardButton = buttons[dashboardButtonIndex]
        setDashboardButton(dashboardButton)

        const {
            reportButtons = []
        } = dashboardButton || {}

        setReportButtons(reportButtons)
    }, [dashboard])

    useEffect(() => {
        if(noButtons && didInitialCheckForButtons) setEditing(true)
    }, [noButtons, didInitialCheckForButtons])


    const sendReport = async (button) => {
        setSubmitting(true)
        const {
            _id,
            iconClassName,
            color,
            ...rest
        } = button

        const reportEvent = {
            // save identifying info
            dashboard_id: dashboard._id.$oid,
            station_id: dashboard.station,
            report_button_id: _id,
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

                const {
                    buttons = []
                } = dashboard || {}

                const updatedDashboard = {
                    ...dashboard,
                   buttons: immutableReplace(buttons, {
                       ...dashboardButton,
                       reportButtons: shiftedButtons
                   }, dashboardButtonIndex)
                }

                // update dashboard
                dispatchPutDashboard(updatedDashboard, dashboard._id.$oid)
            }
        }

        setDragging(null)
    }

    const handleButtonClick = useCallback((button) => {
        const {
            _id
        } = button

        if (editing) {
            setAddingNew(true)
            setReportButtonId(_id)
        }
        else {
            sendReport(button)
        }
    }, [editing])

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Confirm Delete Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
                content: {

                }
            }}
        >
            <styled.Header>
                <styled.Title>{title}</styled.Title>

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
                        dashboardButtonId={dashboardButtonId}
                        reportButtonId={reportButtonId}
                        editing={editing}
                    />
                    :
                    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <styled.ContentContainer>
                            {editing &&
                                <styled.AddNewButtonContainer
                                    showBorder={!noButtons}
                                >
                                    <styled.AddNewButtonsText>Add Report Button</styled.AddNewButtonsText>
                                    <Button
                                        style={{ margin: "1rem 0rem", width: "5rem" }}
                                        primary
                                        schema={"dashboards"}
                                        onClick={() => setAddingNew(true)}
                                        label={"+"}
                                        type="button"
                                    />
                                </styled.AddNewButtonContainer>
                            }

                            {!noButtons &&
                                <styled.ReportButtonsContainer>
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
                                                report_buttons={report_buttons}
                                                buttonsIds={values.reportButtons || []}
                                                onClick={handleButtonClick}
                                                editing={editing}
                                            />
                                        </Container>

                                        </Formik>
                                        :
                                        <ReportModalEditButtons
                                            dragging={dragging}
                                            report_buttons={report_buttons}
                                            buttonsIds={reportButtons || []}
                                            onClick={handleButtonClick}
                                            editing={editing}
                                        />
                                    }

                                </styled.ReportButtonsContainer>
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
                            <Button
                                primary
                                schema={"dashboards"}
                                onClick={() => setEditing(!editing)}
                                label={editing ? "Done" : "Edit"}
                                type="button"
                            />
                        </styled.ButtonForm>
                    </div>
                }
            </styled.BodyContainer>
        </styled.Container>
    );
};

export default ReportModal
