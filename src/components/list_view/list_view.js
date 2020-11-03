// import external dependencies
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Route, useHistory} from 'react-router-dom'

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
import Widgets from "../widgets/widgets";
import DashboardsPage from "../widgets/widget_pages/dashboards_page/dashboards_page";
import Settings from "../side_bar/content/settings/settings";
import BounceButton from "../basic/bounce_button/bounce_button";

const LocationList = (props) => {
    const {
        onMouseEnter,
        onMouseLeave,
        setShowDashboards

    } = props

    const locations = useSelector(state => state.locationsReducer.stations)
    const locationsArr = Object.values(locations)
    const history = useHistory()

    const onClick = (item) => {
        console.log("item", item)
        history.push('/locations/' + item._id + '/' + "dashboards")
        setShowDashboards(true)
    }

    return(
        <styled.ListContainer>

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
    const history = useHistory()
    const [showDashboards, setShowDashboards] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const { widgetPage } = props.match.params


    const title = (showDashboards ) ? "Dashboards" :
        showSettings ? "Settings" : "Locations"

    useEffect(() => {

        if(widgetPage) {
            setShowDashboards(true)
        }

        else {
            setShowDashboards(false)
        }

    }, [widgetPage])



    return (
        <styled.Container>
            <styled.Header>
                {(showDashboards) ?
                    <BounceButton
                        color={"black"}
                        onClick={()=> {
                            setShowDashboards(false)
                            history.push('/locations')
                        }}
                        containerStyle={{
                            width: "3rem",
                            height: "3rem",
                            position: "relative"
                        }}
                    >
                        <styled.Icon2
                            className={"fa fa-times"}
                        />
                    </BounceButton>
                :
                    <BounceButton
                        color={"black"}
                        onClick={()=> {
                            setShowSettings(!showSettings)
                        }}
                        active={showSettings}
                        containerStyle={{
                            width: "3rem",
                            height: "3rem",
                            position: "relative"
                        }}
                    >
                        <styled.Icon2
                            className={!showSettings ? "fa fa-cog" : "fa fa-times"}
                        />
                    </BounceButton>
                }
                <styled.Title>{title}</styled.Title>
            </styled.Header>


            {(!showDashboards && !showSettings) &&
                <LocationList
                    setShowDashboards={setShowDashboards}
                />
            }


            {(showDashboards && !showSettings) &&

                    <Route
                        path="/locations/:stationID/dashboards/:dashboardID?/:editing?"
                        component={DashboardsPage}
                    />

            }

            {showSettings &&
                <Settings/>
            }




        </styled.Container>
    )
}

export default ListView;
