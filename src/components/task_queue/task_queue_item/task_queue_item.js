import React, {useContext, useEffect, useState} from 'react';

import BasicListItem from "../../basic/basic_list_item/basic_list_item";
import BounceButton from "../../basic/bounce_button/bounce_button";

import * as style from "./task_queue_item.style"
import { deleteTaskQueueItem } from "../../../redux/actions/task_queue_actions";
import { getStatus } from "../../../redux/actions/status_actions";
import { useDispatch, useSelector } from "react-redux";

import log from "../../../logger"
import IconButton from "../../basic/icon_button/icon_button";
import { ThemeContext } from "styled-components";

import * as taskActions from '../../../redux/actions/tasks_actions'

const logger = log.getLogger("TaskQueueListItem")

const TaskQueueListItem = (props) => {

    // extract props
    const {
        id,
        item,
        task,
        onClick,
        type,
        ...rest
    } = props

    // dispatch
    const dispatch = useDispatch()
    // theme
    const themeContext = useContext(ThemeContext);

    const tasks = useSelector(state => { return state.tasksReducer.tasks })
    const editingTask = useSelector(state => state.tasksReducer.editingTask)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask) || {}
    const {
        _id: selectedTaskId
    } = selectedTask

    const {
        _id: taskId
    } = task || {}

    const [isSelected, setIsSelected] = useState(false)

    // update isSelected based on if current items task id matches the selectedTask's id
    useEffect(() => {
        if(!isSelected && (selectedTaskId === taskId)) {
            setIsSelected(true)
        }
        else if(selectedTask && (selectedTaskId !== taskId)) {
            setIsSelected(false)
        }
    }, [id, selectedTaskId])

    const handleClick = async () => {
        await dispatch(deleteTaskQueueItem(id))
        dispatch(getStatus(props.statusApi))
    }

    /**
     * This is probably being used to display HILs
     */
    const handleTaskItemClicked = () => {
        if(item.task_id !== 'custom_task'){
            dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })
        }
    }

    const handleMouseEnter = async () => {
        if (!editingTask && !!tasks[item.task_id]) {
            await dispatch(taskActions.selectTask(item.task_id))
        }
    }

    const handleMouseLeave = async () => {
        // only deselect if not currently editing
        if(!editingTask) {
            await dispatch(taskActions.deselectTask())
        }
    }

    return (
        <style.ItemDiv>
            <BasicListItem
                selectable={editingTask}
                isSelected={isSelected}
                {...rest}
                onClick={handleTaskItemClicked}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}

                titleCss={style.titleCss}
                containerCss={style.containerCss}
                rightContentContainerCss={style.rightContentContainerCss}
                contentContainerCss={style.contentContainerCss}
                rightContent={
                    <>
                        <IconButton
                            color={themeContext.fg.primary}
                        >
                            {type == 'human' ?
                                <i className="fas fa-user"></i>
                                :
                                <i className="fas fa-robot"></i>
                            }
                        </IconButton>

                        <IconButton
                            color={themeContext.fg.primary}
                            onClick={handleClick}
                        >
                            <style.StyledRemoveIcon
                                fontSize={"large"}
                            />
                        </IconButton>
                    </>

                }
            />
            {/*CANT USE MARGIN FOR SPACING ITEMS IN REACT LIST - IT CAUSES A WEIRD FLICKERING ISSUE AND PREVENTS REACT-LIST METHODS FROM WORKING CORRECTLY*/}
            {/*USER EMPTY DIV INSTEAD FOR NOW*/}
            <style.Spacer />
        </style.ItemDiv>
    )
}

export default TaskQueueListItem
