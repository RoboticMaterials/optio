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

    return (
        <>
            {
                mapProcesses.map(process => process.routes.map(route => (
                    <RatsnestPath route={route} d3Scale={d3Scale} />
                )))
            }
        </>
    )
}

export default RatsNest;