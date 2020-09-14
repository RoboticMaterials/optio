import React, { Component } from 'react';
import {connect} from 'react-redux';

// Import Utils
import { handleAvailableTasks } from '../../../../../../methods/utils/dashboards_utils'
import { randomHash, deepCopy } from '../../../../../../methods/utils/utils'

// Import Actions
import { putDashboard } from '../../../../../../redux/actions/dashboards_actions'


// Import Basic Components
import DropDownSearch from '../../../../../basic/drop_down_search_v2/drop_down_search'

// Import Styles
import * as style from './dashboard_add_task.style'

class DashboardAddTask extends Component {

    constructor(props) {
        super(props);

        this.state = {
            postCondText: '',
            availableTasksList: [],

            postConditions: null,

        }
        this.componentDidMount = this.componentDidMount.bind(this)

    }

    // On page load, the dashboard clicked will load
    componentDidMount = async() => {
    }


    // Calls in tasks built in the Task Builder
    handleAvailableTasks = () => {

        let availableTasks = handleAvailableTasks(this.props.availTasks)

        return(
            <DropDownSearch
                options={availableTasks}
                valueField={"Description"}
                label={'Task to be executed when button is pressed'}
                placeholder = {'Add Buttons'}
                onChange = {(values) => {this.handleAddTask(values)}}
                className='w-100'
                searchBy = {'Description'}
                noDataLabel = {"No matches found"}
                labelField = {'Description'}
                closeOnSelect = {true}
                dropdownGap = {5}
                backspaceDelete = {true}
                key = {2}
                fillable={false}
            />
        )
    }

    handleAddTask = async (props) => {
        // new task dictionary
        let newTask =      {
            "_id": "",
            "name": "",
            "color": "#BCBCBC",
            "task_id": "",
            "task_name": "",
        }

        // Populate ID with current information
        newTask.name = props[0].Description
        newTask.task_id = props[0].task_id
        newTask.task_name = props[0].Description

        let currentDashboard = deepCopy(this.props.currentDashboard)
       
        const id = randomHash()
        newTask._id = id
        currentDashboard.buttons.push(newTask)

        this.props.onSelectedDashboard(currentDashboard)
    }


    render() {
        return(
            <>
                <style.AddTaskDropdownContainer className='container'>
                    <style.DropdownButtonContainer style={{width: '40rem'}}>
                        {this.handleAvailableTasks()}
                    </style.DropdownButtonContainer>
                </style.AddTaskDropdownContainer>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        dashboardId: state.dashboardReducer.dashboardIDClicked,
        dashboards: state.dashboardReducer.dashboards,
        // availConditions: state.conditionsReducer.conditions,
        availTasks: state.tasksReducer.parsedTasks,
        currentDashboard: state.dashboardReducer.currentDashboard,

    };
}

const mapDispatchToProps = dispatch => {
    return {
        onTaskAdd: (dashbboard, ID) => dispatch(putDashboard(dashbboard, ID)),
        onDashboardIdClicked: (Id) => dispatch({type: 'POST_ID_DASHBOARD', ID: Id}),
        onSelectedDashboard: (value) => dispatch({type: 'CURRENT_DASHBOARD', payload: value})

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardAddTask);
