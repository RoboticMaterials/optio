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
import { deselectLocation, widgetLoaded, setSelectedLocationCopy, setSelectedLocationChildrenCopy } from '../../redux/actions/locations_actions'

import * as sidebarActions from "../../redux/actions/sidebar_actions"
import * as locationActions from '../../redux/actions/locations_actions'

import { deepCopy } from '../../methods/utils/utils'



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
    const history = useHistory()

    // Grabs what widget page is in the URL
    const widgetPage = params.widgetPage
    const dashboardOpen = useSelector(state => state.dashboardsReducer.dashboardOpen)
    const locations = useSelector(state => { return state.locationsReducer.locations })
    const devices = useSelector(state => state.devicesReducer.devices)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const editing = useSelector(state => state.locationsReducer.editingLocation)
    const positions = useSelector(state => state.locationsReducer.positions)
    const showSideBar = useSelector(state => state.sidebarReducer.open)

    // Info passed from workstations/device_locations via redux
    const hoveringInfo = useSelector(state => state.locationsReducer.hoverStationInfo)
    const dispatch = useDispatch()
    const onHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const onWidgetLoaded = (bool) => dispatch(widgetLoaded(bool))
    const onDeselectLocation = () => dispatch(deselectLocation())
    const onSetSelectedLocationCopy = (location) => dispatch(setSelectedLocationCopy(location))
    const onSetSelectedLocationChildrenCopy = (locationChildren) => dispatch(setSelectedLocationChildrenCopy(locationChildren))
    const onShowSideBar = (bool) => dispatch(sidebarActions.setOpen(bool))
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
            onHoverStationInfo(null)
            if (!!editing) { onDeselectLocation() }
            onWidgetLoaded(false)
        }
    }, [])

    // If widgetPage exists in URL params, then the widget pages are open
    const HandleWidgetPageOpen = () => {
        if (!!widgetPage && !!editing) {
            onHoverStationInfo(hoveringInfo)
            onDeselectLocation()
        }
    }

    const clickLocation = () => {
        history.push('/locations')

        if (!showSideBar) {
            const hamburger = document.querySelector('.hamburger')
            hamburger.classList.toggle('is-active')
        }

        onShowSideBar(true)

        onSetSelectedLocationCopy(deepCopy(selectedLocation))
        if (!!selectedLocation.children) {
            onSetSelectedLocationChildrenCopy(selectedLocation.children.map(positionID => deepCopy(positions[positionID])))
        }

        dispatch(locationActions.editing(true))

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
                                    label={'Statistics'}
                                    currentPage={widgetPage}

                                />
                            )
                        case 'dashboards':
                            return (
                                <WidgetButton
                                    key={ind}
                                    id={stationID}
                                    type={'dashboards'}
                                    label={'Dashboards'}
                                    currentPage={widgetPage}

                                />
                            )
                        case 'view':
                            return (
                                <WidgetButton
                                    key={ind}
                                    id={stationID}
                                    type={'view'}
                                    label={'View'}
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
                        <WidgetButton
                            id={stationID}
                            type={'statistics'}
                            label={'Statistics'}
                            currentPage={widgetPage}

                        />

                        <WidgetButton
                            id={stationID}
                            type={'dashboards'}
                            label={'Dashboards'}
                            currentPage={widgetPage}

                        />

                        {/* Commented out for now, these widgets aren't working as of Sept. 1 2020. Once re-implemented make sure to update CSS */}
                        {/* <WidgetButton
                    id={stationID}
                    type={'tasks'}
                    currentPage={widgetPage}
                /> */}

                        {/* <WidgetButton
                            id={stationID}
                            type={'objects'}
                            currentPage={widgetPage}
                        /> */}

                        {/* <WidgetButton
                    id={stationID}
                    type={'view'}
                    currentPage={widgetPage}
                /> */}
                    </>

                )
            }
        }
        // If right menu position, have send cart and cancel (times)
        else if (selectedLocation.name === 'TempRightClickMoveLocation') {
            return (
                <>
                    <WidgetButton
                        id={stationID}
                        type={'cart'}
                        coordinateMove={true}
                        currentPage={widgetPage}
                        label={'Send Cart Here'}

                    />
                    <WidgetButton
                        id={stationID}
                        type={'cancel'}
                        currentPage={widgetPage}

                    />
                </>
            )
        }

        else {
            return (
                <WidgetButton
                    id={stationID}
                    type={'cart'}
                    label={'Send Cart Here'}
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

        // When first hovering over, the widget has not mounted so the element is null, but once its mounted, you can use the bounding box
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

        // Handles the x, use location x if right click menu so it can also move
        if (!!selectedLocation && selectedLocation.name === 'TempRightClickMoveLocation') {
            widgetPosition.x = selectedLocation.x - elementWidth / 2 + 30 + 'px'
        }
        else {
            widgetPosition.x = hoveringInfo.xPosition - elementWidth / 2 + 'px'
        }

        // Handles the y, use location y if right click menu so it can also move
        if (!!selectedLocation && selectedLocation.name === 'TempRightClickMoveLocation') {
            widgetPosition.y = selectedLocation.y + elementHeight / 2 + 20 + 'px'
        }
        else {
            widgetPosition.y = hoveringInfo.yPosition + elementHeight / 2 + 'px'
        }

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
                    onHoverStationInfo(hoveringInfo)
                    handleWidgetPosition()
                }}

                onMouseLeave={() => {
                    if (!widgetPage && !!selectedLocation && selectedLocation.name !== 'TempRightClickMoveLocation' && !editing) {
                        onHoverStationInfo(null)
                        onDeselectLocation()
                    }
                }}

                // xPosition={hoveringInfo.xPosition + 'px'}
                xPosition={handleWidgetPosition('x')}
                yPosition={handleWidgetPosition('y')}
                scale={hoveringInfo.scale}
                widgetPage={widgetPage}

                // This sets the opacity to 0 if the element has not been mounted yet. Eliminates the 'snapping'
                style={{ opacity: !widgetPage && element === null ? '0' : '1' }}
            >
                {/* If not widget page and not a right click widget then add an invisable hover area */}
                {!widgetPage && !!selectedLocation && selectedLocation.name !== 'TempRightClickMoveLocation' &&
                    <styled.WidgetHoverArea
                        hoverScale={hoveringInfo.realScale}
                        onMouseEnter={() => {
                            onHoverStationInfo(hoveringInfo)
                        }}

                    />
                }
                <styled.WidgetContainer widgetPage={widgetPage}>
                    {!widgetPage && !!selectedLocation &&
                        <>
                            {selectedLocation.name == "TempRightClickMoveLocation" ?
                                <styled.WidgetStationNameUnselectable>{"Send Cart To Location"}</styled.WidgetStationNameUnselectable>
                                :
                                <>
                                    {selectedLocation.schema == "positions" ?
                                        <styled.WidgetStationNameUnselectable>{selectedLocation.name}</styled.WidgetStationNameUnselectable>
                                        :
                                        <styled.RowContainer>
                                        <styled.WidgetStationName>{selectedLocation.name}</styled.WidgetStationName>
                                        <styled.EditIcon
                                            className='fas fa-edit'
                                            styled={{ color: '#ff1818' }}
                                            onClick={() => clickLocation()}
                                        />
                                        </styled.RowContainer>

                                    }
                                </>
                            }
                        </>
                    }



                    <styled.WidgetButtonContainer widgetPage={widgetPage}>
                        {handleWidgetButtons}
                    </styled.WidgetButtonContainer>


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
