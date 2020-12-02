import React, {useRef, useEffect, useState} from 'react';

// import external components
import ReactList from 'react-list';

// import internal components
import DashboardButton from "../../dashboard_button/dashboard_button";

// style
import * as style from "./dashboard_button_list.style"

// redux
import {useSelector, useDispatch} from "react-redux";
import { getTasks } from '../../../../../../redux/actions/tasks_actions'

// logging
import log from "../../../../../../logger"
import {deepCopy} from "../../../../../../methods/utils/utils";
import {TYPES} from "../../dashboards_sidebar/dashboards_sidebar";
const logger = log.getLogger("Dashboards")


/*
*  Renders list of buttons for a Dashboard
* */
const DashboardButtonList = ((props) => {

	const { buttons, addedTaskAlert, onTaskClick } = props
	const dispatch = useDispatch()

	// ref for list of buttons
	const listRef = useRef(null);

	// redux state
	const tasks = useSelector(state => state.tasksReducer.tasks)

	// renders individuals buttons for list
	const itemRenderer = (index, key) => {

		const currentButton = buttons[index]

		let broken = false
		let name = currentButton.name
		const type = currentButton?.type

        let taskID = currentButton.task_id
        
        // If the task is in tasks or it's a custom task or hil success, then it exists
		const taskExists = !!tasks[taskID] ? true : taskID === 'custom_task' ? true : taskID === 'hil_success' ? true : false

		var disabled
		var error
		var onClick
		switch(type) {
			case TYPES.ROUTES.name:
				disabled = addedTaskAlert || currentButton.deleted || broken || !taskExists
				error = !taskExists ? "This buttons task has been deleted." : null
				onClick = () => {
					logger.log("DashboardButtonList Dashboard onClick")
					if(taskID === 'custom_task' || taskID === 'hil_success'){
						onTaskClick(type, taskID, name, currentButton.custom_task)
					} else {
						onTaskClick(type, taskID, name)
					}
				}
				break
			case TYPES.USER_REPORTS.name:
				disabled = addedTaskAlert || currentButton.deleted || broken
				error = null
				onClick = () => {
					onTaskClick(TYPES.USER_REPORTS.name, currentButton.key)
				}
				break
			default:
				disabled = false
				error = null
				onClick = () => {
					console.log("neato!")
					onTaskClick(type)
				}
				break
		}
		return (
			<DashboardButton
				title={name}
				key={index}
				type={type}
				onClick={onClick}
				containerStyle={{height: '4rem', lineHeight: '3rem', marginBottom: '0.5rem', minWidth: '80%'}}
				hoverable={false}
				taskID = {taskID}
				color = {currentButton.color}
				disabled = {disabled}
				containerCss={style.ButtonContainerCss}
				error={error}
			>
			</DashboardButton>
		)
	}

	return (
		<style.Container>
			<ReactList
				ref={listRef}
				itemRenderer={itemRenderer}
				length={buttons.length}
				type='uniform'
				itemsRenderer={(items, ref)=> {
					return(
						<style.ListContainer ref={ref}>
							{items}
						</style.ListContainer>

					)
				}}
			/>
		</style.Container>
	)
})

export default DashboardButtonList
