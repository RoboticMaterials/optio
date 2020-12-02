import React, { useState} from 'react'

// external funcs
import {useDispatch, useSelector} from 'react-redux'

// import components
import ScheduleList from './schedule_list/schedule_list'
import {ConfirmDeleteModal} from "../../../basic/modals/modals"
import CreateScheduleForm from "./create_schedule_form/create_schedule_form"

// import styles
import * as styled from './scheduler_content.style'

// logging
import log from '../../../../logger.js'
import {deleteSchedule} from "../../../../redux/actions/schedule_actions";
const logger = log.getLogger("Schedule")

const SchedulerContent = () => {

    // dispatch
    const dispatch = useDispatch()

    // self contained state
    const [selectedScheduleId, setSelectedScheduleId] = useState(null)
    const [showScheduleCreator, setShowScheduleCreator] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // redux state
    const tasks = useSelector(state => {return state.tasksReducer.tasks})
    const schedules = useSelector(state => {
        return state.schedulesReducer.schedules
    })

    const handleSelectTask = (taskId) => {
        setSelectedScheduleId(taskId)
        setShowScheduleCreator(true)
    }

    const handleDelete = async () => {
        // get schedule item - clone to avoid directly modifying redux state
        const foundScheduleItem = schedules[selectedScheduleId]

        if (foundScheduleItem) {
            // dispatch action to make delete request to api and update redux
            await dispatch(deleteSchedule(selectedScheduleId))
        }

        setShowDeleteModal(false)
        setShowScheduleCreator(false)
    }
    return (
        <styled.Container>
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                title={"Confirm Delete"}
                textMain={"Are you sure you want to delete this schedule?"}
                caption={"This action cannot be undone."}
                onCancelClick={()=>setShowDeleteModal(false)}
                onDeleteClick={handleDelete}
            />
            {showScheduleCreator ?
                <CreateScheduleForm
                    selectedScheduleId={selectedScheduleId}
                    onDeleteClick={() => setShowDeleteModal(true)}
                    setSelectedScheduleId={setSelectedScheduleId}
                    hideScheduleCreator={()=> {
                        setShowScheduleCreator(false)
                        setSelectedScheduleId(null)
                    }}
                    schedules={schedules}
                    tasks={tasks}

                />
                :
                <ScheduleList
                    selectedScheduleId={selectedScheduleId}
                    handleSelectTask={handleSelectTask}
                    schedules={schedules}
                    setShowScheduleCreator={setShowScheduleCreator}
                    setSelectedScheduleId = {(id)=>setSelectedScheduleId(id)}
                    openSchedule={(id) => {
                        setSelectedScheduleId(id)
                        setShowScheduleCreator(true)
                    }}
                    tasks={tasks}
                />
            }
        </styled.Container>
    )
}

export default SchedulerContent
