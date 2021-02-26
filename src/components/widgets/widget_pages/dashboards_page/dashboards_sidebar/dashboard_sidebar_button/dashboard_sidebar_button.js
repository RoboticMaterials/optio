import React, {useEffect, useState} from 'react';
import { Draggable } from 'react-smooth-dnd';

// external functions
import uuid from 'uuid'

// external components
import ReactTooltip from "react-tooltip";

// internal components
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// styles
import * as style from "./dashboard_sidebar_button.style"

// logging
import log from '../../../../../../logger'
const logger = log.getLogger("Dashboards")

const DashboardSidebarButton = (props) => {
    const {
        name,
        color,
        id,
        task_id,
        clickable,
        dragDisabled,
        onTaskClick,
        disabled
    } = props;

    const [toolTipId, ] = useState(`tooltip-${uuid.v4()}`)

    if (!dragDisabled) {
        return(
            <Draggable
                key={id}
            >
                <style.Container>
                        <DashboardButton
                            title={name}
                            width={"80%"}
                            clickable={clickable}
                            color={color}
                            onClick={() => onTaskClick(task_id)}
                            disabled={disabled}
                        />
                </style.Container>
            </Draggable>
        )
    } else {
        return(
            <style.Container
                key={id}
                data-tip
                data-for={toolTipId}
            >
                <DashboardButton
                    title={name}
                    width={"80%"}
                    clickable={clickable}
                    color={color}
                    onClick={() => onTaskClick(task_id, name)}
                    disabled={disabled}
                />

                    <ReactTooltip eventOff={'mouseout'} id={toolTipId}>
                        <span>This button has already been added to the dashboard.</span>
                    </ReactTooltip>
            </style.Container>
        )
    }
}

export default DashboardSidebarButton