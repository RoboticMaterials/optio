import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from "react-router-dom";

// Import Styles
import * as styled from './task_statistics.style'
import taskAnalysisReducer from "../../../redux/reducers/task_analysis_reducer";
import IconButton from '../../basic/icon_button/icon_button'
import {getTasksAnalysis} from "../../../redux/actions/task_analysis_actions";
import {getRouteProcesses} from "../../../methods/utils/route_utils";

const TaskStatistics = (props) => {

    const {
        // selectedTask,
        // positions,
        d3,
    } = props

    const dispatch = useDispatch()
    const onGetTasksAnalysis = () => dispatch(getTasksAnalysis())

    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedHoveringTask = useSelector(state => state.tasksReducer.selectedHoveringTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const positions = useSelector(state => state.positionsReducer.positions)
    const stations = useSelector(state => state.stationsReducer.stations)
    const tasksAnalysis = useSelector(state => state.taskAnalysisReducer.tasksAnalysis) || {}
    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingPosition = useSelector(state => state.positionsReducer.editingPosition)
    const taskEditing = useSelector(state => state.tasksReducer.editingTask)
    const processEditing = useSelector(state => state.processesReducer.editingProcess)

    const location = useLocation()

    useEffect(() => {
        onGetTasksAnalysis()
    }, [])

    const handleSingleTask = (task) => {
      if(!!task){
        if (task === undefined || selectedTask === undefined) return null

        if (editingStation === true || editingPosition === true ||(taskEditing && location.pathname === '/tasks')) return null


        const selectedTaskAnalysis = !!task ? tasksAnalysis[task._id]: null
        const startPos = task.device_types[0] == 'human' && task.load.position == task.load.station ? stations[task.load.position] : positions[task.load.position]
        const endPos = task.device_types[0] == 'human' && task.unload.position == task.unload.station ? stations[task.unload.position] : positions[task.unload.position]
        const routeProcesses = getRouteProcesses(task._id)

        if (task === null || positions === null || startPos === undefined || endPos === undefined) return null

        // const xPosition = (startPos.x + endPos.x) / 2 + 10 * d3.scale + 'px'
        // const yPosition = (startPos.y + endPos.y) / 2 - 30 + 'px'

        // const xPosition = (startPos.x + endPos.x) / 2 + 'px'
        // const yPosition = (startPos.y + endPos.y) / 2 - 30 + 'px'

        // Some fancy calculation to find a common offset from a task path
        // Doesnt work because it doesnt
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

        // const xPosition = (midX - height() * Math.sin(theta)) - 80 + 'px'
        // const yPosition = (midY + height() * Math.cos(theta)) - 40 + 'px'

        const xPosition = midX -40 + 'px'
        const yPosition = midY +20 + 'px'
          return (
              <styled.TaskStatisticsContainer xPosition={xPosition} yPosition={yPosition}>
              <styled.RowContainer style = {{borderBottom: '1px solid black', padding: '.2rem .2rem .2rem .2rem', width: '100%'}}>

                <styled.TaskText style = {{paddingRight: '.3rem'}}>{task.name} </styled.TaskText>

                  <IconButton color={'red'} style = {{paddingRight: '.2rem'}}>
                      {task.device_types[0] === 'human' ?
                          <i className="fas fa-user"></i>
                          :
                          <i className="fas fa-robot"></i>
                      }
                  </IconButton>

              </styled.RowContainer>

              <styled.RowContainer style = {{paddingTop: '.2rem'}}>

                  <styled.TaskText style = {{paddingRight: '.7rem'}}>{routeProcesses.length}</styled.TaskText>

                  <IconButton color= '#ffb62e'>
                    <i className="fas fa-route"></i>
                  </IconButton>

              </styled.RowContainer>

              {task.device_types[0] !== 'human' && !!selectedTaskAnalysis &&
                  <styled.RowContainer style={{ justifyContent: 'space-between', width: '82%', marginTop: '.25rem', borderTop: '1px solid black', paddingTop: '.3rem'}}>
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
            }
              </styled.TaskStatisticsContainer>
          )
        }
        else {return null}

      }


    const handleProcessTasks = () => {

        if (!!selectedHoveringTask) {
            return handleSingleTask(selectedHoveringTask)
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
