import React, { useState } from 'react';
import { BrowserRouter, Route, IndexRoute, Link, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux'

import { ThemeProvider } from "styled-components";
import theme from './theme';
import './App.css';
import ViewerPage from "./components/widgets/widget_pages/viewer_page/viewer_page";

import useWindowSize from './hooks/useWindowSize'

// import logger
import logger, { disableAll } from './logger.js';

import * as styled from './App.style'

// import containers
import ApiContainer from './containers/api_container/api_container';
import StatusHeader from './containers/status_header/status_header';
import PageErrorBoundary from './containers/page_error_boundary/page_error_boundary';
import Logger from './containers/logger/logger';
import SideBar from './containers/side_bar/side_bar'
import MapView from './containers/map_view/map_view'
import HILModal from './containers/hil_modal/hil_modal'
import Authentication from './containers/authentication/authentication'
import Widgets from './components/widgets/widgets'

const widthBreakPoint = 1000;

// class App extends Component {

const App = (props) => {

    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const hoveringInfo = useSelector(state => state.locationsReducer.hoverStationInfo)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const maps = useSelector(state => state.mapReducer.maps)
    const dashboardOpen = useSelector(state => state.dashboardsReducer.dashboardOpen)
    const positions = useSelector(state => state.locationsReducer.positions)

    // Set to true for the time being, authentication is not 100% complete as of 09/14/2020
    const [authenticated, setAuthenticated] = useState(true)

    const [loaded, setLoaded] = useState(false)
    const [apiLoaded, setApiLoaded] = useState(false)
    const [stateTheme, setStateTheme] = useState('main')

    const [showSideBar, setShowSideBar] = useState(false)

    const size = useWindowSize()
    const windowWidth = size.width

    const mobileMode = windowWidth < widthBreakPoint;

    /**
     * This handles Map view in mobile mode
     * Unmounts the map if widget pages is open
     */
    const handleMobileMapView = () => {

        if (!widgetPageLoaded) {
            return (
                <Route
                    path={["/locations/:stationID?/:widgetPage?", '/']}>
                    <MapView mobileMode={mobileMode} />
                </Route>
            )
        }

        else {
            return null
        }

    }
    return (
        <>
            <Logger />

            {/* <ThemeProvider theme={theme[this.state.theme]}> */}
            <ThemeProvider theme={theme[stateTheme]}>

                <styled.Container>
                    <BrowserRouter>


                        <Route
                            path={["/locations/:stationID?/:widgetPage?", '/:sidebar?', '/']}
                        >
                            <ApiContainer styleMode={null} apiMode={null} mode={null} logMode={"DEV"} onLoad={() => setLoaded(true)} apiLoaded={() => setApiLoaded(true)} isApiLoaded={apiLoaded} />
                        </Route>

                        {/* If all the API's have been loaded, but the user has not been authenticate then show the Authentication Screen */}
                        {loaded && !authenticated &&
                            <Authentication authenticated={() => setAuthenticated(true)} />
                        }


                        {loaded && authenticated && apiLoaded &&
                            <styled.ContentContainer>

                                {/* If in mobile mode and dashboard is open (set in dashboard screens), don't mount the header; dashboard screen should be in full screen on mobile devices. If not in mobile mode, always mount header. */}
                                <styled.HeaderContainer>
                                    {mobileMode ?
                                        dashboardOpen ?
                                            <></>
                                            :
                                            <Route
                                                path={["/locations/:stationID?/:widgetPage?", '/']}
                                                component={StatusHeader}
                                            />
                                        :
                                        <Route
                                            path={["/locations/:stationID?/:widgetPage?", '/']}
                                            component={StatusHeader}
                                        />
                                    }
                                </styled.HeaderContainer>



                                <styled.BodyContainer>
                                    <ViewerPage/>
                                    {/* Hides Side bar when in a dashboard in mobile mode */}
                                    {mobileMode ?
                                        dashboardOpen ?
                                            <></>
                                            :
                                            <SideBar
                                                showSideBar={showSideBar}
                                                setShowSideBar={setShowSideBar}
                                            />
                                        :
                                        <SideBar
                                            showSideBar={showSideBar}
                                            setShowSideBar={setShowSideBar}
                                        />
                                    }

                                    <Route
                                        path={["/locations/:stationID/dashboards/:dashboardID?", '/']}
                                        component={HILModal}
                                    />

                                    {/* If there is no maps, then dont render mapview (Could cause an issue when there is no MIR map)
                                        And if the device is mobile, then unmount if widgets are open
                                    */}
                                    {maps.length > 0 &&
                                        <>
                                            {mobileMode ?
                                                <Route
                                                    path={["/locations/:stationID?/:widgetPage?", '/']}
                                                >
                                                    {handleMobileMapView()}
                                                </Route>
                                                :
                                                <Route
                                                    path={["/locations/:stationID?/:widgetPage?", '/']}
                                                    component={MapView}
                                                />
                                            }
                                        </>
                                    }

                                    {/* <Route
                                        path="/locations/:locationID?/:widgetPage?"
                                        component={WidgetPages}
                                    /> */}

                                    {/* Widgets are here in mobile mode. If not in mobile mode, then they are in map_view. 
                                    The reasoning is that the map unmounts when in a widget while in mobile mode (for performance reasons). 
                                    So they need to be here. */}
                                    {hoveringInfo !== null && mobileMode &&
                                        <Route
                                            path={["/locations/:stationID?/:widgetPage?", '/']}
                                            component={Widgets}
                                        />
                                    }

                                </styled.BodyContainer>

                            </styled.ContentContainer>
                        }

                    </BrowserRouter>
                </styled.Container>
            </ThemeProvider>
        </>
    );

}

export default App;
