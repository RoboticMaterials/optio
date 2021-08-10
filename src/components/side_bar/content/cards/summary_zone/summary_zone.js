import React, { useState, memo } from "react"
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';

// external functions
import PropTypes from "prop-types"

// internal components
import CardZone from "../card_zone/card_zone"

// styles
import * as styled from "./summary_zone.style"

// Import Utils
import { getProcessStations } from '../../../../../methods/utils/processes_utils'

/*
* This component renders a CardZone for a list of processes
* */
const SummaryZone = ((props) => {

    // extract props
    const {
        handleCardClick,
        setShowCardEditor,
        showCardEditor,
        selectedCards,
        selectedProcesses,

        lotFilterValue,
        selectedFilterOption,

        sortMode,
        sortDirection,
        lotFilters,

        setSelectedCards,
        handleAddLotClick
    } = props
    const stations = useSelector(state => state.stationsReducer.stations)
    const routes = useSelector(state => state.tasksReducer.tasks)

    const renderProcessCycleTime = (process) => {
        const processStations = Object.keys(getProcessStations(process, routes))

        let totalCycleTime = moment().set({ 'hour': '00', 'minute': '00', 'second': '00' })
        processStations.forEach((stationID) => {
            const station = stations[stationID]
            if (!!station.cycle_time) {
                const splitVal = station.cycle_time.split(':')
                totalCycleTime.add(parseInt(splitVal[0]), 'hours').add(parseInt(splitVal[1]), 'minutes').add(parseInt(splitVal[2]), 'seconds')

            }
        })
        if (totalCycleTime.hour() > 0 || totalCycleTime.minute() > 0 || totalCycleTime.second() > 0) {

            return (
                <styled.ColumnContainer s>
                    <styled.CycleTimeText style={{ fontWeight: 'bold' }}>Process Cycle Time:</styled.CycleTimeText>
                    <styled.CycleTimeText>
                        {totalCycleTime.format('HH:mm:ss')}
                    </styled.CycleTimeText>
                </styled.ColumnContainer>

            )
        }
        else {
            return
        }
    }

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
					<>
						{!!currProcess.showSummary &&
							<styled.ZoneContainer
								key={processId}
							>
								<styled.ProcessName>{processName}</styled.ProcessName>

								<CardZone
									handleAddLotClick={handleAddLotClick}
									setSelectedCards={setSelectedCards}
									selectedCards={selectedCards}
									sortMode={sortMode}
                  lotFilterValue = {lotFilterValue}
                  selectedFilterOption = {selectedFilterOption}
									sortDirection={sortDirection}
									lotFilters={lotFilters}
									setShowCardEditor={setShowCardEditor}
									showCardEditor={showCardEditor}
									maxHeight={"50rem"}
									processId={processId}
									handleCardClick={handleCardClick}
								/>
							</styled.ZoneContainer>
						}
					</>

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
    handleCardClick: () => { },
    setShowCardEditor: () => { },
    handleAddLotClick: () => { },
    showCardEditor: false,
    lotFilterValue: "",
    selectedFilterOption: null
}

export default memo(SummaryZone)
