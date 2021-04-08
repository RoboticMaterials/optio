import React, { useState, memo } from "react"

// external functions
import PropTypes from "prop-types"

// internal components
import CardZone from "../card_zone/card_zone"

// styles
import * as styled from "./summary_zone.style"

/*
* This component renders a CardZone for a list of processes
* */
const SummaryZone = ((props) => {

	// extract props
	const {
		handleCardClick,
		setShowCardEditor,
		showCardEditor,
		lotFilterValue,
		selectedFilterOption,
		selectedProcesses,
		sortMode,
		sortDirection,
		selectedCards,
		setSelectedCards,
		handleAddLotClick
	} = props

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
					<styled.ZoneContainer
						key={processId}
					>
						<styled.ProcessName>{processName}</styled.ProcessName>

						<CardZone
							handleAddLotClick={handleAddLotClick}
							setSelectedCards={setSelectedCards}
							selectedCards={selectedCards}
							sortMode={sortMode}
							sortDirection={sortDirection}
							lotFilterValue={lotFilterValue}
							selectedFilterOption={selectedFilterOption}
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
	handleAddLotClick: PropTypes.func,
	showCardEditor: PropTypes.bool,
	lotFilterValue: PropTypes.any
}

// Specifies the default values for props:
SummaryZone.defaultProps = {
	handleCardClick: () => {},
	setShowCardEditor: () => {},
	handleAddLotClick: () => {},
	showCardEditor: false,
	lotFilterValue: "",
	selectedFilterOption: null
}

export default memo(SummaryZone)

