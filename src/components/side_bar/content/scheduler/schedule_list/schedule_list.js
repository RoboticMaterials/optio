// import external dependencies
import React, {Component, useState} from "react";

// external functions
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

// components
import ContentHeader from '../../content_header/content_header'
import PlusButton from "../../../../basic/plus_button/plus_button";
import ScheduleListItem from "./schedule_list_item/schedule_list_item";

// import actions
import { putSchedule } from '../../../../../redux/actions/schedule_actions';

// import utils
import { clone_object } from '../../../../../methods/utils/utils';
import {daysOfTheWeek} from "../../../../../constants/scheduler_constants";

// import styles
import * as styled from './schedule_list.style';
import * as pageStyle from '../scheduler_content.style';

// import logger
import log from '../../../../../logger.js';

const logger = log.getLogger("Schedule")

const ScheduleList = (props) => {

    // extract props
    const {
        schedules,
        selectedScheduleId,
        tasks,
        setShowScheduleCreator,
        setSelectedScheduleId,
        openSchedule,
    } = props

    // dispatch
    const dispatch = useDispatch()

    let [timeToNextScheduled, setTimeToNextScheduled] = useState("10000000")
    let [timeToNextScheduledTemp, setTimeToNextScheduledTemp] = useState("10000000")
    let [nextScheduledTimeTemp, setNextScheduledTimeTemp] = useState("10000000")

    let [timeToNextScheduledHours, setTimeToNextScheduledHours] = useState("10000000")
    let [timeToNextScheduledMinutes, setTimeToNextScheduledMinutes] = useState("10000000")
    let [nextScheduleName, setNextScheduleName] = useState("")
    let [id, setId] = useState("")

    const currentMap = useSelector(state => state.settingsReducer.settings.currentMap)

    /*
    * handles switch press event of list items
    *
    * the parent schedule is found by id,
    * and all of its properties are copied into a new object for submission,
    * with the exception of the schedule_on property, which is toggled to its opposite
    * */
    const handleSwitchPress = (scheduleId) => {

        // get schedule item - clone to avoid directly modifying redux state
        const scheduleItem = schedules[scheduleId]


        // toggle schedule items schedule_on property
        const submitItem = {
            taskId: scheduleItem.taskId,
            days_on: scheduleItem.days_on,
            interval_on: scheduleItem.interval_on,
            name: scheduleItem.name,
            schedule_on: !scheduleItem.schedule_on,
            start_time: scheduleItem.start_time,
            time_interval: scheduleItem.time_interval,
            stop_time: scheduleItem.stop_time,
            next_time: scheduleItem.next_time,
        }

        dispatch(putSchedule(scheduleItem.id, submitItem))
    }

    /*
    * renders the task list
    * */
    const renderTasks = () => {
        let fullSchedulesArr = Object.values(schedules).filter((item) => item.mapId === currentMap.id)
        return (
            <styled.TaskListContainer>
                {fullSchedulesArr.length > 0 ?
                    fullSchedulesArr.map((item, index, arr) => {
                        const {
                            days_on,
                            interval_on,
                            name,
                            schedule_on,
                            start_time,
                            stop_time,
                            stop_time_on,
                            taskId,
                            time_interval,
                            next_time,
                            id
                        } = item

                        // initialize empty error object
                        let error = {}

                        logger.log("renderTasks item",item)

                        const selectedTask = taskId ? tasks[taskId] : {};
                        const taskIsDeleted = taskId === 'TASK DELETED';

                        // check for taskName error
                        if(!selectedTask?.name) error.taskName = "Task not found"

                        if(taskIsDeleted) error.taskName = "Task deleted"

                        logger.log("renderTasks selectedTask",selectedTask)

                        // convert days_on object to arr of indices
                        const daysOnArr = [];
                            Object.values(daysOfTheWeek).forEach((val, ind) => {
                                if (days_on[val]) daysOnArr.push(ind)
                            })

                        return (
                            <ScheduleListItem
                                name={name}
                                days_on={daysOnArr}
                                taskName={(selectedTask && selectedTask.name) ? selectedTask.name : ''}
                                selected={selectedScheduleId === id}
                                interval_on={interval_on}
                                key={item.id}
                                id={item.id}
                                start_time={start_time}
                                stop_time={stop_time}
                                schedule_on={schedule_on}
                                time_interval={time_interval}
                                onSwitchPress={handleSwitchPress}
                                onClick={openSchedule}
                                disabled={taskIsDeleted || (item.taskId === 'TEMP_NEW_SCHEDULE_ID') || (item.taskId === 'DEFAULT_TASK_ID')}
                                error={error}
                                next_time={next_time}
                            />
                        );
                    })
                    :
                    <styled.ListEmptyContainer>
                        <styled.ListEmptyTitle>No Schedules</styled.ListEmptyTitle>
                        <styled.ListEmptyFiller />
                    </styled.ListEmptyContainer>
                }

            </styled.TaskListContainer>
        );
    }

    const handleNextExecution = () => {
        let fullSchedulesArr = Object.values(schedules).filter((item) => item.mapId === currentMap.id)
        const minutesPerDay = 1440
        let currentTime = Number(((moment(moment(), 'HH:mm:ss')).format('HH')) * 60) + Number((moment(moment(), 'HH:mm:ss')).format('mm'))
        logger.log('nexttime')

        if (fullSchedulesArr.length > 0) {
          fullSchedulesArr.map((item, index, arr) => {
            var startTime = Number(((moment(item.start_time, 'HH:mm:ss')).format('HH')) * 60) + Number((moment(item.start_time, 'HH:mm:ss')).format('mm'))
            if(item.interval_on){
                var stopTime = Number(((moment(item.stop_time, 'HH:mm:ss')).format('HH')) * 60) + Number((moment(item.stop_time, 'HH:mm:ss')).format('mm'))

                if (stopTime - currentTime > 0 && startTime - currentTime < 0) {
                    var intervalTime = Number(((moment(item.time_interval, 'HH:mm:ss')).format('HH')) * 60) + Number((moment(item.time_interval, 'HH:mm:ss')).format('mm'))
                    timeToNextScheduledTemp = Math.ceil((currentTime - startTime) / intervalTime) * intervalTime + startTime - currentTime
                    nextScheduledTimeTemp = Math.ceil((currentTime - startTime) / intervalTime) * intervalTime + startTime
                }

                if (stopTime - currentTime < 0) {
                    timeToNextScheduledTemp = minutesPerDay - currentTime + startTime
                    nextScheduledTimeTemp = minutesPerDay + startTime
                }
                if (startTime - currentTime > 0) {
                    timeToNextScheduledTemp = startTime - currentTime
                    nextScheduledTimeTemp = startTime
                }
          }
          else{
              nextScheduledTimeTemp = startTime

              if (startTime - currentTime > 0) {
                  timeToNextScheduledTemp = startTime - currentTime
              }

              else{
                timeToNextScheduledTemp = minutesPerDay - currentTime + startTime
              }
            }

            if (timeToNextScheduledTemp < timeToNextScheduled) {
                setTimeToNextScheduled(timeToNextScheduledTemp)
                setTimeToNextScheduledHours(Math.floor(timeToNextScheduled / 60))
                setTimeToNextScheduledMinutes(timeToNextScheduled % 60)
                setNextScheduleName(item.name)
                setId(item.id)

              }
              })
            }
          }


    return (
        <styled.Container>
            {/* <pageStyle.Header>
                <pageStyle.Title schema={'scheduler'}>Schedules</pageStyle.Title>
                <PlusButton
                    onClick={() => setShowScheduleCreator(true)}
                />
            </pageStyle.Header> */}
            <ContentHeader content={'scheduler'} onClickAdd={() => setShowScheduleCreator(true)}/>
            {handleNextExecution()}
            {timeToNextScheduled < 1440 ?

            <styled.NextExecution
                onClick={() => {setShowScheduleCreator(true)
                                setSelectedScheduleId(id)}}>
                                Next Up:  " {nextScheduleName} " will execute in {timeToNextScheduled} minutes
            </styled.NextExecution>
            :
            <></>
          }
            {renderTasks()}
        </styled.Container>

    );
}


export default ScheduleList
