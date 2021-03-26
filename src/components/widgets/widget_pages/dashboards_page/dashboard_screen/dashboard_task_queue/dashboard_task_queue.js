import React, { useState, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as styled from './dashboard_task_queue.style'
import { ThemeContext } from 'styled-components'

import useOnClickOutside from '../../../../../../hooks/useOnClickOutside'


import TaskQueue from '../../../../../task_queue/task_queue'

const DashboardTaskQueue = () => {

    // Ref for click outside
    const ref = useRef()
    const mapViewEnabled = useSelector(state => state.localReducer.localSettings.mapViewEnabled)

    const [showTaskQ, setShowTaskQ] = useState(false)

    useOnClickOutside(ref, () => setShowTaskQ(false))

    const theme = useContext(ThemeContext);

    const path = `
        M 1000 0
        Q 1000 80 910 140
        Q 450 500 910 860
        Q 1000 920 1000 1000
    `
    return (
        <>
            {!showTaskQ ?

                <styled.ExpandContainer showTaskQ={showTaskQ}>
                    <styled.ExpandIcon mapViewEnabled = {mapViewEnabled} style={{color: theme.bg.primary}} className={'fa fa-tasks'} onClick={() => { setShowTaskQ(!showTaskQ) }} />

                    <styled.ExpandSVG mapViewEnabled = {mapViewEnabled} viewBox='0 0 1000 1000'>
                        <styled.ExpandPath d={path} fill={theme.bg.quinary} onClick={() => { setShowTaskQ(!showTaskQ) }} />
                    </styled.ExpandSVG>


                    {/* <styled.ExpandIcon className={'fas fa-chevron-' + (!!showTaskQ ? 'right' : 'left')} /> */}

                </styled.ExpandContainer>

                :

                <styled.TaskQContatiner showTaskQ={showTaskQ} ref={ref}>
                    <styled.Title schema={'taskQueue'}>Task Queue</styled.Title>
                    <styled.CloseButton
                        className={'fas fa-times'}
                        onClick={() => { setShowTaskQ(!showTaskQ) }}
                    />


                    <TaskQueue />
                </styled.TaskQContatiner>
            }
        </>
    )
}

export default DashboardTaskQueue
