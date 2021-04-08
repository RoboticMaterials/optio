import React, { Component, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

// Import Utils
import { handleAvailableTasks } from '../../../../../../methods/utils/dashboards_utils'
import { randomHash, deepCopy } from '../../../../../../methods/utils/utils'

// Import Actions
import { putDashboard } from '../../../../../../redux/actions/dashboards_actions'


// Import Basic Components
import DropDownSearch from '../../../../../basic/drop_down_search_v2/drop_down_search'

// Import Styles
import * as style from './dashboard_add_task.style'


const DashboardAddTask = (props) => {

    const dashboardId = useSelector(state => state.dashboardReducer.dashboardIDClicked)
    const dashboards = useSelector(state => state.dashboardReducer.dashboards)
    const availTasks = useSelector(state => state.tasksReducer.parsedTasks)
    const currentDashboard = useSelector(state => state.dashboardReducer.currentDashboard)

    const dispatch = useDispatch()
    const onTaskAdd = (dashbboard, ID) => dispatch(putDashboard(dashbboard, ID))
    const onDashboardIdClicked = (Id) => dispatch({ type: 'POST_ID_DASHBOARD', ID: Id })
    const onSelectedDashboard = (value) => dispatch({ type: 'CURRENT_DASHBOARD', payload: value })

    const [postCondText, setPostCondText] = useState('')
    const [availableTasksList, setAvailableTasksList] = useState([])
    const [postConditions, setPostConditions] = useState(null)


    // Calls in tasks built in the Task Builder
    const handleAvailableTasks = () => {

        let availableTasks = handleAvailableTasks(this.props.availTasks)

        return (
            <DropDownSearch
                options={availableTasks}
                valueField={"Description"}
                label={'Task to be executed when button is pressed'}
                placeholder={'Add Buttons'}
                onChange={(values) => { this.handleAddTask(values) }}
                className='w-100'
                searchBy={'Description'}
                noDataLabel={"No matches found"}
                labelField={'Description'}
                closeOnSelect={true}
                dropdownGap={2}
                backspaceDelete={true}
                key={2}
                fillable={false}
            />
        )
    }

    const handleAddTask = async (props) => {
        // new task dictionary
        let newTask = {
            "id": "",
            "name": "",
            "color": "#BCBCBC",
            "taskId": "",
            "task_name": "",
        }

        // Populate ID with current information
        newTask.name = props[0].Description
        newTask.taskId = props[0].taskId
        newTask.task_name = props[0].Description

        let currentDashboard = deepCopy(currentDashboard)

        const id = randomHash()
        newTask.id = id
        currentDashboard.buttons.push(newTask)

        onSelectedDashboard(currentDashboard)
    }


    return (
        <>
            <style.AddTaskDropdownContainer className='container'>
                <style.DropdownButtonContainer style={{ width: '40rem' }}>
                    {handleAvailableTasks()}
                </style.DropdownButtonContainer>
            </style.AddTaskDropdownContainer>
        </>
    )


}

export default DashboardAddTask;
