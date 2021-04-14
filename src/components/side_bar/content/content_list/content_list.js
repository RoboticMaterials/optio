import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Import Styles
import * as styled from './content_list.style'
import theme from '../../../../theme'

// Import Components
import ContentHeader from '../content_header/content_header'
import ErrorTooltip from '../../../basic/form/error_tooltip/error_tooltip'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'

// Import Constants
import { StationTypes } from '../../../../constants/station_constants'
import { PositionTypes } from '../../../../constants/position_constants'
import {isOnlyHumanTask} from "../../../../methods/utils/route_utils";


export default function ContentList(props) {

    const {
        executeTask,
        hideHeader,
        handleCardView,
        elements,
    } = props

    let taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)


    const renderLocationTypeIcon = (element) => {

        const LocationTypes ={
            ...StationTypes,
            ...PositionTypes,
        }

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
                        <>
                            <styled.ListItem
                                key={`li-${ind}`}
                                error={error}
                                onMouseEnter={() => props.onMouseEnter(element)}
                                onMouseLeave={() => props.onMouseLeave(element)}
                            >
                                <styled.ListItemIconContainer style = {{paddingTop: element.type === "charger_position" ? '0.6rem': '0rem'}}>

                                    {props.schema === 'locations' &&
                                        <>
                                            {renderLocationTypeIcon(element)}
                                        </>
                                    }


                                    {props.schema === 'tasks' &&

                                        <styled.ListItemIcon
                                            style = {{color: inQueue === true ? 'grey' : 'lightGreen' }}
                                            className='fas fa-play'
                                            onClick={() => {
                                                !inQueue && executeTask()
                                            }}
                                        />
                                    }

                                    {props.schema === 'processes' ? error ?
                                        <div
                                            onClick={() => props.onClick(element)}
                                        >
                                            <ErrorTooltip
                                                visible={true}
                                                text={'Process is broken, click to fix'}
                                                ContainerComponent={styled.ErrorContainer}
                                            />
                                        </div>
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
                                        style={{ color: theme.main.bg.quaternary }}
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
