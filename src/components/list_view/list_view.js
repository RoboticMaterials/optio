// import external dependencies
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Route, useHistory} from 'react-router-dom'

// components
import DashboardsPage from "../widgets/widget_pages/dashboards_page/dashboards_page";
import Settings from "../side_bar/content/settings/settings";
import LocationList from './location_list/location_list'
import BounceButton from "../basic/bounce_button/bounce_button";

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

    const history = useHistory()
    const { widgetPage } = props.match.params

    const locations = useSelector(state => state.locationsReducer.stations)
    const devices = useSelector(state => state.devicesReducer.devices)
    
    const [showDashboards, setShowDashboards] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const CURRENT_SCREEN = (showDashboards ) ? SCREENS.DASHBOARDS :
        showSettings ? SCREENS.SETTINGS : SCREENS.LOCATIONS

    const title = CURRENT_SCREEN.title

    useEffect(() => {
        // displays dashboards page if url is on widget page
        if(widgetPage) {
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
                        <styled.Icon
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
                        <styled.Icon
                            className={!showSettings ? "fa fa-cog" : "fa fa-times"}
                        />
                    </BounceButton>
                }
                <styled.Title schema={CURRENT_SCREEN.schema}>{title}</styled.Title>
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
                <Settings/>
            }
        </styled.Container>
    )
}

export default ListView;
