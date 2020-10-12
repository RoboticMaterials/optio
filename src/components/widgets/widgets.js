import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// import components
import WidgetPages from './widget_pages/widget_pages'
import WidgetButton from './widget_button/widget_button'

// import hooks
import useWindowSize from '../../hooks/useWindowSize'

// Import Actions
import { hoverStationInfo } from '../../redux/actions/stations_actions'
import { deselectLocation, widgetLoaded } from '../../redux/actions/locations_actions'

// Import Utils
import { DeviceItemTypes } from '../../methods/utils/device_utils'

// TODO: DELETE ME, FOR PROTOTYPING ONLY
import HILModals from '../hil_modals/hil_modals'

import * as styled from './widgets.style'

const Widgets = (props) => {

    const size = useWindowSize()
    const windowWidth = size.width
    const widthBreakPoint = 1000;
    const mobileMode = windowWidth < widthBreakPoint;

    let params = useParams()

    // Grabs what widget page is in the URL
    const widgetPage = params.widgetPage

    const dashboardOpen = useSelector(state => state.dashboardsReducer.dashboardOpen)
    const locations = useSelector(state => { return state.locationsReducer.locations })
    const devices = useSelector(state => state.devicesReducer.devices)
    // Info passed from workstations/device_locations via redux
    const hoveringInfo = useSelector(state => state.locationsReducer.hoverStationInfo)

    const dispatch = useDispatch()
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const onWidgetLoaded = (bool) => dispatch(widgetLoaded(bool))
    const onDeselectLocation = () => dispatch(deselectLocation())

    const [hoverX, setHoverX] = useState(null)
    const [hoverY, setHoverY] = useState(null)

    // Location ID passed down through workstations via redux
    const stationID = hoveringInfo.id

    // This tells redux that the widget has mounted. Used in map view to handle if widget is still open but shoulnt be
    // This happens when moving the mouse too fast over a location causing a widget to load, but not fast enough for the onmouselave to execute
    useEffect(() => {

        // setTimeout(() => onWidgetLoaded(true), 100)
        onWidgetLoaded(true)
        return () => {
            dispatchHoverStationInfo(null)
            onDeselectLocation()
            onWidgetLoaded(false)
        }
    }, [])

    // If widgetPage exists in URL params, then the widget pages are open
    const HandleWidgetPageOpen = () => {
        if (!!widgetPage) {
            dispatchHoverStationInfo(hoveringInfo)
            onDeselectLocation()
        }
    }

    // Renders the buttons under the location. useMemo is passed a blank array because the buttons only need to be rendered once
    const handleWidgetButtons = useMemo(() => {

        const location = locations[hoveringInfo.id]

        // If the schema is a station then show these buttons, else it's a position
        if (location.schema === 'station') {
            // If location has a device, then see what type of widget buttons need to be displayed, else just show statistics and dashboards
            if (!!location.device_id) {
                const device = devices[location.device_id]
                let deviceType = DeviceItemTypes['generic']

                if (!!DeviceItemTypes[device.device_model]) deviceType = DeviceItemTypes[device.device_model]

                return deviceType.widgetPages.map((page, ind) => {
                    switch (page) {
                        case 'statistics':
                            return (
                                <WidgetButton
                                    key={ind}
                                    id={stationID}
                                    type={'statistics'}
                                    currentPage={widgetPage}
                                />
                            )
                        case 'dashboards':
                            return (
                                <WidgetButton
                                    key={ind}
                                    id={stationID}
                                    type={'dashboards'}
                                    currentPage={widgetPage}
                                />
                            )
                        case 'view':
                            return (
                                <WidgetButton
                                    key={ind}
                                    id={stationID}
                                    type={'view'}
                                    currentPage={widgetPage}
                                />
                            )

                        default:
                            break;
                    }

                })

            }
            else {
                return (
                    <>
                        {/* <WidgetButton
                        id={stationID}
                        type={'statistics'}
                        currentPage={widgetPage}
                    /> */}

                        <WidgetButton
                            id={stationID}
                            type={'dashboards'}
                            currentPage={widgetPage}
                        />

                        {/* Commented out for now, these widgets aren't working as of Sept. 1 2020. Once re-implemented make sure to update CSS */}
                        {/* <WidgetButton
                    id={stationID}
                    type={'tasks'}
                    currentPage={widgetPage}
                /> */}

                        <WidgetButton
                            id={stationID}
                            type={'objects'}
                            currentPage={widgetPage}
                        />

                        {/* <WidgetButton
                    id={stationID}
                    type={'view'}
                    currentPage={widgetPage}
                /> */}
                    </>

                )
            }
        }
        else {
            return (
                <WidgetButton
                    id={stationID}
                    type={'cart'}
                    currentPage={widgetPage}
                />
            )
        }
    }, [widgetPage])

    const statistics = useMemo(() => {
        // TODO: Write code that grabs the statistics for the current location

        return (
            <styled.WidgetStatisticsContainer>

                <styled.WidgetStatisticsBlock>
                    <styled.WidgetStatisticsIcon className="far fa-clock" />
                    <styled.WidgetStatisticsText>
                        30s
                    </styled.WidgetStatisticsText>
                </styled.WidgetStatisticsBlock>

                <styled.WidgetStatisticsBlock>
                    <styled.WidgetStatisticsIcon className="fas fa-arrow-right" />
                    <styled.WidgetStatisticsText>
                        25 Units
                    </styled.WidgetStatisticsText>
                </styled.WidgetStatisticsBlock>

                <styled.WidgetStatisticsBlock>
                    <styled.WidgetStatisticsIcon className="fas fa-percent" />
                    <styled.WidgetStatisticsText>
                        98%
                    </styled.WidgetStatisticsText>
                </styled.WidgetStatisticsBlock>

            </styled.WidgetStatisticsContainer>
        )
    }, [locations])

    /**
     * This handles the x and y position of the widget.
     * It centers the x and y position to the middle of the widget by using the element height and width
     * This takes care issue with widgets that are different sizes 
     * @param {} coord 
     */
    // Left outside of function so that otherplaces can access it
    const element = document.getElementById(hoveringInfo.id)

    const handleWidgetPosition = (coord) => {

        if (element === null) {
            if (coord === 'x') {
                return hoveringInfo.xPosition + 'px'

            } else {
                return hoveringInfo.yPosition + 'px'
            }
        }

        const elementHeight = element.getBoundingClientRect().height
        const elementWidth = element.getBoundingClientRect().width


        let widgetPosition = {}

        widgetPosition.x = hoveringInfo.xPosition - elementWidth / 2 + 'px'
        widgetPosition.y = hoveringInfo.yPosition + elementHeight / 2 + 'px'

        if (coord === 'x') {
            return widgetPosition.x

        } else {
            return widgetPosition.y
        }

    }

    return (
        <>
            {!!widgetPage &&
                <styled.WidgetBlurContainer />
            }

            {/* WidgetLocationContainer is an absolute div used for locating the widget over the hovered location */}
            <styled.WidgetLocationContainer
                id={hoveringInfo.id}
                onMouseEnter={() => {
                    dispatchHoverStationInfo(hoveringInfo)
                    handleWidgetPosition()
                }}

                onMouseLeave={() => {
                    if (!widgetPage) {
                        dispatchHoverStationInfo(null)
                        onDeselectLocation()
                    }
                }}

                // xPosition={hoveringInfo.xPosition + 'px'}
                xPosition={handleWidgetPosition('x')}
                yPosition={handleWidgetPosition('y')}
                scale={hoveringInfo.scale}
                widgetPage={widgetPage}

                // This sets the opacity to 0 if the element has not been mounted yet. Eliminates the 'snapping'
                style={{opacity: !widgetPage && element === null ? '0' : '1'}}
            >

                {!widgetPage &&
                    <styled.WidgetHoverArea
                        hoverScale={hoveringInfo.realScale}
                        onMouseEnter={() => {
                            dispatchHoverStationInfo(hoveringInfo)
                        }}
                        
                    />
                }

                <styled.WidgetContainer widgetPage={widgetPage}>

                    {mobileMode ?
                        dashboardOpen ?
                            <></>
                            :
                            <styled.WidgetButtonContainer widgetPage={widgetPage}>
                                {handleWidgetButtons}
                            </styled.WidgetButtonContainer>

                        :
                        <styled.WidgetButtonContainer widgetPage={widgetPage}>
                            {handleWidgetButtons}
                        </styled.WidgetButtonContainer>

                    }

                    {/* Commented out for the time being, statistics have not been implemented as of Sept 1 */}
                    {/* {!widgetPage &&
                        statistics
                    } */}

                    {HandleWidgetPageOpen()}
                </styled.WidgetContainer>



            </styled.WidgetLocationContainer>

            {!!widgetPage &&
                <>
                    <WidgetPages />
                </>
            }

        </>

    )
}

export default Widgets