import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'

import { SortableContainer } from "react-sortable-hoc";
import DashboardEditTasksField from "../dashboard_edit_tasks_field/dashboard_edit_tasks_field";

import ReactList from 'react-list';

import * as style from "./dashboard_editor_button_renderer.style"
import { Container, Draggable } from 'react-smooth-dnd';

import log from "../../../../../../logger"

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
            onDragStart={() => {
                console.log('QQQQ Drag start')
            }}
            onDragEnd={() => {
                console.log('QQQQ Drag end')
            }}
            groupName="dashboard-buttons"
            getChildPayload={() => null}
            style={{ width: '100%', height: '100%' }}
        >
            {buttons.map((button, ind) =>
                <Draggable key={button.id} index={ind} style={{ overflow: 'visible' }}>
                    <DashboardEditTasksField button={button} ind={ind} {...props}></DashboardEditTasksField>
                </Draggable>
            )}
        </Container>
    )
})

export default DashboardEditorButtonRenderer