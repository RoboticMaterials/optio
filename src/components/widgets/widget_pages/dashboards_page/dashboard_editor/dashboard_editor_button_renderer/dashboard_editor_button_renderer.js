import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'

import { SortableContainer } from "react-sortable-hoc";
import DashboardEditTasksField from "../button_fields/dashboard_route_field/dashboard_route_field";

import ReactList from 'react-list';

import * as style from "./dashboard_editor_button_renderer.style"
import { Container, Draggable } from 'react-smooth-dnd';

import log from "../../../../../../logger"
import {OPERATION_TYPES, TYPES} from "../../dashboards_sidebar/dashboards_sidebar";
import DashboardReportField from "../button_fields/dashboard_report_field/dashboard_report_field";

const logger = log.getLogger("Dashboards")

const DashboardEditorButtonRenderer = SortableContainer((props) => {

    const tasks = useSelector(state => state.tasksReducer.tasks)

    const {
        buttons,
        onDrop,
    } = props

    return (
        <Container
            onDrop={onDrop}
            groupName="dashboard-buttons"
            getChildPayload={() => null}
            style={{ width: '100%', height: '100%' }}
        >
            {buttons.map((button, ind) =>
                <Draggable key={button.id} index={ind} style={{ overflow: 'visible' }}>
                    {(button.type === OPERATION_TYPES.REPORT.key || button.type === OPERATION_TYPES.KICK_OFF.key) ?
                        <DashboardReportField
                            button={button}
                            ind={ind}
                            {...props}
                        />
                        :
                        <DashboardEditTasksField
                            button={button}
                            ind={ind}
                            {...props}
                        />

                    }

                </Draggable>
            )}
        </Container>
    )
})

export default DashboardEditorButtonRenderer
