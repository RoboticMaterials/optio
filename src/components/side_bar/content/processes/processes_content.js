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
    const dispatchPostTaskQueue = (ID) => dispatch(postTaskQueue(ID))
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const dispatchEditing = (props) => dispatch(editingProcess(props))
    const dispatchPutProcess = (process) => dispatch(putProcesses(process))

    let tasks = useSelector(state => state.tasksReducer.tasks)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const processes = useSelector(state => state.processesReducer.processes)
    const editing = useSelector(state => state.processesReducer.editingProcess)

    // State definitions
    //const [editing, toggleEditing] = useState(false)    // Is a task being edited? Otherwise, list view
    const [selectedProcessCopy, setSelectedProcessCopy] = useState(null)  // Current task
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
            const processRoutes = process.routes.map((currRoute) => tasks[currRoute])

            // If it was previously broken, but not anymore, then correct that ish
            if (!!process.broken && !isBrokenProcess(processRoutes, tasks)) {
                console.log('Process was broken but now fixed')
                process.broken = null
                dispatchPutProcess(process)
            }

            // Else if the process is broken, so fix that ish
            else if (!!isBrokenProcess(processRoutes, tasks) && process.broken === null) {
                console.log('QQQQ Process is broken')
                process.broken = isBrokenProcess(processRoutes, tasks)
                dispatchPutProcess(process)
            }
        })
        return () => {
        }
    }, [processes])


    const onCardView = (element) => {
        const currentPath = history.location.pathname
        history.push(currentPath + '/' + element._id + "/lots")
    }

    if (editing && selectedProcess !== null) { // Editing Mode
        return (
            <ProcessForm
                selectedProcessCopy={selectedProcessCopy}
                setSelectedProcessCopy={props => setSelectedProcessCopy(props)}
                toggleEditingProcess={props => dispatchEditing(props)}
            />
        )
    } else {    // List Mode
        return (
            <ContentList
                title={'Processes'}
                schema={'processes'}
                // elements={Object.values(tasks)}
                elements={Object.values(processes)}
                onMouseEnter={(process) => dispatchSetSelectedProcess(process)}
                onMouseLeave={() => dispatchSetSelectedProcess(null)}
                handleCardView={(element) => onCardView(element)}
                onClick={(process) => {
                    // If task button is clicked, start editing it
                    setSelectedProcessCopy(deepCopy(process))
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
                    setSelectedProcessCopy(deepCopy(newProcess))
                    dispatchEditing(true)
                }}
            />
        )
    }
}

export default ProcessesContent
