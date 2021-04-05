import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";

import * as styled from './processes_content.style'

// Import basic components
import ContentHeader from '../content_header/content_header'
import Textbox from '../../../basic/textbox/textbox.js'
import Button from '../../../basic/button/button'
import DropDownSearch from '../../../basic/drop_down_search_v2/drop_down_search'
import TextBoxSearch from '../../../basic/textbox_search/textbox_search'

import ContentList from '../content_list/content_list'

// Import actions
import { setSelectedProcess, editingProcess, putProcesses } from '../../../../redux/actions/processes_actions'
import { postTaskQueue } from '../../../../redux/actions/task_queue_actions'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'
import { isBrokenProcess } from '../../../../methods/utils/processes_utils'

import uuid from 'uuid'
import { uuidv4 } from "../../../../methods/utils/utils";
import ProcessForm from "./process_form/process_form";

const ProcessesContent = () => {

    const history = useHistory()

    const dispatch = useDispatch()
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const dispatchEditing = (props) => dispatch(editingProcess(props))
    const dispatchPutProcess = (process) => dispatch(putProcesses(process))

    let tasks = useSelector(state => state.tasksReducer.tasks)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const processes = useSelector(state => state.processesReducer.processes)
    const editing = useSelector(state => state.processesReducer.editingProcess)
    const currentMap = useSelector(state => state.mapReducer.currentMap)

    // State definitions
    const [shift, setShift] = useState(false) // Is shift key pressed ?
    const [isTransportTask, setIsTransportTask] = useState(true)


    useEffect(() => {

        return () => {
            dispatchSetSelectedProcess(null)
        }
    }, [])

    useEffect(() => {
        // Maps through all process and sees if they're broken
        Object.values(processes).map((process) => {
            const processRoutes = process.routes.map((currRoute) => tasks[currRoute]) || {}

            // If it was previously broken, but not anymore, then correct that ish
            if (!!process.broken && !isBrokenProcess(processRoutes, tasks)) {
                process.broken = null
                dispatchPutProcess(process)
            }

            // Else if the process is broken, so fix that ish
            else if (!!isBrokenProcess(processRoutes, tasks) && process.broken === null) {
                process.broken = isBrokenProcess(processRoutes, tasks)
                dispatchPutProcess(process)
            }
        })
        return () => {
        }
    }, [processes])


    const onCardView = (element) => {
        const currentPath = history.location.pathname
        // history.push(currentPath + '/' + element._id + "/lots")
        history.push(currentPath + '/' + element._id + "/statistics")
    }

    if (editing && selectedProcess !== null) { // Editing Mode
        return (
            <ProcessForm
                toggleEditingProcess={props => dispatchEditing(props)}
            />
        )
    } else {    // List Mode
        return (
            <ContentList
                title={'Processes'}
                schema={'processes'}
                // elements={Object.values(tasks)}
                elements={
                    Object.values(processes).filter((currProcess) => currProcess.map_id === currentMap._id)
                }
                onMouseEnter={(process) => dispatchSetSelectedProcess(process)}
                onMouseLeave={() => dispatchSetSelectedProcess(null)}
                handleCardView={(element) => onCardView(element)}
                onClick={(process) => {
                    // If task button is clicked, start editing it
                    dispatchSetSelectedProcess(process)
                    dispatchEditing(true)
                }}
                onPlus={() => {
                    const newProcess = {
                        name: '',
                        _id: uuid.v4(),
                        new: true,
                        routes: [],
                        broken: null,
                    }
                    // TODO: May have to do this with processes
                    // dispatch(taskActions.addTask(newTask))
                    dispatchSetSelectedProcess(newProcess)
                    dispatchEditing(true)
                }}
            />
        )
    }
}

export default ProcessesContent
