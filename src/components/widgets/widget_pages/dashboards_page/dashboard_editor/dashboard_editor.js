import React, { useEffect, useState } from 'react';

// import external functions
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import { Formik } from "formik";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { createSelector } from 'reselect'
import { isEmpty } from "ramda"

import { SortableContainer } from 'react-sortable-hoc';
import arrayMove from 'array-move';

// Import components
import DashboardAddTask from './dashboard_add_task/dashboard_add_task'
import DashboardRenderer from "./dashboard_editor_button_renderer/dashboard_editor_button_renderer";
import DashboardsHeader from "../dashboards_header/dashboards_header";

// Import basic components
import SmallButton from '../../../../basic/small_button/small_button'
import TextField from "../../../../basic/form/text_field/text_field";
import Textbox from '../../../../basic/textbox/textbox'
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'

// Import Utils
import { deepCopy } from '../../../../../methods/utils/utils'
import { handleAvailableTasks, handleCurrentDashboard } from '../../../../../methods/utils/dashboards_utils'
import { randomHash } from "../../../../../methods/utils/utils";

// Import Actions
import { putDashboard, deleteDashboard, postDashboard } from '../../../../../redux/actions/dashboards_actions'
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import { putStation } from '../../../../../redux/actions/stations_actions'
import { pageDataChanged } from "../../../../../redux/actions/sidebar_actions";

import { dashboardSchema } from "../../../../../methods/utils/form_schemas";

// Import styles
import * as style from './dashboard_editor.style'
import * as pageStyle from '../dashboards_page.style'

// Import logger
import log from '../../../../../logger.js';
import DashboardAddButton from "./dashboard_add_button/dashboard_add_button";
import { useChange } from "../../../../basic/form/useChange";
import { PAGES } from "../../../../../constants/dashboard_contants";
import DashboardsSidebar, { TYPES } from "../dashboards_sidebar/dashboards_sidebar";

const logger = log.getLogger("Dashboards", "EditDashboard");

