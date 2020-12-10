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
import {OPERATION_TYPES, TYPES} from "../../dashboards_sidebar/dashboards_sidebar";
import {theme} from "../../../../../../theme";
import DashboardSplitButton from "../../dashboard_button/split_button/dashboard_split_button";
const logger = log.getLogger("Dashboards")


/*
*  Renders list of buttons for a Dashboard
* */
const DashboardButtonList = ((props) => {

	const { buttons, addedTaskAlert, onTaskClick } = props



	// ref for list of buttons
	const listRef = useRef(null);

	// redux state
	const tasks = useSelector(state => state.tasksReducer.tasks)

	// renders individuals buttons for list
	const itemRenderer = (index, key) => {

		const currentButton = buttons[index]

		console.log("currentButton",currentButton)

		let broken = false
		let name = currentButton.name
		const type = currentButton?.type
        let taskID = currentButton.task_id
		const task = tasks[taskID]
		const associatedTaskId = task?.associated_task

		console.log("task", task)

        // If the task is in tasks or it's a custom task or hil success, then it exists
		const taskExists = !!tasks[taskID] ? true : taskID === 'custom_task' ? true : taskID === 'hil_success' ? true : false

		var disabled
		var error
		var onClick

		const handleRouteClick = () => {
			disabled = addedTaskAlert || currentButton.deleted || broken || !taskExists
			error = !taskExists ? "This buttons task has been deleted." : null
			onClick = (associatedTaskIdArg) => {
				console.log("associatedTaskIdArg",associatedTaskIdArg)
				if(taskID === 'custom_task' || taskID === 'hil_success'){
					onTaskClick(TYPES.ROUTES.key, associatedTaskIdArg, name, currentButton.custom_task)
				} else {
					onTaskClick(TYPES.ROUTES.key, associatedTaskIdArg, name)
				}
			}
		}
		switch(type) {
			case TYPES.ROUTES.key:
				handleRouteClick()
				break

			case OPERATION_TYPES.REPORT.key:
				disabled = addedTaskAlert || currentButton.deleted || broken
				error = null
				onClick = () => {
					onTaskClick(OPERATION_TYPES.REPORT.key, currentButton.key)
				}
				break

			case OPERATION_TYPES.KICK_OFF.key:
			// case "KICK_OFF":
				return null // KICK_OFF button is currently disabled
				disabled = true
				error = null
				onClick = () => {
					onTaskClick(type)
				}
				break

			default:
				handleRouteClick()
				break
		}

		var schema
		var iconClassName = ""
		var iconColor

		if(type && (typeof type === 'string' || type instanceof String)) {
			schema = theme.main.schema[type.toLowerCase()]
			iconClassName = schema?.iconName
			iconColor = schema?.solid
		}

		if(associatedTaskId) return (
			<DashboardSplitButton
				title={name}
				associatedTaskId={associatedTaskId}
				iconColor={"black"}
				iconClassName={iconClassName}
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
			</DashboardSplitButton>
		)

		return (
			<DashboardButton
				title={name}
				iconColor={iconColor}
				iconClassName={iconClassName}
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
			/>
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
