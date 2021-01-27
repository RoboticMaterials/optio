// import external dependencies
import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'

// import external components
import FadeLoader from "react-spinners/FadeLoader"

// external functions
import { Formik } from 'formik'
import { ThemeContext } from "styled-components"
import { useDispatch, useSelector } from "react-redux"
import moment from 'moment'

// import components
import ContentHeader from '../../content_header/content_header'
import ButtonGroupField from '../../../../basic/form/button_group_field/button_group_field'
import TextField from '../../../../basic/form/text_field/text_field.js'
import SwitchField from '../../../../basic/form/switch_field/switch_field.js'
import DropDownSearchField from '../../../../basic/form/drop_down_search_field/drop_down_search_field.js'
import Button from '../../../../basic/button/button'
import BackButton from "../../../../basic/back_button/back_button"
import Textbox from "../../../../basic/textbox/textbox";

// import utils
import * as helpers from './create_schedule_form.helpers'
import { daysOfTheWeek } from '../../../../../constants/scheduler_constants'
import { FORM_MODES } from '../../../../../constants/scheduler_constants'
import { scheduleSchema } from '../../../../../methods/utils/form_schemas'
import { timeString24HrToDate } from "../../../../../methods/utils/utils"
import { getScheduleItemTemplate } from "../../../../../methods/utils/schedules_utils"
import { getMinutesFromMoment } from "../../../../../methods/utils/time_utils"

// actions
import { postSchedule, putSchedule } from "../../../../../redux/actions/schedule_actions"
import { getTasks } from "../../../../../redux/actions/tasks_actions";

// import styles
import * as styled from './create_schedule_form.style'
import * as pageStyle from '../scheduler_content.style'
import * as ButtonGroupComponents from './button_group.style'

// logger
import log from '../../../../../logger'

const logger = log.getLogger("CreateScheduleForm", "Scheduler")
logger.setLevel("silent")

const widthBreakPoint = 525

