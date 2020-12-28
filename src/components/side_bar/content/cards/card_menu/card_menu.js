import React from "react";

import Button from "../../../../basic/button/button";

import * as styled from "./card_menu.style";
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import DropDownSearchField from "../../../../basic/form/drop_down_search_field/drop_down_search_field";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";


const CardMenu = (props) => {
	const {
		currentProcess,
		close
	} = props

	const history = useHistory()
	const processes = Object.values(useSelector(state => { return state.processesReducer.processes }))
	let params = useParams()
	const {
		id,
		page,
		subpage
	} = params

	return(
		<styled.Container>
			<styled.Header>
				<styled.Title>Zones</styled.Title>
				<styled.CloseButton
					className="fa fa-times"
					aria-hidden="true"
					onClick={close}
				/>

			</styled.Header>


			<Button
				schema={'lots'}
				style={{ margin: 0, marginBottom: "1rem" }}
				onClick={async () => {
					history.replace ('/lots/summary')
				}}
			>
				Lots Summary
			</Button>
			<styled.Title style={{marginBottom: "1rem"}}>Processes</styled.Title>
			<DropDownSearch
				values={currentProcess ? [currentProcess] : []}
				options={processes}
				onChange={values => {
					const processId = values[0]?._id
					const currentPath = history.location.pathname
					// if(processId) history.push(currentPath + '/' + processId + "/card")
					// history.push ('./../' + processId + "/card")
					history.replace ('/processes/' + processId + "/lots")

				}}
				pattern={null}
				labelField={'name'}
				valueField={"_id"}
				onDropdownOpen={() => {
				}}
			/>



		</styled.Container>
	)
}

export default CardMenu
