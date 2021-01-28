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
        message,
        containerStyle
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

        case ADD_TASK_ALERT_TYPE.FINISH_SUCCESS:
        case ADD_TASK_ALERT_TYPE.KICK_OFF_SUCCESS:
        case ADD_TASK_ALERT_TYPE.REPORT_SEND_SUCCESS:
            alertColor = '#79d99b'
            break

        case ADD_TASK_ALERT_TYPE.FINISH_FAILURE:
        case ADD_TASK_ALERT_TYPE.KICK_OFF_FAILURE:
        case ADD_TASK_ALERT_TYPE.REPORT_SEND_FAILURE:
            alertColor = '#FF4B4B'
            break


        default:
            alertColor = '#FF4B4Bs'
    }

    if (visible) {
        return <style.AddTaskAlertContainer style={containerStyle}>
            <style.AddTaskAlertLabel color={alertColor}>{label}</style.AddTaskAlertLabel>
            <style.AddTaskAlertMessage color={alertColor}>{message}</style.AddTaskAlertMessage>
        </style.AddTaskAlertContainer>
    } else {
        return null
    }
}

export default TaskAddedAlert;
