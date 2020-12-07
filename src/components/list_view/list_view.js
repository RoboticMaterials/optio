// import external dependencies
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory, useParams } from 'react-router-dom'

// components
import DashboardsPage from "../widgets/widget_pages/dashboards_page/dashboards_page";
import Settings from "../side_bar/content/settings/settings";
import LocationList from './location_list/location_list'
import BounceButton from "../basic/bounce_button/bounce_button";

// Import hooks
import useWindowSize from '../../hooks/useWindowSize'

// Import actions
import { postStatus } from '../../redux/actions/status_actions'

// Import Utils
import { deepCopy } from '../../methods/utils/utils'

// styles
import * as styled from "./list_view.style"

// import logger
import log from '../../logger.js';

const logger = log.getLogger("ListView")

const SCREENS = {
    LOCATIONS: {
        title: "Locations",
        schema: "locations"
    },
    SETTINGS: {
        title: "Settings",
        schema: "settings"
    },
    DASHBOARDS: {
        title: "Dashboards",
        schema: "locations"
    },
}

const ListView = (props) => {
    const {

    } = props

    const dispatch = useDispatch()
    const history = useHistory()
    const params = useParams()
    const { widgetPage } = props.match.params

    const size = useWindowSize()
    const windowWidth = size.width
    const widthBreakPoint = 1025

    const locations = useSelector(state => state.locationsReducer.stations)
    const positions = useSelector(state => state.locationsReducer.positions)
    const devices = useSelector(state => state.devicesReducer.devices)
    const status = useSelector(state => state.statusReducer.status)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)

    const onPostStatus = (status) => dispatch(postStatus(status))

    const [showDashboards, setShowDashboards] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const CURRENT_SCREEN = (showDashboards) ? SCREENS.DASHBOARDS :
        showSettings ? SCREENS.SETTINGS : SCREENS.LOCATIONS

    const title = CURRENT_SCREEN.title


    let pause_status = ''

    // If there's no status available then set to blank object.
    try {
        pause_status = status.pause_status;
    } catch (e) {
        pause_status = status.pause_status;
    }

    // Handles the icon type being displayed based on the pause_status in status
    var playButtonClassName = "fas fa-";
    pause_status ? playButtonClassName += 'play' : playButtonClassName += 'pause';

    useEffect(() => {
        // displays dashboards page if url is on widget page
        if (widgetPage) {
            setShowDashboards(true)
        }

        // hides dashboards page if url is NOT on widget page
        else {
            setShowDashboards(false)
        }

    }, [widgetPage])

    const onLocationClick = (item) => {
        history.push('/locations/' + item._id + '/' + "dashboards")
        setShowDashboards(true)
    }

    // Handles the play pause button
    const handleTogglePlayPause = async () => {

        //Flip the status to the opposite of the current value when the button is pressed
        var status_clone = deepCopy(status);
        const pause_status = !status_clone.pause_status;

        //Post the status to the API
        await onPostStatus({ pause_status: pause_status });
    }


    const handleTaskQueueStatus = () => {

        // return (
        //     <styled.StatusContainer>
        //         <p>Distance to Station 3 is 30m</p>
        //     </styled.StatusContainer>
        // )
        return Object.values(taskQueue).map((item, ind) => {

            // If the item has an owner that means that task is being executed
            if (!!item.owner) {

                // If the station is a device and the task q owner is that device then show the status
                if (!!devices[params.stationID] && item.owner === devices[params.stationID]._id) {

                    let locationName = ''

                    if(!!item.custom_task){
                        locationName = positions[item.custom_task.position].name
                    }
                    else if(!!item.next_position){
                        locationName = positions[item.next_position].name
                    }

                    return (
                        <styled.StatusContainer>
                            <p>{`Distance to ${locationName} - ${Math.floor(devices[item.owner].distance_to_next_target)}m`}</p>
                        </styled.StatusContainer>
                    )

                }
            }
        })
    }


    return (
        <styled.Container>
            <styled.Header>
                {(showDashboards) ?
                    <BounceButton
                        color={"black"}
                        onClick={() => {
                            setShowDashboards(false)
                            history.push('/locations')
                        }}
                        containerStyle={{
                            width: "3rem",
                            height: "3rem",
                            position: "relative"
                        }}
                    >
                        <styled.Icon
                            className={"fa fa-times"}
                        />
                    </BounceButton>
                    :
                    <BounceButton
                        color={"black"}
                        onClick={() => {
                            setShowSettings(!showSettings)
                        }}
                        active={showSettings}
                        containerStyle={{
                            width: "3rem",
                            height: "3rem",
                            position: "relative"
                        }}
                    >
                        <styled.Icon
                            className={!showSettings ? "fa fa-cog" : "fa fa-times"}
                        />
                    </BounceButton>
                }
                <styled.Title schema={CURRENT_SCREEN.schema}>{title}</styled.Title>
                {handleTaskQueueStatus()}

                <styled.PlayButton
                    play={pause_status}
                    windowWidth={windowWidth}
                    widthBreakPoint={widthBreakPoint}
                >
                    <styled.PlayButtonIcon play={pause_status} className={playButtonClassName} onClick={handleTogglePlayPause}></styled.PlayButtonIcon>
                </styled.PlayButton>

            </styled.Header>


            {(!showDashboards && !showSettings) &&
                <LocationList
                    onLocationClick={onLocationClick}
                />
            }

            {(showDashboards && !showSettings) &&
                // must be wrapped in route to give dashboards page the match params
                <Route
                    path="/locations/:stationID/dashboards/:dashboardID?/:editing?"
                    component={DashboardsPage}
                />
            }

            {showSettings &&
                <Settings />
            }
        </styled.Container>
    )
}

export default ListView;
