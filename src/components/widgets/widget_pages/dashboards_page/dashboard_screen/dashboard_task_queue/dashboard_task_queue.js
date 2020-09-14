import React, { Component, useState, useRef } from 'react';
import * as styled from './dashboard_task_queue.style'

import useOnClickOutside from '../../../../../../hooks/useOnClickOutside'

import theme from '../../../../../../theme'

import TaskQueue from '../../../../../task_queue/task_queue'

const DashboardTaskQueue = () => {

    // Ref for click outside
    const ref = useRef()

    const [showTaskQ, setShowTaskQ] = useState(false)

    useOnClickOutside(ref, () => setShowTaskQ(false))

    const path = `
        M 1000 0 
        Q 1000 80 910 140 
        Q 450 500 910 860 
        Q 1000 920 1000 1000 
    `
    return (
        <>
            <styled.ExpandContainer showTaskQ={showTaskQ}>
                <styled.ExpandIcon className={'fa fa-tasks'} onClick={() => { setShowTaskQ(!showTaskQ) }} />

                <styled.ExpandSVG viewBox='0 0 1000 1000'>
                    <styled.ExpandPath d={path} fill={theme.main.bg.quinary} onClick={() => { setShowTaskQ(!showTaskQ) }} />
                </styled.ExpandSVG>



                {/* <styled.ExpandIcon className={'fas fa-chevron-' + (!!showTaskQ ? 'right' : 'left')} /> */}

            </styled.ExpandContainer>

            {showTaskQ &&
                <styled.TaskQContatiner ref={ref}>
                    <styled.Title schema={'taskQueue'}>Task Queue</styled.Title>

                    <TaskQueue />
                </styled.TaskQContatiner>
            }
        </>
    )
}

export default DashboardTaskQueue