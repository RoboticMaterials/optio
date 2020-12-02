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
        dashboard
    } = props

    const dispatch = useDispatch()
    const onPutDashboard = (dashboardCopy, dashboardId) =>dispatch(putDashboard(dashboardCopy, dashboardId))


    const handleSubmit = (values, formMode) => {
        const description = values?.description || ""
        const iconClassName = values?.iconClassName
        const color = values?.color || "red"


        const old_report_buttons = dashboard?.report_buttons || []

        const updatedDashboard = {
            ...dashboard,
            report_buttons: [
                ...old_report_buttons,
                {
                    _id: uuid.v4(),
                    description,
                    iconClassName,
                    color
                }
            ]

        }

        onPutDashboard(updatedDashboard, dashboard._id.$oid)

        cancel()
    }

    const formMode = FORM_MODES.CREATE

    return(
        <Formik
            initialValues={{
                description:  "",
                iconClassName: "far fa-flag",
                color: "red"
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
                    color
                } = values

                return(
                    <styled.StyledForm>
                        <TextField
                            name="description"
                            type="text"
                            placeholder="Description..."
                            InputComponent={Textbox}
                            lines={5}
                            style={{marginBottom: "1rem"}}
                        />

                        <ColorField
                            name={"color"}
                            Container={styled.ColorFieldContainer}
                            type={"button"}
                            mode={"twitter"}
                        />

                        <styled.IconSelectorContainer>
                            {faClassNames.map((currClassName, index) => {
                                currClassName = "fas fa-" + currClassName
                                const selected = currClassName === values.iconClassName
                                // return(
                                //     <i
                                //         style={{
                                //
                                //         }}
                                //         className={currClassName}
                                //         onClick={()=>{
                                //             setFieldValue("iconClassName", currClassName)
                                //         }}
                                //     />
                                // )
                                const schema = REPORT_TYPES.REPORT.schema

                                return(
                                    <styled.WidgetButtonButton
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
                                label={"Save"}
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

    const [addingNew, setAddingNew] = useState(false)

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
                {addingNew ?
                    <NewButtonForm
                        cancel={()=>setAddingNew(false)}
                        dashboard={dashboard}
                    />
                    :
                    <div>
                        <styled.ReportButtonsContainer style={{marginBottom: "1rem"}}>
                            {report_buttons.map((currReportButton, ind) => {

                                const description = currReportButton?.description || ""
                                const iconClassName = currReportButton?.iconClassName || ""
                                const color = currReportButton?.color || "red"

                                const schema = REPORT_TYPES.REPORT.schema

                                return(
                                    <styled.WidgetButtonButton
                                        schema={schema}
                                        style={{
                                            margin: "1rem",
                                        }}
                                    >
                                        {/*<div>{description}</div>*/}
                                        <styled.WidgetButtonIcon selected color={color} className={iconClassName}/>
                                    </styled.WidgetButtonButton>

                                )
                            })}
                        </styled.ReportButtonsContainer>

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
                                onClick={()=>setAddingNew(true)}
                                label={"Add New"}
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
