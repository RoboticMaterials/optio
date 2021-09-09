import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Import Styles
import * as styled from './content_list.style'

// Import Components
import ContentHeader from '../content_header/content_header'
import ContentListItem from './content_list_item/content_list_item'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'


import {isOnlyHumanTask} from "../../../../methods/utils/route_utils";


export default function ContentList(props) {

    const {
        executeTask,
        hideHeader,
        handleCardView,
        elements,
        schema,

        onClick,
        onMouseEnter,
        onMouseLeave,
    } = props

    // const processes = useSelector(state => state.processesReducer.processes)
    // const routes = useSelector(state => state.tasksReducer.tasks)
    // console.log(Object.values(processes)[0].routes.map(routeId => routes[routeId]))

    let taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const handleIconClick = useMemo(() => {
        switch (schema) {
            case 'locations':
                return () => {};
            case 'tasks':
                return (inQ) => !inQ && executeTask();
            case 'processes':
                return (element) => handleCardView(element);

        }
    }, [schema])

    return (
        <styled.Container>

            {!hideHeader &&
                <ContentHeader content={props.schema} onClickAdd={props.onPlus} />
            }

            <styled.List>
                {elements.map((element, ind) => {
                    const error = (props.schema === 'processes' && element.broken) ? true : false
                    let inQueue = false
                    Object.values(taskQueue).forEach((item) => {

                    if((item.task_id == element._id) && (props.schema === 'tasks')){
                        if(isOnlyHumanTask(element) && element.handoff === true) {
                            inQueue = false
                        }
                        else {
                            inQueue = true
                        }
                    }
                    })

                    return (
                        <ContentListItem 
                            onIconClick={handleIconClick}
                            onEditClick={onClick}

                            ind={ind}
                            error={error}
                            element={element}
                            schema={schema}
                            inQueue={inQueue}

                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        />
                    )
                })}
            </styled.List>
        </styled.Container>

    )
}
