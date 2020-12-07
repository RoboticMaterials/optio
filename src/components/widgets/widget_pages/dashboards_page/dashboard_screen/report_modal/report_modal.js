import React, {useEffect, useState} from "react";
import Modal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";
import uuid from 'uuid'

// external components
import {Formik} from "formik";

// internal components
import ColorField from "../../../../../basic/form/color_field/color_field";
import WidgetButton from "../../../../../basic/widget_button/widget_button";
import Button from "../../../../../basic/button/button";
import Textbox from "../../../../../basic/textbox/textbox";
import TextField from "../../../../../basic/form/text_field/text_field";

// utils
import {faClassNames} from "../../../../../../methods/utils/class_name_utils";
import {FORM_MODES} from "../../../../../../constants/scheduler_constants";

// actions
import {putDashboard} from "../../../../../../redux/actions/dashboards_actions";

// styles
import * as styled from './report_modal.style'
import * as style from "../../dashboard_button/dashboard_button.style";
import * as buttonFieldStyles from "../../dashboard_editor/button_fields/button_fields.style";
import DeleteFieldButton from "../../../../../basic/form/delete_field_button/delete_field_button";
import DashboardButton from "../../dashboard_button/dashboard_button";
import {postReportEvent, putReportEvent} from "../../../../../../redux/actions/report_event_actions";
import {reportEventSchema, scheduleSchema} from "../../../../../../methods/utils/form_schemas";

Modal.setAppElement('body');

