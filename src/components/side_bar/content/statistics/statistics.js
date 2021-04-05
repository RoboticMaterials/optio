import React, { useEffect, useState, useRef, useContext, memo } from 'react';
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

// Import Styles
import * as styled from './statistics.style'

// Import Components 
import StationColumns from './station_columns/station_columns'

const Statistics = () => {


    let params = useParams()
    const {
        page,
        subpage,
        id
    } = params

    const processes = useSelector(state => state.processesReducer.processes)

    useEffect(() => {

        return () => {

        }
    }, [])


    const renderStationColumns = () => {

        let processesToRender = []

        // If just in process page, push the current process
        if (page === 'processes') {
            processesToRender.push(id)
        }
        // Else push all processes
        else {

        }

        return processesToRender.map((processId) => {
            return (
                <StationColumns processId={processId} />
            )
        })


    }

    return (
        <styled.Container>
            {renderStationColumns()}
        </styled.Container>
    )


}

export default Statistics