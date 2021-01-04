import React, { useState } from "react"

// external functions
import {SortableContainer} from "react-sortable-hoc"
import {useDispatch, useSelector} from "react-redux"
import PropTypes from "prop-types"

// internal components
import CardZone from "../card_zone/card_zone"
import ZoneHeader from "../zone_header/zone_header"

// styles
import * as styled from "./summary_zone.style"
import TextField from "../../../../basic/form/text_field/text_field"

/*
* This component renders a CardZone for a list of processes
* */
const SummaryZone = SortableContainer((props) => {

	// extract props
	const {
		handleCardClick,
		setShowCardEditor,
		showCardEditor,
	} = props

	// redux state
	const processes = useSelector(state => { return Object.values(state.processesReducer.processes) })

	// internal component state
	const [selectedProcesses, setSelectedProcesses] = useState(processes) // array of {process} objects - the list of selected processes

	/*
   * This function renders a CardZone for each process in {selectedProcesses}
   *
   * For each process, the process's name and id are extracted
   * a CardZone is rendered for each process, which is contained in a wrapping div for relative styling and additional elements (such as ProcessName)
   *
   * no params
   * */
	const renderSelectedProcesses = () => {
		return (
			// map through {selectedProcesses}
			selectedProcesses.map((currProcess, processIndex) => {

				// extract process attributes
				const {
					name: processName,
					_id: processId
				} = currProcess

				// return a CardZone wrapped with a styled container and any additional elements
				return	(
					<styled.ZoneContainer>
						<styled.ProcessName>{processName}</styled.ProcessName>

						<CardZone
							setShowCardEditor={setShowCardEditor}
							showCardEditor={showCardEditor}
							maxHeight={"30rem"}
							processId={processId}
							handleCardClick={handleCardClick}
						/>
					</styled.ZoneContainer>
				)
			})
		)
	}

	return(
		<styled.Container >
			<ZoneHeader
				selectedProcesses={selectedProcesses}
				setSelectedProcesses={setSelectedProcesses}
			/>

			<styled.ProcessesContainer>
				{renderSelectedProcesses()}
			</styled.ProcessesContainer>
		</styled.Container>
	)
})

// Specifies propTypes
SummaryZone.propTypes = {
	handleCardClick: PropTypes.func,
	setShowCardEditor: PropTypes.func,
	showCardEditor: PropTypes.bool
}

// Specifies the default values for props:
SummaryZone.defaultProps = {
	handleCardClick: () => {},
	setShowCardEditor: () => {},
	showCardEditor: false,
}

export default SummaryZone

