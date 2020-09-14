import React, { useEffect, useRef, useState } from 'react';

// external functions
import { useDispatch, useSelector } from 'react-redux';

// external components
import ReactList from 'react-list';

// import utils
import { clone_object } from '../../../../methods/utils/utils';

// import actions
import { deleteTaskQueueAll, getTaskQueue } from '../../../../redux/actions/task_queue_actions';
import { getStatus } from '../../../../redux/actions/status_actions';
import { getTasks } from "../../../../redux/actions/tasks_actions";

// components
import ContentHeader from '../content_header/content_header'
import TaskQueueItem from "./task_queue_item/task_queue_item"

// styles
import * as style from './task_queue.style'

// logging
import log from '../../../../logger.js';

const logger = log.getLogger("TaskQueueMenu");

const TaskQueueMenu = (props) => {

    // useEffect(() => {
    //     // component mount
    //     dispatch(getTaskQueue()) // initial task queue load
    //     dispatch(getTasks()) // initial tasks load

    //     // set interval to fetch data  on interval
    //     const dataInterval = setInterval(() => dispatch(getTaskQueue()), 1000);

    //     // component dismount
    //     return () => {
    //         clearInterval(dataInterval)	// clear interval
    //     }
    // }, [])

    const tasks = useSelector(state => { return state.tasksReducer.tasks })

    const taskQueue = useSelector(state => {

        const taskQueue = state.taskQueueReducer.taskQueue

        var taskQueueClone = [];
        if (taskQueue) {
            Object.values(taskQueue).forEach((queueItem, index) => {
                let queueItemClone = clone_object(queueItem);
                let task = tasks ? tasks[queueItem.task_id] : {};

                // skip if associated task isn't found
                if (task) {
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

        // extract properties
        const { name } = item
        const id = item?._id?.$oid

        // return the component with the items properties as props
        return (
            <TaskQueueItem
                title={name}
                id={id}
                key={key}
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

                <ContentHeader
                    content={'taskQueue'}
                    onClickClear={clearTaskQueue}
                    disabled={(taskQueue.length > 0) ? false : true}
                />

                <div style={{margin:'1rem'}}/>

                <ReactList
                    itemRenderer={itemRenderer}
                    length={taskQueue.length}
                    type='uniform'
                />
            </style.ListContainer>
        </style.Container>
    );
}

export default TaskQueueMenu;
