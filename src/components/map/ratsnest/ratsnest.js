import React from 'react';
import { useSelector } from 'react-redux'

import RatsnestPath from './ratsnest_path';

const RatsNest = (props) => {

    const {
        map_id,
        d3Scale
    } = props;

    const processes = useSelector(state => state.processesReducer.processes);
    const mapProcesses = Object.values(processes).filter(process => process.map_id === map_id)

    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingPosition = useSelector(state => state.positionsReducer.editingPosition)

    return (
        <>
            {!editingStation && !editingPosition &&
                mapProcesses.map(process => process.routes.map(route => (
                    <RatsnestPath route={route} d3Scale={d3Scale} id={`ratsnest-path-${route._id}`}/>
                )))
            }
        </>
    )
}

export default RatsNest;