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

		// TODO: Uncomment when task is implemented
		let taskID = currentButton.task_id

		return (
			<DashboardButton
				title={name}
				key={index}
				onClick={() => {
					logger.log("DashboardButtonList Dashboard onClick")
					onTaskClick(taskID, name)
				}}
				containerStyle={{height: '4rem', lineHeight: '3rem', marginBottom: '0.3rem', minWidth: '80%'}}
				hoverable={false}
				taskID = {taskID}
				color = {currentButton.color}
				disabled = {addedTaskAlert || currentButton.deleted || broken}
				containerCss={style.ButtonContainerCss}
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