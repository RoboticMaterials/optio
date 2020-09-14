import React, { useEffect } from 'react';
import { Draggable } from 'react-smooth-dnd';

import DashboardButton from "../../dashboard_button/dashboard_button";

import * as style from "./dashboard_sidebar_button.style"

import log from '../../../../../../logger'
import { randomHash } from "../../../../../../methods/utils/utils";

const logger = log.getLogger("Dashboards")

const DashboardSidebarButton = (props) => {
    const { name, color, id, task_id, clickable, onTaskClick, disabled  } = props;


    logger.log("DashboardSidebarButton: name: ", name)
    logger.log("DashboardSidebarButton: props: ", props)

    if (!clickable) {
        return(
            <Draggable key={id}>
                <style.Container>
                        <DashboardButton
                            title={name}
                            width={"80%"}
                            clickable={clickable}
                            color={color}
                            onClick={() => onTaskClick(task_id, name)}
                            disabled={disabled}
                        />
                </style.Container>
            </Draggable>
        )
    } else {
        return(
            <style.Container>
                    <DashboardButton
                        title={name}
                        width={"80%"}
                        clickable={clickable}
                        color={color}
                        onClick={() => onTaskClick(task_id, name)}
                        disabled={disabled}
                    />
            </style.Container>
        )
    }
    
}

export default DashboardSidebarButton