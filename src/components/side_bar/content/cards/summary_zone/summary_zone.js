import React, { useState, memo, useMemo, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import ReactTooltip from 'react-tooltip';


// external functions
import PropTypes from "prop-types"

// internal components
import CardZone from "../card_zone/card_zone"
import Portal from "../../../../../higher_order_components/portal";


// styles
import * as styled from "./summary_zone.style"

// Import Utils
import { getProcessStations } from '../../../../../methods/utils/processes_utils'
import { convertSecondsToHHMMSS, convertSecondsToDHM } from '../../../../../methods/utils/time_utils'

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

        sortMode,
        sortDirection,
        lotFilters,
        
        setSelectedCards,
        handleAddLotClick
    } = props
    const stations = useSelector(state => state.stationsReducer.stations)
    const routes = useSelector(state => state.tasksReducer.tasks)

    const [processWip, setProcessWip] = useState({});
    const [productionRate, setProductionRate] = useState({});
    const [DPP, setDPP] = useState({});

    // const renderProcessCycleTime = (process) => {
    //     const processStations = Object.keys(getProcessStations(process, routes))

    //     let totalCycleTime = moment().set({ 'hour': '00', 'minute': '00', 'second': '00' })
    //     processStations.forEach((stationID) => {
    //         const station = stations[stationID]
    //         if (!!station.cycle_time) {
    //             const splitVal = station.cycle_time.split(':')
    //             totalCycleTime.add(parseInt(splitVal[0]), 'hours').add(parseInt(splitVal[1]), 'minutes').add(parseInt(splitVal[2]), 'seconds')

    //         }
    //     })
    //     if (totalCycleTime.hour() > 0 || totalCycleTime.minute() > 0 || totalCycleTime.second() > 0) {

    //         return (
    //             <styled.ColumnContainer s>
    //                 <styled.CycleTimeText style={{ fontWeight: 'bold' }}>Process Cycle Time:</styled.CycleTimeText>
    //                 <styled.CycleTimeText>
    //                     {totalCycleTime.format('HH:mm:ss')}
    //                 </styled.CycleTimeText>
    //             </styled.ColumnContainer>

    //         )
    //     }
    //     else {
    //         return
    //     }
    // }

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
                                <styled.ProcessHeader>
                                    <styled.ProcessName>{processName}</styled.ProcessName>

                                    <div style={{display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 10, marginTop: '1rem'}}>

                                        <styled.ProcessStat style={{textAlign: 'right'}}>
                                            <styled.Info data-tip data-for="WIP-tooltip" className='far fa-question-circle'>
                                                <Portal>
                                                    <ReactTooltip id="WIP-tooltip" effect="solid" place="right" offset={{left: -10}}>
                                                        <styled.ToolTipText>
                                                            WIP - Work In Process is the total number of parts in the line.
                                                        </styled.ToolTipText>
                                                    </ReactTooltip>
                                                </Portal>
                                            </styled.Info>
                                            WIP: 
                                        </styled.ProcessStat>
                                        <styled.ProcessStat>{processWip[processId]}</styled.ProcessStat>
                                        
                                        <styled.ProcessStat style={{textAlign: 'right'}}>
                                            <styled.Info data-tip data-for="GPT-tooltip" className='far fa-question-circle'>
                                                <Portal>
                                                    <ReactTooltip id="GPT-tooltip" effect="solid" place="right" offset={{left: -10}}>
                                                        <styled.ToolTipText>
                                                            PCT - Process Cycle Time is the time it takes for each part to exit the process. This ideally determines (or is determined by) your takt time which regulates the rate that parts should be released into the line.
                                                        </styled.ToolTipText>
                                                    </ReactTooltip>
                                                </Portal>
                                            </styled.Info>
                                            PCT: 
                                        </styled.ProcessStat>
                                        <styled.ProcessStat>{convertSecondsToDHM(productionRate[processId])}</styled.ProcessStat>

                                        <styled.ProcessStat style={{textAlign: 'right'}}>
                                            <styled.Info data-tip data-for="MLT-tooltip" className='far fa-question-circle'>
                                                <Portal>
                                                    <ReactTooltip id="MLT-tooltip" effect="solid" place="right" offset={{left: -10}}>
                                                        <styled.ToolTipText>
                                                            MLT - Manufacturing Lead Time is the lead time for a single part when it is entered into the process. 
                                                        </styled.ToolTipText>
                                                    </ReactTooltip>
                                                </Portal>
                                            </styled.Info>
                                            MLT: 
                                        </styled.ProcessStat>
                                        <styled.ProcessStat>{convertSecondsToDHM(DPP[processId] + (processWip[processId] - 1)*productionRate[processId])}</styled.ProcessStat>
                                    </div>
                                </styled.ProcessHeader>

								<CardZone
									handleAddLotClick={handleAddLotClick}
									setSelectedCards={setSelectedCards}
									selectedCards={selectedCards}
									sortMode={sortMode}
									sortDirection={sortDirection}
									lotFilters={lotFilters}
									setShowCardEditor={setShowCardEditor}
									showCardEditor={showCardEditor}
									maxHeight={"50rem"}
									processId={processId}
									handleCardClick={handleCardClick}

                                    handleSetProcessWip={(val) => setProcessWip({...processWip, [processId]: val})}
                                    handleSetProductionRate={(val) => setProductionRate({...productionRate, [processId]: val})}
                                    handleSetDPP={(val) => setDPP({...DPP, [processId]: val})}
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
