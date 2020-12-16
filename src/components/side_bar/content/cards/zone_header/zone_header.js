import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import React from "react";
import {useSelector} from "react-redux";

import * as styled from './zone_header.style'

const ZoneHeader = (props) => {

	const {
		selectedProcesses,
		setSelectedProcesses
	} = props

	const processes = useSelector(state => { return Object.values(state.processesReducer.processes) })

	return (
		<styled.Container>
			<DropDownSearch
				style={{width: "30rem",}}
				onClearAll={()=>{
					setSelectedProcesses([])
				}}
				multi
				values={selectedProcesses}
				options={processes}
				onChange={values => {
					console.log("onChange values",values)
					setSelectedProcesses(values)
				}}
				pattern={null}
				labelField={'name'}
				valueField={"_id"}
				onDropdownOpen={() => {
				}}
				onRemoveItem={(values)=> {
					console.log("onRemoveItem values",values)
					setSelectedProcesses(values)

				}}
			/>
		</styled.Container>
	)

}

export default ZoneHeader
