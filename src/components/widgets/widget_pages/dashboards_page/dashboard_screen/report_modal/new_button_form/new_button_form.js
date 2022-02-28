import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {putDashboard} from "../../../../../../../redux/actions/dashboards_actions";
import {FORM_MODES} from "../../../../../../../constants/scheduler_constants";
import {immutableDelete, immutableReplace} from "../../../../../../../methods/utils/array_utils";
import {Formik} from "formik";
import uuid from 'uuid'
import {reportEventSchema} from "../../../../../../../methods/utils/form_schemas";
import * as styled from "../report_modal.style";
import DashboardButton from "../../../dashboard_buttons/dashboard_button/dashboard_button";
import TextField from "../../../../../../basic/form/text_field/text_field";
import Textbox from "../../../../../../basic/textbox/textbox";
import ColorField from "../../../../../../basic/form/color_field/color_field";
import {DASHBOARD_BUTTON_COLORS} from "../../../../../../../constants/dashboard_constants";
import Button from "../../../../../../basic/button/button";
import { useTranslation } from 'react-i18next';

const NewButtonForm = (props) => {

    const { t, i18n } = useTranslation();

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
        const oldReportButtons = dashboard?.report_buttons || []

        // update dashboard by filtering out id of button to be removed
        const updatedDashboard = {
            ...dashboard,
            report_buttons: oldReportButtons.filter((currButton) => {
                return currButton?._id !== reportButtonId
            })
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
                            containerStyle={{ height: '4rem', minHeight: "4rem", width: '80%', alignSelf: "center", marginBottom: "1rem" }}
                            hoverable={false}
                            color={color}
                            disabled={false}
                        />
                        }

                        <div style={{ marginBottom: "1rem" }}>
                            <styled.Label>{t("label")}</styled.Label>
                            {editing &&
                            <TextField
                                name="label"
                                type="text"
                                placeholder={t("label")+"..."}
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
                                <styled.Label>{t("description")}</styled.Label>
                                <TextField
                                    name="description"
                                    type="text"
                                    placeholder={t("description")+"..."}
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
                            <styled.Label>{t("color")}</styled.Label>
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
};

NewButtonForm.propTypes = {

};

export default NewButtonForm;