const NewButtonForm = (props) => {

    const {
        cancel,
        dashboard,
        buttonId,
        editing
    } = props

    const report_buttons = dashboard?.report_buttons || []


    const dispatch = useDispatch()
    const onPutDashboard = (dashboardCopy, dashboardId) =>dispatch(putDashboard(dashboardCopy, dashboardId))

    const editingButton = report_buttons.find((currButton) => currButton._id === buttonId)
    const _id = editingButton?._id
    const description = editingButton?.description
    const iconClassName = editingButton?.iconClassName
    const color  = editingButton?.color
    const label  = editingButton?.label

    const formMode = _id ? FORM_MODES.UPDATE : FORM_MODES.CREATE

    const handleSubmit = (values, formMode) => {
        // extract values and default values
        const description = values?.description || ""
        const iconClassName = values?.iconClassName
        const color = values?.color || "red"
        const label = values?.label || ""
        const old_report_buttons = dashboard?.report_buttons || []

        // handle logic for editing buttons
        if(editing) {

            // update existing button
            if(formMode === FORM_MODES.UPDATE ) {

                const updatedDashboard = {
                    ...dashboard,
                    report_buttons: old_report_buttons.map((currButton) => {

                        // if this is the button being updating, update values
                        if(currButton._id === _id) {
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
                onPutDashboard(updatedDashboard, dashboard._id.$oid)
            }

            // create new button
            else if(formMode === FORM_MODES.CREATE) {
                const updatedDashboard = {
                    ...dashboard,
                    report_buttons: [
                        // spread original buttons and add new one with form values
                        ...old_report_buttons,
                        {
                            _id: uuid.v4(),
                            description,
                            iconClassName,
                            color,
                            label
                        }
                    ]

                }

                // update dashboard
                onPutDashboard(updatedDashboard, dashboard._id.$oid)
            }

            // close form
            cancel()
        }

        // handle submit logic for sending report
        else {

        }
    }

    return(
        <Formik
            initialValues={{
                label: label ? label : "",
                description:  description ? description : "",
                iconClassName: iconClassName ? iconClassName : null,
                color: color ? color : "red"
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
                await handleSubmit(values, formMode)
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

                return(
                    <styled.StyledForm>
                        {/*uncomment for widget style instead of big rectangles*/}
                        {/*<WidgetButton*/}
                        {/*    containerStyle={{alignSelf: "center"}}*/}
                        {/*    label={label}*/}
                        {/*    color={color}*/}
                        {/*    iconClassName={iconClassName}*/}
                        {/*    selected={false}*/}
                        {/*/>*/}
                        {editing &&
                        <DashboardButton
                            title={label}
                            type={"button"}
                            iconClassName={iconClassName}
                            iconColor={color}
                            containerStyle={{height: '4rem', minHeight: "4rem", lineHeight: '3rem', width: '80%', alignSelf: "center", marginBottom: "1rem"}}
                            hoverable={false}
                            color = {color}
                            disabled = {false}
                        />
                        }

                        <div style={{marginBottom: "1rem"}}>
                            <styled.Label>Label</styled.Label>
                            {editing &&
                                <TextField
                                    name="label"
                                    type="text"
                                    placeholder="Label..."
                                    InputComponent={Textbox}
                                    lines={1}
                                    style={{borderRadius: ".5rem"}}
                                />
                                // :
                                // <styled.TextboxDiv
                                //     name="label"
                                //     type="text"
                                //     placeholder="Label..."
                                //     // value={label}
                                //     lines={1}
                                //     style={{marginBottom: "1rem"}}
                                //     readonly
                                // >
                                //     {label}
                                // </styled.TextboxDiv>
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
                                    style={{borderRadius: "0.5rem"}}
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

                        {/*{!editing &&*/}
                        {/*<div>*/}
                        {/*    <styled.Label>Comments</styled.Label>*/}
                        {/*    <TextField*/}
                        {/*        name="comments"*/}
                        {/*        type="text"*/}
                        {/*        placeholder="enter additonal comments..."*/}
                        {/*        InputComponent={Textbox}*/}
                        {/*        lines={5}*/}
                        {/*        style={{marginBottom: "1rem", borderRadius: ".5rem"}}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*}*/}

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
                            />
                        </div>
                        }

                        {/*{editing &&*/}
                        {/*<div style={{overflow: "hidden", marginBottom: "1rem", display: "flex", flexDirection: "column"}}>*/}
                        {/*    <styled.Label>Icon</styled.Label>*/}
                        {/*    <styled.IconSelectorContainer>*/}
                        {/*        {faClassNames.map((currClassName, index) => {*/}
                        {/*            currClassName = "fas fa-" + currClassName*/}
                        {/*            const selected = currClassName === values.iconClassName*/}

                        {/*            return(*/}
                        {/*                <WidgetButton*/}
                        {/*                    key={currClassName}*/}
                        {/*                    containerStyle={{*/}
                        {/*                        margin: "1rem",*/}
                        {/*                    }}*/}
                        {/*                    color={color}*/}
                        {/*                    iconClassName={currClassName}*/}
                        {/*                    selected={selected}*/}
                        {/*                    onClick={()=>{*/}
                        {/*                        setFieldValue("iconClassName", currClassName)*/}
                        {/*                    }}*/}
                        {/*                />*/}
                        {/*            )*/}
                        {/*        })}*/}
                        {/*    </styled.IconSelectorContainer>*/}
                        {/*</div>*/}
                        {/*}*/}

                        <styled.ButtonForm>
                            <Button
                                tertiary
                                schema={"dashboards"}
                                onClick={cancel}
                                label={"Cancel"}
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
        onSubmit
    } = props

    // get current buttons, default to empty array
    const report_buttons = dashboard?.report_buttons || []

    const dispatch = useDispatch()
    const onPutDashboard = (dashboardCopy, dashboardId) =>dispatch(putDashboard(dashboardCopy, dashboardId))
    const onPostReportEvent = (reportEvent) =>dispatch(postReportEvent(reportEvent))
    const onPutReportEvent = (id, reportEvent) =>dispatch(putReportEvent(id, reportEvent))

    // boolean - true if no buttons, false otherwise
    const noButtons = report_buttons.length === 0

    const [addingNew, setAddingNew] = useState(false) // edit button form
    const [editing, setEditing] = useState(noButtons)  // default editing to true if there are currently no buttons
    const [sending, setSending] = useState(false) // sending report
    const [buttonId, setButtonId] = useState(null) // button being edited
    const [submitting, setSubmitting] = useState(false)

    const reportEvents = useSelector(state => { return state.reportEventsReducer.reportEvents })

    const sendReport = async (button) => {
        setSubmitting(true)
        const {
            _id,
            iconClassName,
            color,
            ...rest
        } = button

        const existingReportEvent = reportEvents[_id]

        // there is already an existing reportEvent for this button, update it
        if(existingReportEvent) {

            // create new event entry
            const newEvent = {
                date: new Date().getTime(),
                name: "REPORT_SENT",
            }

            // update reportEvent
            const updatedReportEvent = {
                // spread original data
                ...existingReportEvent,

                // increment event count
                event_count: existingReportEvent.event_count + 1,

                // add new event to events list
                events:  [
                    ...existingReportEvent.events,
                    newEvent
                ]
            }

            onPutReportEvent(existingReportEvent._id, updatedReportEvent)
        }

        // no existing reportEvent was found for this button, create new
        else {
            const reportEvent = {
                // save identifying info
                dashboard_id: dashboard._id.$oid,
                station_id: dashboard.station,
                report_button_id: _id,

                // add event_count
                event_count: 1,

                // add event list with initial event
                events:  [{
                    date: new Date().getTime(),
                    name: "REPORT_SENT",
                }],

                // spread rest of buttons data
                ...rest
            }

            onPostReportEvent(reportEvent)

        }


        onSubmit(button.label)
        setSubmitting(false)
        close()
    }

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Confirm Delete Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500
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
                    <i className="fa fa-times" aria-hidden="true"/>
                </Button>
            </styled.Header>

            <styled.BodyContainer>
                {(addingNew || sending) ?
                    <NewButtonForm
                        cancel={()=>{
                            setAddingNew(false)
                            setSending(false)
                            setButtonId(null)
                        }}
                        dashboard={dashboard}
                        buttonId={buttonId}
                        editing={editing}
                    />
                    :
                    <div style={{display: "flex", flexDirection: "column", overflow: "hidden"}}>
                        <styled.ContentContainer>
                            {editing &&
                            <styled.AddNewButtonContainer
                                showBorder={!noButtons}
                            >
                                <Button
                                    style={{margin: "1rem 0rem"}}
                                    primary
                                    schema={"dashboards"}
                                    onClick={()=>setAddingNew(true)}
                                    label={"+"}
                                    type="button"
                                />
                            </styled.AddNewButtonContainer>
                            }

                            {!noButtons &&
                            <styled.ReportButtonsContainer>

                                {report_buttons.map((currReportButton, ind) => {

                                    const description = currReportButton?.description || ""
                                    const label = currReportButton?.label
                                    const iconClassName = currReportButton?.iconClassName || ""
                                    const color = currReportButton?.color || "red"
                                    const _id = currReportButton?._id
                                    return(
                                        <DashboardButton
                                            title={label}
                                            key={_id}
                                            type={null}
                                            iconClassName={iconClassName}
                                            iconColor={color}
                                            onClick={()=>{
                                                if(editing) {
                                                    setAddingNew(true)
                                                    setButtonId(_id)
                                                }
                                                else {
                                                    // setSending(true)
                                                    // setButtonId(_id)
                                                    sendReport(currReportButton)
                                                }
                                            }}
                                            containerStyle={{height: '4rem', minHeight: "4rem", lineHeight: '3rem', margin: '0.5rem 0', width: '80%'}}
                                            hoverable={false}
                                            taskID = {null}
                                            color = {color}
                                            disabled = {false}
                                        >
                                            {editing &&
                                                <div
                                                    style={{zIndex: 500}}
                                                    onClick={(event)=>{
                                                        // remove button
                                                        event.preventDefault()
                                                        event.stopPropagation()


                                                        const updatedDashboard = {
                                                            ...dashboard,
                                                            // filter through buttons, keep all but one with matching id of current button
                                                            report_buttons: report_buttons.filter((currOldButton) => currOldButton._id !== _id)
                                                        }

                                                        // update dashboard
                                                        onPutDashboard(updatedDashboard, dashboard._id.$oid)
                                                    }}
                                                >
                                                    <i
                                                        style={{color: "red", position: "absolute", fontSize: "1.5rem", top: 5, right: 5}}
                                                        className="fas fa-times-circle"

                                                    />
                                                </div>

                                            }
                                        </DashboardButton>
                                    )

                                    // uncomment for widget style instead of big rectangles
                                    // return(
                                    //     <styled.ButtonContainer
                                    //         background={color}
                                    //         onClick={()=>{
                                    //             if(editing) {
                                    //               setAddingNew(true)
                                    //                 setButtonId(_id)
                                    //             }
                                    //             else {
                                    //                 setSending(true)
                                    //                 setButtonId(_id)
                                    //             }
                                    //
                                    //         }}
                                    //
                                    //     >
                                    //         <div style={{flex: 1}}></div>
                                    //
                                    //         <div style={{flex: 1, display: "flex", justifyContent: "center"}}>
                                    //             <styled.ConditionText>{label}</styled.ConditionText>
                                    //         </div>
                                    //
                                    //         <div style={{flex: 1, display: "flex", justifyContent: "flex-end", height: "100%"}}>
                                    //             {iconClassName &&
                                    //             <styled.RightContentContainer>
                                    //
                                    //                 <buttonFieldStyles.SchemaIcon className={iconClassName}
                                    //                                               color={color}></buttonFieldStyles.SchemaIcon>
                                    //             </styled.RightContentContainer>
                                    //             }
                                    //
                                    //         </div>
                                    //
                                    //         {editing &&
                                    //             <i
                                    //                 style={{color: "red", position: "absolute", top: 5, right: 5}}
                                    //                 className="fas fa-times-circle"
                                    //                 onClick={(event)=>{
                                    //                     // remove button
                                    //                     event.preventDefault()
                                    //                     event.stopPropagation()
                                    //
                                    //
                                    //                     const updatedDashboard = {
                                    //                         ...dashboard,
                                    //                         // filter through buttons, keep all but one with matching id of current button
                                    //                         report_buttons: report_buttons.filter((currOldButton) => currOldButton._id !== _id)
                                    //                     }
                                    //
                                    //                     // update dashboard
                                    //                     onPutDashboard(updatedDashboard, dashboard._id.$oid)
                                    //                 }}
                                    //             />
                                    //         }
                                    //             {/*<WidgetButton*/}
                                    //             {/*    key={iconClassName}*/}
                                    //             {/*    containerStyle={{*/}
                                    //             {/*        // margin: "1rem",*/}
                                    //             {/*    }}*/}
                                    //             {/*    color={color}*/}
                                    //             {/*    iconClassName={iconClassName}*/}
                                    //             {/*    label={label}*/}
                                    //             {/*    onClick={()=>{*/}
                                    //             {/*        if(editing) {*/}
                                    //             {/*            setAddingNew(true)*/}
                                    //             {/*            setButtonId(_id)*/}
                                    //             {/*        }*/}
                                    //             {/*        else {*/}
                                    //             {/*            setSending(true)*/}
                                    //             {/*            setButtonId(_id)*/}
                                    //             {/*        }*/}
                                    //
                                    //             {/*    }}*/}
                                    //             {/*>*/}
                                    //             {/*    {editing &&*/}
                                    //             {/*    <i*/}
                                    //             {/*        style={{color: "red", position: "absolute", top: 5, right: 5}}*/}
                                    //             {/*        className="fas fa-times-circle"*/}
                                    //             {/*        onClick={(event)=>{*/}
                                    //             {/*            // remove button*/}
                                    //
                                    //             {/*            event.preventDefault()*/}
                                    //             {/*            event.stopPropagation()*/}
                                    //
                                    //
                                    //             {/*            const updatedDashboard = {*/}
                                    //             {/*                ...dashboard,*/}
                                    //             {/*                // filter through buttons, keep all but one with matching id of current button*/}
                                    //             {/*                report_buttons: report_buttons.filter((currOldButton) => currOldButton._id !== _id)*/}
                                    //             {/*            }*/}
                                    //
                                    //             {/*            // update dashboard*/}
                                    //             {/*            onPutDashboard(updatedDashboard, dashboard._id.$oid)*/}
                                    //             {/*        }}*/}
                                    //             {/*    />*/}
                                    //             {/*    }*/}
                                    //             {/*</WidgetButton>*/}
                                    //
                                    //         {/*</div>*/}
                                    //
                                    //
                                    //     </styled.ButtonContainer>
                                    //
                                    // )
                                })}
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
                                onClick={()=>setEditing(!editing)}
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
