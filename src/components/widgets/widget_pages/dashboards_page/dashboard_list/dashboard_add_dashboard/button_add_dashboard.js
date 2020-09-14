import React, { Component } from 'react';
import {connect} from 'react-redux'

// Import Styles
import * as style from './button_add_dashboard.style'

// Import Actions
import { postDashboards, getDashboards } from '../../../../../../redux/actions/dashboards_actions'

// Import Utils
import { postToDashboards } from '../../../../../../methods/utils/dashboards_utils'
import { randomHash } from '../../../../../../methods/utils/utils'

class ButtonAddDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    //Adds the item to the back end when button pressed
    handleAddNewDashboardClicked = async () => {

        // Sets to true so that the Name will be in focus on task page load
        // this.props.onAddingDashboard(true)

        // This will put the task screen into edit mode
        // this.props.onDashboardTasksEdit(true)

        // Define the dashboard variables
        let dashboardName = randomHash()

        //Build the dashboard structure
        let newDashboardToAdd = postToDashboards(dashboardName)

        this.props.onSelectedDashboard(newDashboardToAdd)

        // Send the new dashboard to the API
        await this.props.onDashboardAdd(newDashboardToAdd)

        await this.props.onDashboardGet()


    }

    render() {
        return(
            <>
                <style.InternalContainer className='col-xl-3 col-lg-4 col-md-6'>
                    <style.AddDashboardButton onClick={() => this.props.initializeNewDashboard()}>
                        <style.AddDashboardButtonText>Add New Dashboard</style.AddDashboardButtonText>
                        <style.PlusButton className='far fa-plus-square'></style.PlusButton>
                    </style.AddDashboardButton>
                </style.InternalContainer>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        dashboardReducer: state.dashboardReducer,
        dashboards: state.dashboardReducer.dashboards
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onAddButtons: (currentDashboardInfo) => dispatch({type: 'BUTTONS', currentDashboard:currentDashboardInfo}),
        onDashboardAdd: (newDashboard) => dispatch(postDashboards(newDashboard)),
        onDashboardGet: () => dispatch(getDashboards()),
        onAddingDashboard: (value) => dispatch({type: 'ADDING_DASHBOARD', payload: value}),
        onDashboardIdClicked: (Id) => dispatch({type: 'POST_ID_DASHBOARD', ID: Id}),
        onDashboardTasksEdit: (value) => dispatch({type: 'EDITING_TASKS', payload: value}),
        onSelectedDashboard: (value) => dispatch({type: 'CURRENT_DASHBOARD', payload: value})

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonAddDashboard);
