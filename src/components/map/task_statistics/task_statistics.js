import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Import Styles
import * as styled from './task_statistics.style'
import taskAnalysisReducer from "../../../redux/reducers/task_analysis_reducer";

const TaskStatistics = (props) => {

    const {
        // selectedTask,
        // positions,
        d3,
    } = props

    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const positions = useSelector(state => state.locationsReducer.positions)
    const tasksAnalysis = useSelector(state => state.taskAnalysisReducer.tasksAnalysis) || {}



    useEffect(() => {
    }, [])



    const handleSingleTask = (task) => {
        if (task === undefined) return null
        const selectedTaskAnalysis = tasksAnalysis[task._id]
        if (selectedTaskAnalysis === undefined) return null

        const startPos = positions[task.load.position]
        const endPos = positions[task.unload.position]

        if (task === null || positions === null || startPos === undefined || endPos === undefined) return null

        // const xPosition = (startPos.x + endPos.x) / 2 + 10 * d3.scale + 'px'
        // const yPosition = (startPos.y + endPos.y) / 2 - 30 + 'px'

        // const xPosition = (startPos.x + endPos.x) / 2 + 'px'
        // const yPosition = (startPos.y + endPos.y) / 2 - 30 + 'px'

        const x1 = startPos.x
        const y1 = startPos.y
        const x2 = endPos.x
        const y2 = endPos.y

        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2

        const difY = (y2 - y1)

        // const height = (25*Math.pow(difY,1/4))/Math.pow(d3.scale/5.8,1/4)

        const height = () => {
            if ((150 / difY) > 50) {
                return 50
            } else {
                return 100 - 150 / difY
            }
        }

        // const height = 100

        const numerator = Math.abs(y2 - (midY))

        // const denominator = Math.sqrt(Math.pow(x2 - (midX), 2) + Math.pow(y2 - (midY), 2))
        const denominator = Math.abs(x2 - (midX))

        const theta = Math.atan(numerator / denominator)

        const xPosition = (midX - height() * Math.sin(theta)) - 80 + 'px'
        const yPosition = (midY + height() * Math.cos(theta)) - 40 + 'px'

        return (
            <styled.TaskStatisticsContainer xPosition={xPosition} yPosition={yPosition}>

                <styled.TaskNameContainer>
                    <styled.TaskNameText>{task.name}</styled.TaskNameText>
                </styled.TaskNameContainer>

                <styled.RowContainer style={{ justifyContent: 'space-between', width: '100%', marginTop: '.25rem' }}>
                    <styled.RowContainer>
                        <styled.TaskIcon className='far fa-clock' />
                        <styled.TaskText>{`${selectedTaskAnalysis.avg_run_time}s`}</styled.TaskText>
                    </styled.RowContainer>

                    <styled.RowContainer>
                        <styled.TaskIcon className='far fa-check-circle' />
                        <styled.TaskText>{selectedTaskAnalysis.successes}</styled.TaskText>
                    </styled.RowContainer>

                    <styled.RowContainer>
                        <styled.TaskIcon className='far fa-times-circle' />
                        <styled.TaskText>{selectedTaskAnalysis.failures}</styled.TaskText>
                    </styled.RowContainer>

                </styled.RowContainer>
            </styled.TaskStatisticsContainer>
        )
    }

    const handleProcessTasks = () => {

        if (!!selectedTask) {
            return handleSingleTask(selectedTask)
        }

        // return Object.keys(selectedProcess.routes).map((station) => {
        return selectedProcess.routes.map((route) => {
            return handleSingleTask(tasks[route])

        })
        // })
    }


    return (

        !!selectedProcess ?
            handleProcessTasks()
            :
            handleSingleTask(selectedTask)


    )

}

export default TaskStatistics