import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from "react-router-dom";

// Import Styles
import * as styled from './route_confirmation.style'
import taskAnalysisReducer from "../../../redux/reducers/task_analysis_reducer";
import IconButton from '../../basic/icon_button/icon_button'
import {getTasksAnalysis} from "../../../redux/actions/task_analysis_actions";
import {getRouteProcesses} from "../../../methods/utils/route_utils";
import { showRouteConfirmation, setRouteConfirmationLocation, autoAddRoute } from '../../../redux/actions/tasks_actions'

const RouteConfirmation = (props) => {

    const {
        // selectedTask,
        // positions,
        d3,
    } = props

    const dispatch = useDispatch()
    const dispatchSetShowRouteConfirmation = (bool) => dispatch(showRouteConfirmation(bool))
    const dispatchSetRouteConfirmationLocation = (id) => dispatch(setRouteConfirmationLocation(id))
    const dispatchAutoAddRoute = (bool) => dispatch(autoAddRoute(bool))

    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const showRouteConfirm = useSelector(state=> state.tasksReducer.showRouteConfirmation)
    const routeConfirmLocation = useSelector(state=> state.tasksReducer.routeConfirmationLocation)
    const positions = useSelector(state => state.positionsReducer.positions)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const stations = useSelector(state => state.stationsReducer.stations)
    const location = useLocation()

    const handleSingleTask = (task) => {
          if (!!task && !!showRouteConfirm) {

            const loc = !!stations[routeConfirmLocation] ? stations[routeConfirmLocation] : positions[routeConfirmLocation]

            const x = loc.x
            const y = loc.y

            const xPosition = x -90 + 'px'
            const yPosition = y -80 + 'px'

            return (
                <styled.TaskStatisticsContainer
                    xPosition={xPosition}
                    yPosition={yPosition}

                    >
                    <styled.RowContainer
                       style={{borderBottom: '1px solid #7e7e7e', borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem", padding: '0rem', width: '100%' }}
                       onClick = {()=>{
                         dispatchSetShowRouteConfirmation(false)
                         dispatchAutoAddRoute("finish")
                       }}
                     >
                        <styled.TaskText style={{ paddingRight: '.3rem' }}>Add and finish</styled.TaskText>

                        <IconButton style={{paddingRight: '.2rem' }}>
                                <i className="fas fa-check-circle" style = {{color: "#2ed182"}}></i>
                        </IconButton>
                    </styled.RowContainer>

                    <styled.RowContainer
                      style={{ borderBottomLeftRadius: "0.5rem", borderBottomRightRadius: "0.5rem", padding: '0.1rem .2rem 0.1rem .2rem', width: '100%' }}
                      onClick = {()=> {
                        dispatchSetShowRouteConfirmation(false)
                        dispatchAutoAddRoute("continue")
                      }}
                      >
                        <styled.TaskText style={{ paddingRight: '.3rem', color: "#ffbf1f" }}>Add and continue</styled.TaskText>

                        <IconButton style={{paddingRight: '.2rem' }}>
                                <i className="fas fa-arrow-alt-circle-right" style = {{color: "#ffbf1f"}}></i>
                        </IconButton>
                    </styled.RowContainer>

                </styled.TaskStatisticsContainer>
            )
        }
        else { return null }
    }


    return (
            handleSingleTask(selectedTask)
          )

}

export default RouteConfirmation
