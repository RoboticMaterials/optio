import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'

import { SortableContainer } from "react-sortable-hoc";
import DashboardRouteField from "../button_fields/dashboard_route_field/dashboard_route_field";

import ReactList from 'react-list';

import * as style from "./dashboard_editor_button_renderer.style"
import { Container, Draggable } from 'react-smooth-dnd';

import log from "../../../../../../logger"
import {OPERATION_TYPES, TYPES} from "../../dashboards_sidebar/dashboards_sidebar";
import DashboardReportField from "../button_fields/dashboard_report_field/dashboard_report_field";
import {getCanDeleteDashboardButton} from "../../../../../../methods/utils/dashboards_utils";

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
            {buttons.map((button, ind) => {

                    const {
                        color: buttonColor,
                        id: buttonId,
                        name: buttonName,
                        task_id: buttonTaskId,
                        type: buttonType,
                        custom_task: customTask
                    } = button || {}

                    const isButtonDeletable = getCanDeleteDashboardButton({type: buttonType})

                    return(
                        <Draggable key={buttonId} index={ind} style={{ overflow: 'visible' }}>
                            {/*{(button.type === OPERATION_TYPES.REPORT.key || button.type === OPERATION_TYPES.KICK_OFF.key) ?*/}
                            {(button.type === OPERATION_TYPES.REPORT.key) ?
                                <DashboardReportField
                                    color={buttonColor}
                                    type={buttonType}
                                    deletable={isButtonDeletable}
                                    ind={ind}
                                    buttonId={buttonId}
                                />
                                :
                                ((button.type === TYPES.ROUTES.key) || (!button.type)) &&
                                <DashboardRouteField
                                    customTask={customTask}
                                    taskId={buttonTaskId}
                                    color={buttonColor}
                                    deletable={isButtonDeletable}
                                    ind={ind}
                                    buttonId={buttonId}
                                />
                            }
                            { (button.type === OPERATION_TYPES.KICK_OFF.key) &&
                            <DashboardReportField
                                color={buttonColor}
                                type={buttonType}
                                deletable={isButtonDeletable}
                                ind={ind}
                                buttonId={buttonId}
                            />
                            }
                            { (button.type === OPERATION_TYPES.FINISH.key) &&
                            <DashboardReportField
                                color={buttonColor}
                                deletable={isButtonDeletable}
                                type={buttonType}
                                ind={ind}
                                buttonId={buttonId}
                            />
                            }
                        </Draggable>
                    )
                }

            )}
        </Container>
    )
})

export default DashboardEditorButtonRenderer
