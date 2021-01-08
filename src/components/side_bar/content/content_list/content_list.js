import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Import Styles
import * as styled from './content_list.style'

// Import Components
import ContentHeader from '../content_header/content_header'
import ErrorTooltip from '../../../basic/form/error_tooltip/error_tooltip'

// Import Utils
import { LocationTypes } from '../../../../methods/utils/locations_utils'
import { deepCopy } from '../../../../methods/utils/utils'


export default function ContentList(props) {

    const {
        executeTask,
        hideHeader,
        handleCardView,
    } = props

    let taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const [inQueue, setInQueue] = useState(false)


    const handleInQueue = (element) => {
        setInQueue(false)
        if (!!element) {

            Object.values(taskQueue).forEach((taskQueueItem, ind) => {
                if (element._id === taskQueueItem.task_id) {
                    setInQueue(true)
                }
            })
        }
        return inQueue
    }

    const renderLocationTypeIcon = (element) => {

        switch (element.type) {
                
            case 'charger_position':
                return (
                    <styled.LocationTypeGraphic fill={LocationTypes['shelf_position'].color} stroke={LocationTypes['shelf_position'].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        {LocationTypes['charger_position'].svgPath}
                    </styled.LocationTypeGraphic>
                )

            case 'shelf_position':
                return (
                    <styled.LocationTypeGraphic fill={LocationTypes['shelf_position'].color} stroke={LocationTypes['shelf_position'].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        {LocationTypes['shelf_position'].svgPath}
                    </styled.LocationTypeGraphic>
                )

            case 'warehouse':
                return (
                    <styled.LocationTypeGraphic fill={LocationTypes['warehouse'].color} stroke={LocationTypes['warehouse'].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        {LocationTypes['warehouse'].svgPath}
                    </styled.LocationTypeGraphic>
                )

            case 'human':
                return (
                    <styled.LocationTypeGraphic fill={LocationTypes['human'].color} stroke={LocationTypes['human'].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        {LocationTypes['human'].svgPath}
                    </styled.LocationTypeGraphic>
                )

            case 'cart_position':
                return (
                    <styled.LocationTypeGraphic fill={LocationTypes['cart_position'].color} stroke={LocationTypes['cart_position'].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        {LocationTypes['cart_position'].svgPath}
                    </styled.LocationTypeGraphic>
                )
        }
    }


    return (
        <styled.Container>

            {!hideHeader &&
                <ContentHeader content={props.schema} onClickAdd={props.onPlus} />
            }

            <styled.List>
                {props.elements.map((element, ind) => {
                    const error = (props.schema === 'processes' && element.broken) ? true : false
                    return (
                        <>
                            <styled.ListItem
                                key={`li-${ind}`}
                                error={error}
                                onMouseEnter={() => props.onMouseEnter(element)}
                                onMouseLeave={() => props.onMouseLeave(element)}
                            >
                                <styled.ListItemIconContainer style={{ width: '15%' }} >

                                    {props.schema === 'locations' &&
                                        <>
                                            {renderLocationTypeIcon(element)}
                                        </>
                                    }


                                    {props.schema === 'tasks' &&

                                        <styled.ListItemIcon
                                            className='fas fa-play'
                                            onClick={() => {
                                                executeTask()
                                            }}
                                        />
                                    }

                                    {props.schema === 'processes' ? error ?
                                        <ErrorTooltip
                                            visible={true}
                                            text={'Process is broken, click to fix'}
                                            ContainerComponent={styled.ErrorContainer}
                                            onClick={() => props.onClick(element)}

                                        />
                                        :

                                        <styled.ListItemIcon
                                            className='far fa-clone'
                                            style={{ color: '#ffb62e' }}
                                            onClick={() => {
                                                handleCardView(element)
                                            }}
                                        />
                                        :
                                        <>
                                        </>
                                    }

                                </styled.ListItemIconContainer>


                                <styled.ListItemTitle schema={props.schema}>{element.name}</styled.ListItemTitle>



                                <styled.ListItemIconContainer>

                                    <styled.ListItemIcon
                                        className='fas fa-edit'
                                        onClick={() => props.onClick(element)}
                                        style={{ color: '#c6ccd3' }}
                                    />


                                </styled.ListItemIconContainer>

                            </styled.ListItem>
                        </>
                    )
                })}
            </styled.List>
        </styled.Container>

    )
}