const CreateScheduleForm = (props) => {

    const {
        onDeleteClick,
        hideScheduleCreator,
        selectedScheduleId,
        setSelectedScheduleId,
        schedules,
        tasks,
    } = props

    const dispatch = useDispatch()

    const width = useSelector(state => state.sidebarReducer.width)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const isSmall = width < widthBreakPoint

    const tasksArr = Object.values(tasks).filter((task) => task.map_id === currentMap._id) // get copy of tasks as arr here instead of calling Object.values() multiple times

    const themeContext = useContext(ThemeContext)

    /*
    * submission logic for form
    *
    * extracts form values into a new object that will be send as either a POST or PUT request depending on whether a new item is being created, or an existing item modified
    *
    * expected fields
    *   start_time: Moment
    *   time_interval: Moment
    *   stop_time: Moment
    *   days_on: array - [1,2,3]
    *   name: string - "this is a name"
    *   task: array of objects - [{}]
    *   interval_on: bool - false
    * */
    const handleSubmit = async (values, formMode) => {

        // convert days_on from array of indices to object with the days as keys and values as either true or false
        const days_on = {}
        Object.values(daysOfTheWeek).forEach((day, ind, arr) => {
            days_on[day] = values.days_on.includes(ind)
        })

        const {
            task,
            name,
            schedule_on,
            start_time,
            interval_on,
            time_interval,
            stop_time,
            map_id,
            next_time
        } = values

        // eextract properties into new object for submission
        const submitItem = {
            task_id: task[0]?._id,
            days_on,
            name: name,
            schedule_on: schedule_on,
            start_time: start_time.format("HH:mm:ss"),
            interval_on: interval_on,
            time_interval: time_interval.format("HH:mm:ss"),
            stop_time: stop_time.format("HH:mm:ss"),
            next_time: next_time,
            map_id: map_id,
        }

        // update existing object - PUT request
        if (formMode === FORM_MODES.UPDATE) {
            // dispatch update action
            dispatch(putSchedule(selectedScheduleId, submitItem))

            // create new object - POST request
        } else if (formMode === FORM_MODES.CREATE) {
            // dispatch post action
            const createdSchedule = await dispatch(postSchedule(submitItem))
            setSelectedScheduleId(createdSchedule?._id?.$oid) // set selected schedule id, which will update the form mode from create to update
        }

        // close form optionally
        hideScheduleCreator()
    }

    /*
    * returns the initial values for the form
    *
    * initial values are found by finding the schedule from redux with the id matching selectedScheduleId passed via props
    * If selectedScheduleId is null, or no matching schedule is found, a template for creating a new schedule is returned instead
    * */
    const getInitialValues = () => {

        // Gets the selected schedule for the list of schedules
        let selectedScheduleItem = schedules[selectedScheduleId]
        logger.log("getInitialValues selectedScheduleItem", selectedScheduleItem)
        logger.log("getInitialValues selectedScheduleId", selectedScheduleId)

        // get initial values from schedule
        if (selectedScheduleItem) {

            // convert days_on from object to array of indices (required for button group)
            const days_on = []
            if (selectedScheduleItem) {
                Object.values(daysOfTheWeek).forEach((val, ind) => {
                    if (selectedScheduleItem.days_on[val]) days_on.push(ind)
                })
            }

            // default time value for time fields that don't exist
            const nowDate = new Date()
            const nowTimeString = moment(timeString24HrToDate(nowDate))

            // create new object with required properties
            const initialValues = {
                days_on: days_on,
                start_time: selectedScheduleItem.start_time ? moment(timeString24HrToDate(selectedScheduleItem.start_time)) : nowTimeString,
                schedule_on: selectedScheduleItem.schedule_on,
                time_interval: selectedScheduleItem.time_interval ? moment(timeString24HrToDate(selectedScheduleItem.time_interval)) : nowTimeString,
                interval_on: selectedScheduleItem.interval_on,
                next_time: selectedScheduleItem.next_time,
                map_id: currentMap._id,
                stop_time: selectedScheduleItem.stop_time ? moment(timeString24HrToDate(selectedScheduleItem.stop_time)) : nowTimeString,
                name: selectedScheduleItem.name ? selectedScheduleItem.name : '',
                selectedScheduleId: selectedScheduleItem.id,
                task: (selectedScheduleItem.task_id && tasks[selectedScheduleItem.task_id]) ?
                    [tasks[selectedScheduleItem.task_id]]
                    :
                    // if task id equals TASK DELETED, the corresponding task has been deleted,
                    // set task property to reflect this
                    selectedScheduleItem.task_id == 'TASK DELETED' ?
                        [{
                            _id:
                                "TASK DELETED"
                            ,
                            name: 'TASK DELETED'
                        }]
                        :
                        // NO task, and task id isn't deleted, set set to default value that will prevent the dropdownsearch from throwing an error
                        [{
                            _id:
                                "TEMP_NEW_SCHEDULE_ID"
                            ,
                            name: ''
                        }],
            }

            return initialValues

            // no schedule was found, return template
        } else {
            let newScheduleTemplate = getScheduleItemTemplate()
            newScheduleTemplate.map_id = currentMap._id
            return newScheduleTemplate
        }
    }

    /*
    * performs additional validation not covered by the schema
    * some validation is easier to perform this way rather than in the schema
    * */
    const validate = async (values, initialValues) => {
        logger.log('handleValidate: values:', values)

        // validate gets called every time form changes
        // so this can be used to handle any desired on change function
        // handleFormChange(values, initialValues)

        // initialize empty error object
        var errors = {}

        // stop time  must be greater than start time:
        {
            const { start_time, stop_time, interval_on } = values

            if (interval_on) {
                const startMin = getMinutesFromMoment(start_time)
                const stopMin = getMinutesFromMoment(stop_time)

                if (startMin >= stopMin) {
                    errors.stop_time = "Stop time must be greater than start time."
                }
            }
        }

        // return error object
        return errors
    }

    /*
    * use to implement any desired on change logic
    * not currently used, but left so it can be easily implemented if desired
    * */
    const handleFormChange = (values, initialValues) => {
        // not currently used, but can add logic here for any time a form value changes
    }

    const initialValues = getInitialValues() // get initial values
    const formMode = selectedScheduleId ? FORM_MODES.UPDATE : FORM_MODES.CREATE // if a schedule id was passed, form is being used to edit an existing item, otherwise a new item is being created

    return (
        <Formik
            initialValues={initialValues}

            // validation control
            validationSchema={scheduleSchema}
            validateOnChange={true}
            validate={(values) => validate(values, initialValues)}
            validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
            validateOnBlur={true}

            enableReinitialize={false} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
            onSubmit={async (values, { setSubmitting, setTouched }) => {
                // set submitting to true, handle submit, then set submitting to false
                // the submitting property is useful for eg. displaying a loading indicator
                setSubmitting(true)
                await handleSubmit(values, formMode)
                setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
                setSubmitting(false)
            }}
        >
            {formikProps => {

                // extract common properties from formik
                const { errors, values, touched, isSubmitting } = formikProps

                // use this instead of validateOnMount
                // validateOnMount will cause an error when new data is fetched
                // eg. when the tasks dropdown is opened, it fetches tasks from the backend, this trigger a remount, which will then create an undesired form error
                // if( (formMode === FORM_MODES.UPDATE) && (submitCount === 0) ) submitForm()

                // get number of field errors
                const errorCount = Object.keys(errors).length > 0

                // get number of touched fields
                const touchedReducer = (accumulator, currentValue) => (currentValue === true) ? accumulator + 1 : accumulator
                const touchedCount = Object.values(touched).reduce(touchedReducer, 0)

                // submit disabled if:
                //      form contains any errors
                //      no fields have been touched
                //      form is currently submitting
                const submitDisabled = (errorCount > 0) || (touchedCount === 0) || isSubmitting

                return (
                    (
                        <styled.StyledForm>
                            <ContentHeader
                                content={'scheduler'}
                                mode={'create'}
                                onClickBack={hideScheduleCreator}
                                onClickSave={() => formikProps.submitForm()}
                                disabled={submitDisabled}
                            // Need to figure out how to submit formik using this method. No internet atm so this'll have to wait

                            />

                            <styled.ContentContainer>
                                <FadeLoader
                                    css={styled.FadeLoaderCSS}
                                    height={5}
                                    width={3}
                                    loading={isSubmitting}
                                />

                                <styled.FieldLabel>{'Schedule Name'}</styled.FieldLabel>
                                <styled.InputContainer className="form-group">
                                    <TextField
                                        name="name"
                                        type="text"
                                        placeholder="Schedule Name"
                                        InputComponent={Textbox}
                                    />
                                </styled.InputContainer>

                                <styled.SelectContainer>
                                    <DropDownSearchField
                                        pattern={null}
                                        name="task"
                                        options={tasksArr
                                            // Filters outs any tasks that don't belong to the current map
                                            .filter(task => task.map_id === currentMap._id)
                                        }
                                        // valueField={tasksArr.length > 0 ? "_id.$oid" : 'id'}
                                        valueField={tasksArr.length > 0 ? "_id" : 'id'}
                                        label={'Choose Task'}
                                        onDropdownOpen={() => {
                                            dispatch(getTasks())
                                        }}
                                        labelField={'name'}
                                    />
                                </styled.SelectContainer>

                                <styled.FieldLabel>Schedule</styled.FieldLabel>
                                <styled.ButtonGroupContainer>
                                    <ButtonGroupField
                                        name="days_on"
                                        buttons={Object.values(daysOfTheWeek)}
                                        selectMultiple
                                        Container={ButtonGroupComponents.Container}
                                        ButtonView={ButtonGroupComponents.ButtonView}
                                        Button={ButtonGroupComponents.Button}
                                        buttonViewCss={ButtonGroupComponents.buttonViewCss}
                                    />
                                </styled.ButtonGroupContainer>

                                <styled.RowContainer style={{ marginBottom: '2.5rem' }}>
                                    <styled.ToggleTextLeft>{'Interval Off'}</styled.ToggleTextLeft>
                                    <SwitchField
                                        name="interval_on"
                                        onColor={themeContext.schema.scheduler.solid}
                                        LabelComponent={styled.SwitchLabel}
                                    />
                                    <styled.ToggleTextRight>{'Interval On'}</styled.ToggleTextRight>
                                </styled.RowContainer>

                                <styled.RowContainer>
                                    {/*
                                        <styled.DatePickerLabel>Start Time</styled.DatePickerLabel>
                                    */}

                                    <styled.TimePickerContainer>
                                        <styled.StyledTimePickerField
                                            LabelComponent={styled.DatePickerLabel}
                                            label="Start Time"
                                            name="start_time"
                                            use12Hours
                                            format={'h:mm a'}
                                            ErrorComponent={styled.TimePickerErrorComponent}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            spellCheck="off"
                                        />
                                        {/*<SwitchField
                                          name="scheduleOn"
                                          LabelComponent={styled.ButtonGroupLabel}
                                        />*/}
                                    </styled.TimePickerContainer>
                                </styled.RowContainer>

                                <styled.RowContainer>
                                    {/*
                                        <styled.DatePickerLabel>Time Interval</styled.DatePickerLabel>
                                    */}

                                    <styled.TimePickerContainer>
                                        <styled.StyledTimePickerField
                                            LabelComponent={styled.DatePickerLabel}
                                            label="Time Interval"
                                            name="time_interval"
                                            // disabledHours={helpers.disabledHours}
                                            disabledMinutes={helpers.disabledMinutes}
                                            ErrorComponent={styled.TimePickerErrorComponent}
                                            use12Hours={false}
                                            disabled={!values.interval_on}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            spellCheck="off"
                                        // format = {'h:mm'}
                                        />
                                    </styled.TimePickerContainer>
                                </styled.RowContainer>

                                <styled.RowContainer>
                                    {/*
                                        <styled.DatePickerLabel>Stop Time</styled.DatePickerLabel>
                                    */}

                                    <styled.TimePickerContainer>
                                        <styled.StyledTimePickerField
                                            LabelComponent={styled.DatePickerLabel}
                                            label="Stop Time"
                                            name="stop_time"
                                            ErrorComponent={styled.TimePickerErrorComponent}
                                            use12Hours
                                            format={'h:mm a'}
                                            disabled={!values.interval_on}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            spellCheck="off"
                                        />
                                    </styled.TimePickerContainer>
                                </styled.RowContainer>


                                <styled.FormButtonsContainer>

                                    {/* delete button only makes sense for a schedule that has been created */}
                                    {/* {formMode === FORM_MODES.UPDATE && */}
                                    <Button schema={'scheduler'} secondary style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '10rem', marginTop: '2rem' }}
                                        onClick={() => {
                                            onDeleteClick()
                                        }}
                                        type={"button"}
                                    >
                                        Delete
                                    </Button>
                                    {/* } */}

                                </styled.FormButtonsContainer>
                            </styled.ContentContainer>
                        </styled.StyledForm>
                    )
                )
            }}
        </Formik>
    )
}

CreateScheduleForm.propTypes = {
    onDeleteClick: PropTypes.func,
    hideScheduleCreator: PropTypes.func,
    selectedScheduleId: PropTypes.string,
    setSelectedScheduleId: PropTypes.func,
}

CreateScheduleForm.defaultProps = {
    onDeleteClick: () => { },
    hideScheduleCreator: () => { },
    selectedScheduleId: "",
    setSelectedScheduleId: () => { },
}

export default CreateScheduleForm
