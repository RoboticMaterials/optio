import * as styled from "./summary_zone.style";
import React, {useEffect, useRef, useState} from "react";
import {SortableContainer} from "react-sortable-hoc";
import CardZone from "../card_zone/card_zone";
import {useDispatch, useSelector} from "react-redux";
import ZoneHeader from "../zone_header/zone_header";
import {setSize} from "../../../../../redux/actions/card_page_actions";


const SummaryZone = SortableContainer((props) => {

	const {
		zoneRef,
		handleCardClick,
		setShowCardEditor,
		showCardEditor,
	} = props

	const dispatch = useDispatch()

	const processes = useSelector(state => { return Object.values(state.processesReducer.processes) })

	const [selectedProcesses, setSelectedProcesses] = useState(processes)

	return(
		<styled.Container  >
			<ZoneHeader
				selectedProcesses={selectedProcesses}
				setSelectedProcesses={setSelectedProcesses}
			/>
			<styled.ProcessesContainer ref={zoneRef}>
				{selectedProcesses.map((currProcess, processIndex) => {
					const {
						name: processName,
						_id: processId
					} = currProcess
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
				})}
			</styled.ProcessesContainer>

		</styled.Container>
	)





})

export default SummaryZone

