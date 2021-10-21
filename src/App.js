import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import { ThemeProvider } from "styled-components";
import theme from './theme';
import './App.css';
import 'rc-time-picker/assets/index.css';


// Import Hooks
import useWindowSize from './hooks/useWindowSize'

import * as styled from './App.style'

// Import API
import { getLocalSettings } from './redux/actions/local_actions'

// import containers
import ApiContainer from './containers/api_container/api_container';

const ListView = lazy(() => import('./components/list_view/list_view'))
const Widgets = lazy(() => import('./components/widgets/widgets'))
const Authentication = lazy(() => import('./containers/authentication/authentication'))
const Logger = lazy(() => import('./containers/logger/logger'))
const MapView = lazy(()=> import('./containers/map_view/map_view'))
const StatusHeader = lazy(() => import('./containers/status_header/status_header'))
const SideBar = lazy(() => import('./containers/side_bar/side_bar'))
const PageErrorBoundary = lazy(() => import('./containers/page_error_boundary/page_error_boundary'))

const widthBreakPoint = 1000;

const App = () => {

    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const hoveringInfo = useSelector(state => state.widgetReducer.hoverStationInfo)
    const maps = useSelector(state => state.mapReducer.maps)
    const sideBarOpen = useSelector(state => state.sidebarReducer.open)
    const mapViewEnabled = useSelector(state => state.localReducer.localSettings.mapViewEnabled)
    const authenticated = useSelector(state => state.localReducer.authenticated)
    const dispatch = useDispatch()
    const dispatchGetLocalSettings = () => dispatch(getLocalSettings())

    const [loaded, setLoaded] = useState(false)
    const [apiLoaded, setApiLoaded] = useState(false)

    const [showSideBar, setShowSideBar] = useState(false)

    const size = useWindowSize()
    const windowWidth = size.width
    const mobileMode = windowWidth < widthBreakPoint;

    useEffect(() => {
      handleLoadLocalData();
    }, [])

    const handleLoadLocalData = async () => {
      await dispatchGetLocalSettings()
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
        }

        else {
            return null
        }

    }

    // Used to clear local settings just in case the page cant be loaded anymore
    // const handleClearLocalSettings = () => {
    //     deleteLocalSettings()
    //     return (
    //         <>
    //         </>
    //     )
    // }

    return (
        <Suspense fallback = {<></>}>
            <Logger />


              {/* <ThemeProvider theme={theme[this.state.theme]}> */}
              <ThemeProvider theme={theme['main']}>

                <styled.Container>
                    <BrowserRouter>
                        <PageErrorBoundary>
                            <>
                                {/* Authentication */}
                                {!authenticated && 
                                    <Route path="/" >
                                        <Authentication mobileMode={mobileMode} />
                                    </Route>
                                }

                                {authenticated &&
                                    <Route
                                        path={["/locations/:stationID?/:widgetPage?", '/:sidebar?/:data1?/:data2?', '/',]}
                                    >
                                        <ApiContainer styleMode={null} apiMode={null} mode={null} logMode={"DEV"} onLoad={() => setLoaded(true)} apiLoaded={() => setApiLoaded(true)} isApiLoaded={apiLoaded} />
                                    </Route>
                                }

                                {loaded && authenticated && apiLoaded &&
                                    <styled.ContentContainer>

                                        <styled.HeaderContainer>
                                            {mapViewEnabled && !mobileMode ?
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
                                            {mapViewEnabled && !mobileMode ?
                                                // mobileMode ?
                                                // dashboardOpen ?
                                                //     <></>
                                                //     :

                                                <Route
                                                    path={["/:page?/:id?/:subpage?", '/']}
                                                >
                                                    <SideBar
                                                        showSideBar={sideBarOpen}
                                                        setShowSideBar={setShowSideBar}
                                                    />
                                                </Route>
                                                :
                                                <></>
                                            }

                                            {/* If there are no maps, then dont render mapview (Could cause an issue when there is no MIR map)
                                                And if the device is mobile, then unmount if widgets are open
                                            */}
                                            {!!maps && maps.length > 0 &&
                                                <>
                                                    {mapViewEnabled && !mobileMode ?

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
                                                            path={["/locations/:stationID/dashboards/:dashboardID?/:editing?/:lotID?/:warehouseID?", '/']}
                                                            component={ListView}
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
                                                    path={["/locations/:stationID?/:widgetPage?", '/', "/locations/:deviceID?/:widgetPage?"]}
                                                    component={Widgets}
                                                />
                                            }

                                        </styled.BodyContainer>

                                    </styled.ContentContainer>
                                }
                            </>
                        </PageErrorBoundary>
                      </BrowserRouter>
                  </styled.Container>
                  
              </ThemeProvider>
              </Suspense>
    );

}

export default App;