const DashboardEditor = (props) => {
    let {
        dashboard,
        showSidebar,
    } = props
    const history = useHistory()
    const dispatch = useDispatch()
    const params = useParams()


    const onDeleteDashboard = async (ID) => await dispatch(deleteDashboard(ID))
    const onPutStation = async (station, ID) => await dispatch(putStation(station, ID))
    const onPutDashboard = (dashboard, id) => dispatch(putDashboard(dashboard, id))
    const onPostDashboard = (dashboard) => dispatch(postDashboard(dashboard))
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))

    const stations = useSelector(state => state.stationsReducer.stations)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)

    const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth < 2000 ? 400 : 700)
    const [confirmExitModal, setConfirmExitModal] = useState(false);


    useEffect(() => {
        return () => {
          dispatchPageDataChanged(false)
        }
    }, [])
   /*
    * Returns initialValues object for Formik
    */
    const getInitialValues = () => {
        let initialValues = {
            name: "",
            locked: false,
            buttons: []

        }
        let taskIds = []

        try {
            const buttons = dashboard.buttons   // get buttons

            let initialButtons = [];
            buttons
                .filter((currButton) => {
                    const {
                        task_id,
                        type
                    } = currButton

                    if (task_id && taskIds.includes(task_id) && task_id !== 'custom_task') {
                        logger.error(`Button with duplicate task_id found in dashboard. {task_id:${task_id}`)
                        return false // don't add duplicate tasks
                    }

                    taskIds.push(task_id)
                    return true
                })
                .map((value, index) => {
                    initialButtons.push(value)
                })

            initialValues = {
                name: dashboard.name,
                locked: dashboard.locked,
                buttons: initialButtons
            }
        } catch (e) {

        }

        return initialValues
    }

    /*
    * Returns initialErrors object for Formik
    */
    const getInitialErrors = () => {
        let initialErrors = {} // initialize error object to empty

        // check name
        if (!dashboard.name) initialErrors.name = "Please enter a name."

        // check button errors
        let buttonErrors = [] // stores button errors
        try { // try / catch in case dashboard is null or doesn't have buttons
            const buttons = dashboard.buttons // get buttons

            for (const button of buttons) {
                let buttonError = {} // errors for current button - initialize to empty
                if (!button.name) buttonError.name = "Please enter name." // button must have name
                if (!isEmpty(buttonError)) buttonErrors.push(buttonError) // only add the error if it isn't empty
            }
        }
        catch (e) { }
        if (buttonErrors.length > 0) initialErrors.buttons = buttonErrors // only add to error object if errors were found


        return initialErrors
    }

    /* handles for submission, updates redux and api
    * requirements
    *   name can't be empty
    *   dashboard names must be unique
    *   button names can't be empty
    * */
    const handleSubmit = async (values) => {
        // destructure values
        const { name, locked, buttons } = values
        // clone dashboard
        const dashboardCopy = deepCopy(dashboard)

        // save id then delete (api doesn't want id in object)
        // get dashboard id
        let dashboardId = null

        // use try catch block to prevent error in the case that a dashboard doesn't have _id key
        try {
            dashboardId = dashboardCopy._id.$oid
            delete dashboardCopy._id
        }
        catch (e) { }

        // update dashboard objects properties with submit values
        dashboardCopy.buttons = buttons
        dashboardCopy.locked = locked
        dashboardCopy.name = name

        // if dashboard has id, it must already exist, so update with put
        if (dashboardId) {
            // update
            onPutDashboard(dashboardCopy, dashboardId)
        }
        // otherwise, dashboard is new, so create with post
        else {
            // create
            onPostDashboard(dashboardCopy)
        }

    }

    return (
        <Formik
            initialValues={getInitialValues()}
            initialTouched={{
                name: false,
                locked: false,
                buttons: [false]
            }}
            initialErrors={getInitialErrors()}
            enableReinitialize={false}
            validateOnChange={true}
            validateOnMount={true}
            validateOnBlur={true}
            validationSchema={dashboardSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);    // set submitting to true on start
                await handleSubmit(values)        // perform submission logic
                setSubmitting(false);   // set submitting to false after completion
            }}
        >
            {(formikProps) => {
                const { errors, values, touched, initialValues } = formikProps; // extract formik props

                if(JSON.stringify(initialValues)!==JSON.stringify(values)){
                  dispatchPageDataChanged(true)
                }
                else{
                  dispatchPageDataChanged(false)
                  console.log('false')
                }                // disabled submission if there are any errors or not all fields have been touched
                const allTouched = Object.values(touched).every((val) => val === true)
                const submitDisabled = !(Object.values(errors).length === 0)


                // adds a button to buttons key in Formik values
                const handleDrop = (dropResult) => {
                    const { removedIndex, addedIndex, payload, element } = dropResult;
                    const buttonsCopy = (values.buttons)

                    if (payload === null) { //  No new button, only reorder
                        const shiftedButtonsCopy = arrayMove(buttonsCopy, removedIndex, addedIndex)
                        formikProps.setFieldValue("buttons", shiftedButtonsCopy)
                    } else { // New button
                        if (addedIndex !== null) {
                            // payload.id = randomHash()
                            buttonsCopy.splice(addedIndex, 0, payload)
                            formikProps.setFieldValue("buttons", buttonsCopy)
                        }

                    }

                }

                const handleChangeButton = (id, attr) => {
                    const buttonsCopy = (values.buttons)
                    const buttonIndex = buttonsCopy.findIndex(b => b.id == id)

                    Object.assign(buttonsCopy[buttonIndex], attr)
                    formikProps.setFieldValue("buttons", buttonsCopy)
                }

                const handleDeleteButton = (id) => {
                    const buttonsCopy = (values.buttons)
                    const buttonIndex = buttonsCopy.findIndex(b => b.id == id)

                    buttonsCopy.splice(buttonIndex, 1)
                    formikProps.setFieldValue("buttons", buttonsCopy)
                }

                const handleDeleteDashboard = async () => {

                    const stationCopy = deepCopy(stations[params.stationID])

                    const deleteDashboardIndex = stationCopy.dashboards.indexOf(params.dashboardID)

                    stationCopy.dashboards.splice(deleteDashboardIndex, 1)

                    history.push(`/locations/${params.stationID}/dashboards`)
                    await onPutStation(stationCopy, stationCopy._id)
                    await onDeleteDashboard(params.dashboardID)

                }

                const {
                    buttons: dashboardButtons,
                    name: dashboardName,
                    locked: dashboardLocked,
                    station: dashboardStationId,
                    device: dashboardDeviceId,
                    _id: dashboardIdObject
                } = dashboard || {}

                const {
                    $oid: dashboardId
                } = dashboardIdObject || {}


                return (
                    <style.Container>

                        <ConfirmDeleteModal
                            isOpen={!!confirmExitModal}
                            title={"Are you sure you want to Leave this page? Any progress will not be saved"}
                            button_1_text={"Yes"}
                            handleOnClick1={() => {
                              history.push(`/locations/${params.stationID}/dashboards/${params.dashboardID}/`)
                              setConfirmExitModal(null)

                            }}
                            button_2_text={"No"}
                            handleOnClick2={() => {
                              setConfirmExitModal(null)
                            }}
                            handleClose={() => setConfirmExitModal(null)}
                        />

                        <DashboardsSidebar
                            existingButtons={values.buttons || []}
                            dashboardId={dashboardId}
                            stationID={dashboardStationId ? dashboardStationId : dashboardDeviceId}
                            width={sidebarWidth}
                            setWidth={setSidebarWidth}
                            minWidth={300}
                            clickable={true}
                        />
                    <style.StyledForm>

                        <DashboardsHeader
                            showTitle={false}
                            showSidebar={showSidebar}
                            showBackButton={true}
                            showSaveButton={true}
                            page={PAGES.EDITING}
                            onDelete={() => {
                                handleDeleteDashboard()
                            }}
                            onLockClick={() => {
                              formikProps.setFieldValue("locked", !values.locked)
                            }}
                            locked = {values.locked}
                            saveDisabled={submitDisabled}
                            onBack={() => !!pageInfoChanged ? setConfirmExitModal(true) : history.push(`/locations/${params.stationID}/dashboards/${params.dashboardID}/`)}
                        >
                            <TextField
                                name={"name"}
                                disabled={dashboard.name === 'Robot Screen'}
                                textStyle={{ fontWeight: 'Bold' }}
                                placeholder='Enter Dashboard Name'
                                type='text'
                                InputComponent={Textbox}
                                inputProps={{
                                    style: {
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        padding: '0 2rem 0 4rem',
                                        marginTop: '0'
                                    }
                                }}
                            />


                        </DashboardsHeader>
                        <style.BodyContainer>
                            <DashboardRenderer
                                buttons={values.buttons}
                                onDrop={handleDrop}

                                handleChangeButton={handleChangeButton}
                                handleDeleteButton={handleDeleteButton}
                            />
                        </style.BodyContainer>
                    </style.StyledForm>
                    </style.Container>

                )
            }
            }
        </Formik>


    )
}
export default DashboardEditor;
