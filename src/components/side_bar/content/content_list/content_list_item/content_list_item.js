import React, { useContext } from 'react';

import { ThemeContext } from 'styled-components';
import * as styled from '../content_list.style'

import ErrorTooltip from '../../../../basic/form/error_tooltip/error_tooltip'

// Import Constants
import { StationTypes } from '../../../../../constants/station_constants'
import { PositionTypes } from '../../../../../constants/position_constants'

const ContentListItem = (props) => {

    const {
        ind,
        error,
        element,
        schema,
        inQueue,

        showEdit,
        style,

        onClick,
        onIconClick,
        onEditClick,
        onMouseEnter,
        onMouseLeave,
    } = props;

    const theme = useContext(ThemeContext);

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

            case 'user':
                return 
        }
    }

    return (
        <>
            <styled.ListItem
                key={`li-${ind}`}
                error={error}
                onMouseEnter={() => onMouseEnter(element)}
                onMouseLeave={() => onMouseLeave(element)}
                onClick={onClick}
                style={style}
            >
                <styled.ListItemIconContainer style = {{paddingTop: element.type === "charger_position" ? '0.6rem': '0rem'}}>

                    {props.schema === 'locations' &&
                        <>
                            {renderLocationTypeIcon(element)}
                        </>
                    }

                    {element.type === 'user' && 
                        <styled.ListItemIcon
                            style = {{color: 'orange' }}
                            className='fas fa-user'
                        />
                    }


                    {props.schema === 'tasks' &&

                        <styled.ListItemIcon
                            style = {{color: inQueue === true ? 'grey' : 'lightGreen' }}
                            className='fas fa-play'
                            onClick={() => onIconClick(inQueue)}
                        />
                    }

                    {props.schema === 'processes' ? error ?
                        <div
                            onClick={() => onClick(element)}
                        >
                            <ErrorTooltip
                                visible={true}
                                text={'Process is broken, click to fix'}
                                ContainerComponent={styled.ErrorContainer}
                            />
                        </div>
                        :
                        <styled.ListItemIcon
                            className='fas fa-clone'
                            style={{ color: '#ffb62e' }}
                            onClick={() => onIconClick(element)}
                        />
                        :
                        <>
                        </>
                    }

                </styled.ListItemIconContainer>


                <styled.ListItemTitle schema={schema}>{element.name}</styled.ListItemTitle>



                <styled.ListItemIconContainer>

                    {showEdit &&
                        <styled.ListItemIcon
                            className='fas fa-edit'
                            onClick={() => onEditClick(element)}
                            style={{ color: theme.bg.quaternary }}
                        />
                    }


                </styled.ListItemIconContainer>

            </styled.ListItem>
        </>
    )
}

ContentListItem.defaultProps = {
    ind: 0,
    error: null,
    element: null,
    schema: null,
    inQueue: false,

    showEdit: true,
    style: {},

    onClick: () => {},
    onIconClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
}

export default ContentListItem;