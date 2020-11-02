// import external dependencies
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'

// components

// styles
import * as styled from "./list_view.style"

// import logger
import logger from '../../logger.js';
import {
    deleteLocationProcess,
    setSelectedLocation,
    setSelectedLocationChildrenCopy,
    setSelectedLocationCopy, sideBarBack
} from "../../redux/actions/locations_actions";
import {addPosition} from "../../redux/actions/positions_actions";
import {daysOfTheWeek} from "../../constants/scheduler_constants";
import ScheduleListItem from "../side_bar/content/scheduler/schedule_list/schedule_list_item/schedule_list_item";
import PropTypes from "prop-types";
import CreateScheduleForm from "../side_bar/content/scheduler/create_schedule_form/create_schedule_form";

const LocationList = (props) => {
    const {
        onMouseEnter,
        onMouseLeave,

    } = props

    const locations = useSelector(state => state.locationsReducer.locations)
    const locationsArr = Object.values(locations)
    const history = useHistory()

    const onClick = (item) => {
        console.log("item", item)
        history.push('/locations/' + item._id + '/' + "dashboards")
    }

    return(
        <styled.ListContainer>
            <styled.ListTitle>Locations</styled.ListTitle>
            <styled.ListScrollContainer>
                {locationsArr.length > 0 ?
                    locationsArr.map((item, index, arr) => {
                        const {
                            name,

                        } = item

                        return (
                            <styled.ListItem
                                key={`li-${index}`}
                                onMouseEnter={() => onMouseEnter(item)}
                                onMouseLeave={() => onMouseLeave(item)}
                            >
                                <styled.ListItemRect>
                                    <styled.ListItemTitle schema={"locations"} onClick={() => onClick(item)}>{name}</styled.ListItemTitle>
                                    "
                                </styled.ListItemRect>

                                {props.schema === 'tasks' &&
                                <styled.ListItemIcon
                                    className='fas fa-play'
                                    onClick={() => {

                                    }}
                                />
                                }

                            </styled.ListItem>
                        );
                    })
                    :
                    <div></div>
                }

            </styled.ListScrollContainer>
        </styled.ListContainer>

    )
}

LocationList.propTypes = {
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    name: PropTypes.string,

}

LocationList.defaultProps = {
    onMouseEnter: () => { },
    onMouseLeave: () => { },
    onClick: () => { },
    name: ""
}

const ListView = (props) => {
    const {

    } = props

    const dispatch = useDispatch()

    return (
        <styled.Container>
            <LocationList
            />


        </styled.Container>
    )
}

export default ListView;
