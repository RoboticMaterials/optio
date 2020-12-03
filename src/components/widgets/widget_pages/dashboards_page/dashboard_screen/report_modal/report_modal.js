import React, {useState} from "react";
import Modal from 'react-modal';

import * as styled from './report_modal.style'
import Button from "../../../../../basic/button/button";
import Textbox from "../../../../../basic/textbox/textbox";
import TextField from "../../../../../basic/form/text_field/text_field";
import {FORM_MODES} from "../../../../../../constants/scheduler_constants";
import {Formik} from "formik";
import {putDashboard} from "../../../../../../redux/actions/dashboards_actions";
import {useDispatch} from "react-redux";
import uuid from 'uuid'
import * as style from "../../dashboards_sidebar/dashboards_sidebar.style";
import {REPORT_TYPES} from "../../dashboards_sidebar/dashboards_sidebar";
import {faClassNames} from "../../../../../../methods/utils/class_name_utils";
import ColorField from "../../../../../basic/form/color_field/color_field";

Modal.setAppElement('body');

var names = new Set();
var icons = document.getElementsByClassName('icon');
for (const icon of icons) {
    const name = icon.getElementsByTagName('dd')[0].innerText;
    names.add(name);
}
console.log("JSON.stringify(Array.from(names))",JSON.stringify(Array.from(names)));

