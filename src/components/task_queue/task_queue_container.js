import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {clone_object} from "../../methods/utils/utils";
import {API} from "aws-amplify";
import {manageTaskQueue} from "../../graphql/mutations";

const TaskQueueContainer = (props) => {
    const {

    } = props

    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)

    // Handle task being created
    // const handleTaskUpdate = async (taskQueueItem) => {
    //     console.log("handleTaskUpdate taskQueueItem",taskQueueItem)
    //
    //     // get the task
    //     const tasks = await onGetTasks()
    //
    //     const task = taskQueueItem ? tasks[taskQueueItem.taskId] : null
    //
    //     // Unload?
    //     if(task && task.handoff && taskQueueItem.quantity){
    //
    //         // set end time
    //         taskQueueItem.end_time = Math.round(Date.now() / 1000)
    //
    //         console.log("ABOUT TO CALL TASK QUEUE LAMDA")
    //         // tell GQL to run the lambda function
    //         await API.graphql({
    //             query: manageTaskQueue,
    //             variables: {
    //                 taskQueueItem: JSON.stringify(taskQueueItem)
    //             }
    //         });
    //     }else if(taskQueueItem && taskQueueItem.start_time === null && !task.handoff){
    //
    //         taskQueueItem.start_time = Math.round(Date.now() / 1000)
    //
    //         taskQueueItem.hil_station_id = task.unload.station
    //
    //         taskQueueItem.hil_message = 'Unload'
    //
    //         console.log("ABOUT TO PUT TASKQUEUE")
    //         // put a start time on th taskQueueItem
    //         await onPutTaskQueue(taskQueueItem, taskQueueItem.id)
    //     }
    //     else {
    //         console.log("IN THE ELSE")
    //     }
    // }

    // Object.values(taskQ).map((item) => {
    //     if (
    //         // when do we update the task???
    //         item.taskId === value.data.onDeltaTaskQueue.taskId
    //         &&
    //         value.data.onDeltaTaskQueue.hil_response === true
    //         &&
    //         value.data.onDeltaTaskQueue.updatedAt
    //     )
    //     {
    //         console.log("found match")
    //         handleTaskUpdate(value.data.onDeltaTaskQueue)
    //     }
    // })
    //
    useEffect(() => {
        console.log("TaskQueueContainer taskQueue",taskQueue)
    }, [taskQueue])

    return (
        <div>

        </div>
    );
};

TaskQueueContainer.propTypes = {

};

export default TaskQueueContainer;
