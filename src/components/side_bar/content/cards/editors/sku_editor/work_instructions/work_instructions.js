import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";

import * as styled from './work_instructions.style'
import ProcessWorkInstructions from "./process_work_intructions/process_work_intructions";
import {getProcessStations} from "../../../../../../../methods/utils/processes_utils";

const WorkInstructions = props => {

    const {
        workInstructions
    } = props

    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const tasks = useSelector(state => { return state.tasksReducer.tasks }) || {}

    const renderProcesses = () => {
        // console.log('asdasds')
        return Object.values(processes).map(process => {
            const {
                name,
                _id: processId,
                routes
            } = process

            const stations = getProcessStations(process, tasks)

            return(
                <ProcessWorkInstructions
                    key={processId}
                    workInstructions={workInstructions[processId]}
                    containerStyle={{margin: '1rem 0'}}
                    name={name}
                    stationIds={Object.keys(stations)}
                    processId={processId}
                />
            )
        })
    }
    return (
        <div style={{}}>
            {renderProcesses()}
        </div>
    );
};

WorkInstructions.propTypes = {
    workInstructions: PropTypes.object
};

WorkInstructions.defaultProps = {
    workInstructions: {}
};

export default WorkInstructions;