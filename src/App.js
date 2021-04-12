import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import { ThemeProvider } from "styled-components";
import theme from './theme';
import './App.css';

// Import Hooks
import useWindowSize from './hooks/useWindowSize'

import * as styled from './App.style'

// Import API
import { stopAPICalls } from './redux/actions/local_actions'

// import containers
import ApiContainer from './containers/api_container/api_container';
import StatusHeader from './containers/status_header/status_header';
import Logger from './containers/logger/logger';
import SideBar from './containers/side_bar/side_bar'
import MapView from './containers/map_view/map_view'
import HILModal from './containers/hil_modal/hil_modal'
import Authentication from './containers/authentication/authentication'
import Widgets from './components/widgets/widgets'
import ListView from "./components/list_view/list_view";
import ConfirmDeleteModal from './components/basic/modals/confirm_delete_modal/confirm_delete_modal'
import FirstSignIn from './components/firstSignIn/firstSignIn'
import Redirector from './components/redirector/redirector'

// Import actions
import { postLocalSettings, getLocalSettings } from './redux/actions/local_actions'

// Get Auth from amplify
import { Auth } from "aws-amplify";

// Amplify configuration globally
import Amplify from "aws-amplify";
import config from "./aws-exports";
import TaskQueueContainer from "./components/task_queue/task_queue_container";

Amplify.configure(config);

const widthBreakPoint = 1000;

const App = (props) => {

    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const hoveringInfo = useSelector(state => state.widgetReducer.hoverStationInfo)
    const maps = useSelector(state => state.mapReducer.maps)
    const sideBarOpen = useSelector(state => state.sidebarReducer.open)
    const mapViewEnabled = useSelector(state => state.localReducer.localSettings.mapViewEnabled)
    const getFailureCount = useSelector(state => state.taskQueueReducer.getFailureCount)
    const localSettings = useSelector(state => state.localReducer.localSettings)
    const authenticated = useSelector(state => state.localReducer.localSettings.authenticated)

    const dispatch = useDispatch()
    const dispatchStopAPICalls = (bool) => dispatch(stopAPICalls(bool))
    const dispatchGetLocalSettings = () => dispatch(getLocalSettings())
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

    const [loaded, setLoaded] = useState(false)
    const [apiLoaded, setApiLoaded] = useState(false)

    const [showSideBar, setShowSideBar] = useState(false)
    const [showStopAPIModal, setShowStopAPIModal] = useState(true)

    const [didCheckAuth, setDidCheckAuth] = useState(false)

    const size = useWindowSize()
    const windowWidth = size.width

    const mobileMode = windowWidth < widthBreakPoint;

    useEffect(() => {
      handleLoadLocalData();
    }, [])

    const handleLoadLocalData = async () => {
      await dispatchGetLocalSettings()
    }

    useEffect(() => {
        checkUser();

    }, []);

    const checkUser = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            if (user) {
                const fetchedSettings = await dispatchGetLocalSettings()

                await dispatchPostLocalSettings({
                    ...fetchedSettings,
                    authenticated: true,
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDidCheckAuth(true)
        }
    }


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
        } else {
            return null
        }
    }

    if (!didCheckAuth) return null

    return (
        <>
            <Logger />

            {/* <ThemeProvider theme={theme[this.state.theme]}> */}
            <ThemeProvider theme={theme['main']}>

                <styled.Container>
                    <ConfirmDeleteModal
                        isOpen={getFailureCount < 10 || showStopAPIModal === false ? false : true}
                        title={"Oops! It looks like the server is diconnected. Would you like to turn off updates from the backend?"}
                        button_1_text={"Yes"}
                        handleOnClick1={() => {
                            dispatchStopAPICalls(true)
                            setShowStopAPIModal(false)
                        }}
                        button_2_text={"No"}
                        handleOnClick2={() => {
                            setShowStopAPIModal(false)
                        }}
                        handleClose={() => {
                            setShowStopAPIModal(false)
                        }}
                    />
                    <BrowserRouter>
                        {/* Authentication */}
                        {!authenticated &&
                            <Route path="/" >
                                <Authentication mobileMode={mobileMode} />
                            </Route>
                        }

                        {!authenticated &&
                            <Route exact path="/organization" >
                                <FirstSignIn />
                            </Route>
                        }

                        {authenticated &&
                            <Route
                                path={["/locations/:stationID?/:widgetPage?", '/:sidebar?/:data1?/:data2?', '/',]}
                            >
                                <TaskQueueContainer/>
                                <ApiContainer styleMode={null} apiMode={null} mode={null} logMode={"DEV"} onLoad={() => setLoaded(true)} apiLoaded={() => setApiLoaded(true)} isApiLoaded={apiLoaded} />
                            </Route>
                        }

                          {loaded && authenticated && apiLoaded &&
                              <styled.ContentContainer>

                                  <styled.HeaderContainer>
                                      {mapViewEnabled ?
                                          <Route
                                              path={["/locations/:stationID?/:widgetPage?", '/']}
                                              component={StatusHeader}
                                          />
                                          :
                                          <> </>
                                      }
                                  </styled.HeaderContainer>

                                  <styled.BodyContainer>
                                      {/* Hides Side bar when in a dashboard in mobile mode */}
                                    { mapViewEnabled && 

                                          <Route
                                              path={["/:page?/:id?/:subpage?", '/']}
                                          >
                                              <SideBar
                                                showSideBar={sideBarOpen}
                                                setShowSideBar={setShowSideBar}
                                            />
                                        </Route>
                                    }

                                    <Route
                                        path={["/locations/:stationID/dashboards/:dashboardID?", '/']}
                                        component={HILModal}
                                    />

                                    {/* If there are no maps, then dont render mapview (Could cause an issue when there is no MIR map)
                                        And if the device is mobile, then unmount if widgets are open
                                    */}
                                    {maps.length > 0 &&
                                        <>
                                            {mapViewEnabled ?

                                                (mobileMode ?
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
                                                )

                                                :

                                                <Route
                                                    path={["/locations/:stationID?/:widgetPage?", '/']}
                                                    component={ListView}
                                                />


                                            }
                                        </>
                                    }


                                    {/* Widgets are here in mobile mode. If not in mobile mode, then they are in map_view.
                                    The reasoning is that the map unmounts when in a widget while in mobile mode (for performance reasons).
                                    So they need to be here. */}
                                    {hoveringInfo !== null && mobileMode &&
                                        <Route
                                            path={["/locations/:stationID?/:widgetPage?", '/', "/locations/:deviceID?/:widgetPage?"]}
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

export default App
