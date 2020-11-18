import React, { useEffect } from 'react';

// import utils
import { ADD_TASK_ALERT_TYPE } from "../../../../../../constants/dashboard_contants";

// Import styles
import * as style from './task_added_alert.style'

const TaskAddedAlert = (props) => {

    // extract props
    const {
        type,
        visible,
        label,
        message
    } = props


    let alertColor
    switch (type) {
        case ADD_TASK_ALERT_TYPE.TASK_EXISTS:
            alertColor = '#FF4B4B'
            break
        case ADD_TASK_ALERT_TYPE.ADDING:
            alertColor = '#6c6e78'
            break
        case ADD_TASK_ALERT_TYPE.TASK_ADDED:
            alertColor = '#79d99b'
            break

        default:
            alertColor = '#FF4B4Bs'
    }

    if (visible) {
        return <style.AddTaskAlertContainer>
            <style.AddTaskAlertLabel color={alertColor}>{label}</style.AddTaskAlertLabel>
            <style.AddTaskAlertMessage color={alertColor}>{message}</style.AddTaskAlertMessage>
        </style.AddTaskAlertContainer>
    } else {
        return null
    }
}

export default TaskAddedAlert;
