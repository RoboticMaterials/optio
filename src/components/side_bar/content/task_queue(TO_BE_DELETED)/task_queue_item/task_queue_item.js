import React, {useContext} from 'react';

import BasicListItem from "../../../../basic/basic_list_item/basic_list_item";
import BounceButton from "../../../../basic/bounce_button/bounce_button";

import * as style from "./task_queue_item.style"
import {deleteTaskQueueItem} from "../../../../../redux/actions/task_queue_actions";
import {getStatus} from "../../../../../redux/actions/status_actions";
import {useDispatch} from "react-redux";

import log from "../../../../../logger"
import IconButton from "../../../../basic/icon_button/icon_button";
import {ThemeContext} from "styled-components";

const logger = log.getLogger("TaskQueueListItem")

const TaskQueueListItem = (props) => {

	// extract props
	const {
		id,
		...rest
	} = props

	// dispatch
	const dispatch = useDispatch()

	// theme
	const themeContext = useContext(ThemeContext);

	const handleClick = async () => {
		await dispatch(deleteTaskQueueItem(id))
		dispatch(getStatus(props.statusApi))
	}

	return (
		<div>
			<BasicListItem
				{...rest}
				titleCss={style.titleCss}
				containerCss={style.containerCss}
				rightContentContainerCss={style.rightContentContainerCss}
				rightContent={
					<IconButton
						color={themeContext.fg.primary}
						onClick={handleClick}
					>
						<style.StyledRemoveIcon
							fontSize={"large"}
						/>
					</IconButton>

				}
			/>
			{/*CANT USE MARGIN FOR SPACING ITEMS IN REACT LIST - IT CAUSES A WEIRD FLICKERING ISSUE AND PREVENTS REACT-LIST METHODS FROM WORKING CORRECTLY*/}
			{/*USER EMPTY DIV INSTEAD FOR NOW*/}
			<style.Spacer/>
		</div>
	)
}

export default TaskQueueListItem