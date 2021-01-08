import React, { useEffect, useRef, useState } from 'react';

// external functions
import { useDispatch, useSelector } from 'react-redux';

// external components
import ReactList from 'react-list';

// import utils
import { clone_object } from '../../methods/utils/utils';

// import actions
import { deleteTaskQueueAll } from '../../redux/actions/task_queue_actions';
import { getStatus } from '../../redux/actions/status_actions';
import { getTasks, setSelectedTask } from "../../redux/actions/tasks_actions";


// components
import TaskQueueItem from "./task_queue_item/task_queue_item"

// styles
import * as style from './task_queue.style'

// logging
import log from '../../logger.js';

const logger = log.getLogger("TaskQueueMenu");

const TaskQueueMenu = (props) => {

    const tasks = useSelector(state => { return state.tasksReducer.tasks })
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)

    const taskQueue = useSelector(state => {

        const taskQueue = state.taskQueueReducer.taskQueue

        var taskQueueClone = [];
        if (taskQueue) {
            Object.values(taskQueue).forEach((queueItem, index) => {
                let queueItemClone = clone_object(queueItem);
                // Sees if task is a custom task
                let task = {}
                if (queueItem.task_id == 'custom_task') {
                    task = {
                        name: 'Simple Move',
                        mission_status: 'Austin, Please Add Mission Status',
                    }
                } else {
                    task = tasks ? tasks[queueItem.task_id] : {}

                }

                // skip if associated task isn't found
                if (task) {

                    // If task is a handoff, don't show in task q
                    // if (task.handoff === true) return

                    queueItemClone.task = task;
                    queueItemClone.name = task.name;
                    taskQueueClone.push(queueItemClone);
                } else {
                    // no matching task found, log warning
                    // logger.warn("Queue item found without corresponding task", {queueItem})
                }
            })
        }

        return taskQueueClone
    })


    // dispatch
    const dispatch = useDispatch()

    const itemRenderer = (index, key) => {

        // get item from task queue based on index
        const item = taskQueue[index]
        const type = item.task.device_type
        // extract properties
        const { name } = item
        const id = item?._id
        const status = item.mission_status
        const task = tasks[item.task_id]

        // return the component with the items properties as props
        return (
            <TaskQueueItem
                title={name}
                status={status}
                id={id}
                key={key}
                type={type}
                item={item}
                task={task}
            />
        )
    }

    const clearTaskQueue = async () => {
        dispatch(deleteTaskQueueAll())	// clear task queue
        dispatch(getStatus(props.statusApi))	// fetch update to status
    }

    return (
        <style.Container>

            <style.ListContainer>

                <ReactList
                    itemRenderer={itemRenderer}
                    length={taskQueue.length}
                    type='uniform'
                    style={{ width: '100%' }}
                />
            </style.ListContainer>
        </style.Container>
    );
}

export default TaskQueueMenu;
