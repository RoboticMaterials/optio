import React from 'react';
import { useSelector } from 'react-redux'

import RatsnestPath from './ratsnest_path';

const RatsNest = (props) => {

    const {
        map_id,
        d3Scale
    } = props;

    const processes = useSelector(state => state.processesReducer.processes);
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess);
    const mapProcesses = Object.values(processes)

    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingPosition = useSelector(state => state.positionsReducer.editingPosition)

    return (
        <>
            {!editingStation && !editingPosition &&
                mapProcesses.filter((process) => !selectedProcess || selectedProcess._id !== process._id).map((process, i) => process.routes.map((route,j) => (
                    <RatsnestPath key={`ratsnest-${i}-${j}`} route={route} d3Scale={d3Scale} id={`ratsnest-path-${route._id}`}/>
                )))
            }
        </>
    )
}

export default RatsNest;