const NewButtonForm = (props) => {

    const {
        cancel,
        dashboard,
        buttonId,
        editing
    } = props


    const dispatch = useDispatch()
    const onPutDashboard = (dashboardCopy, dashboardId) =>dispatch(putDashboard(dashboardCopy, dashboardId))

    const editingButton = dashboard?.report_buttons.find((currButton) => currButton._id === buttonId)
    const _id = editingButton?._id
    const description = editingButton?.description
    const iconClassName = editingButton?.iconClassName
    const color  = editingButton?.color
    const label  = editingButton?.label

    console.log("editingButton",editingButton)

    const handleSubmit = (values, formMode) => {
        const description = values?.description || ""
        const iconClassName = values?.iconClassName
        const color = values?.color || "red"
        const label = values?.label || ""


        const old_report_buttons = dashboard?.report_buttons || []

        if(editing) {
            if(formMode === FORM_MODES.UPDATE ) {
                const updatedDashboard = {
                    ...dashboard,
                    report_buttons: old_report_buttons.map((currButton) => {
                        if(currButton._id === _id) {
                            return {
                                ...currButton,
                                description,
                                iconClassName,
                                color,
                                label
                            }
                        }
                        return currButton
                    })
                }

                onPutDashboard(updatedDashboard, dashboard._id.$oid)
            }
            else if(formMode === FORM_MODES.CREATE) {
                const updatedDashboard = {
                    ...dashboard,
                    report_buttons: [
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

                onPutDashboard(updatedDashboard, dashboard._id.$oid)
            }

            cancel()
        }



    }

    const formMode = _id ? FORM_MODES.UPDATE : FORM_MODES.CREATE

    return(
        <Formik
            initialValues={{
                label: label ? label : "",
                description:  description ? description : "",
                iconClassName: iconClassName ? iconClassName : "far fa-flag",
                color: color ? color : "red"
            }}

            // validation control
            validationSchema={null}
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
                const { values, setFieldValue } = formikProps

                const {
                    color,
                    label,
                    iconClassName
                } = values

                return(
                    <styled.StyledForm>
                        <styled.WidgetButtonButton
                            type={"button"}
                            style={{
                                // marginBottom: "1rem",
                                alignSelf: "center"
                            }}
                            // schema={schema}
                        >
                            <styled.WidgetButtonIcon selected={true} color={color} className={iconClassName}/>
                            {label &&
                                <styled.WidgetButtonText>{label}</styled.WidgetButtonText>
                            }
                        </styled.WidgetButtonButton>



                        <div>
                            <styled.Label>Label</styled.Label>
                        {editing ?
                            <TextField
                                name="label"
                                type="text"
                                placeholder="Label..."
                                InputComponent={Textbox}
                                lines={1}
                                style={{marginBottom: "1rem", borderRadius: ".5rem"}}
                            />
                            :
                            <styled.TextboxDiv
                                name="label"
                                type="text"
                                placeholder="Label..."
                                // value={label}
                                lines={1}
                                style={{marginBottom: "1rem"}}
                                readonly
                            >
                                {label}
                            </styled.TextboxDiv>
                        }
                        </div>


                        {editing ?
                            <div>
                                <styled.Label>Description</styled.Label>
                                <TextField
                                    name="description"
                                    type="text"
                                    placeholder="Description..."
                                    InputComponent={Textbox}
                                    lines={5}
                                    style={{marginBottom: "1rem", borderRadius: "0.5rem"}}
                                />
                            </div>
                        :
                            description ?
                                <div>
                                    <styled.Label>Description</styled.Label>
                                    <styled.TextboxDiv
                                        name="description"
                                        type="text"
                                        placeholder="Description..."
                                        // value={description}
                                        // lines={5}
                                        style={{marginBottom: "1rem"}}
                                        readonly
                                    >
                                        {description}
                                    </styled.TextboxDiv>
                                </div>
                                    :
                                    null

                        }


                        {!editing &&
                        <div>
                            <styled.Label>Comments</styled.Label>
                        <TextField
                            name="comments"
                            type="text"
                            placeholder="enter additonal comments..."
                            InputComponent={Textbox}
                            lines={5}
                            style={{marginBottom: "1rem", borderRadius: ".5rem"}}
                        />
                            </div>
                        }






                        {editing &&
                        <div>
                            <styled.Label>Color</styled.Label>
                        <ColorField
                            name={"color"}
                            Container={styled.ColorFieldContainer}
                            type={"button"}
                            mode={"twitter"}
                        />
                        </div>
                        }



                        {editing &&
                        <div style={{overflow: "hidden", marginBottom: "1rem", display: "flex", flexDirection: "column"}}>
                            <styled.Label>Icon</styled.Label>
                        <styled.IconSelectorContainer>
                            {faClassNames.map((currClassName, index) => {
                                currClassName = "fas fa-" + currClassName
                                const selected = currClassName === values.iconClassName
                                const schema = REPORT_TYPES.REPORT.schema

                                return(
                                    <styled.WidgetButtonButton
                                        key={currClassName}
                                        type={"button"}
                                        style={{
                                            margin: "1rem",
                                            color: selected ? "red" : "white"
                                        }}
                                        onClick={()=>{
                                            setFieldValue("iconClassName", currClassName)
                                        }}
                                        schema={schema}
                                    >
                                        <styled.WidgetButtonIcon selected={selected} color={color} className={currClassName}/>
                                    </styled.WidgetButtonButton>
                                )
                            })

                            }
                        </styled.IconSelectorContainer>
                            </div>
                        }






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
        dashboard

    } = props

    const dispatch = useDispatch()
    const onPutDashboard = (dashboardCopy, dashboardId) =>dispatch(putDashboard(dashboardCopy, dashboardId))

    const [addingNew, setAddingNew] = useState(false)
    const [editing, setEditing] = useState(false)
    const [sending, setSending] = useState(false)
    const [buttonId, setButtonId] = useState(null)

    const report_buttons = dashboard?.report_buttons || []

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
                                <styled.AddNewButtonContainer>
                                    <Button
                                        primary
                                        schema={"dashboards"}
                                        onClick={()=>setAddingNew(true)}
                                        label={"+"}
                                        type="button"
                                    />
                                </styled.AddNewButtonContainer>

                            }
                        <styled.ReportButtonsContainer style={{marginBottom: "1rem"}}>

                            {report_buttons.map((currReportButton, ind) => {

                                const description = currReportButton?.description || ""
                                const label = currReportButton?.label
                                const iconClassName = currReportButton?.iconClassName || ""
                                const color = currReportButton?.color || "red"
                                const _id = currReportButton?._id

                                const schema = REPORT_TYPES.REPORT.schema

                                return(
                                    <styled.WidgetButtonButton
                                        schema={schema}
                                        style={{
                                            margin: "1rem",
                                        }}
                                        onClick={()=>{
                                            if(editing) {
                                                setAddingNew(true)
                                                setButtonId(_id)
                                            }
                                            else {
                                                setSending(true)
                                                setButtonId(_id)
                                            }

                                        }}
                                    >
                                        {editing &&
                                            <i
                                                style={{color: "red", position: "absolute", top: 5, right: 5}}
                                                className="fas fa-times-circle"
                                                onClick={(event)=>{
                                                    event.preventDefault()
                                                    event.stopPropagation()

                                                    const old_report_buttons = dashboard?.report_buttons || []

                                                    const updatedDashboard = {
                                                        ...dashboard,
                                                        report_buttons: old_report_buttons.filter((currOldButton) => currOldButton._id !== _id)
                                                    }

                                                    onPutDashboard(updatedDashboard, dashboard._id.$oid)

                                                }}
                                            />
                                        }
                                        {/*<div>{description}</div>*/}
                                        <styled.WidgetButtonIcon selected color={color} className={iconClassName}/>
                                        {label &&
                                        <styled.WidgetButtonText>{label}</styled.WidgetButtonText>
                                        }

                                    </styled.WidgetButtonButton>

                                )
                            })}
                        </styled.ReportButtonsContainer>
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
