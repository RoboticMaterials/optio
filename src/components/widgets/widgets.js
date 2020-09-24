import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// import components
import WidgetPages from './widget_pages/widget_pages'
import WidgetButton from './widget_button/widget_button'

// import hooks
import useWindowSize from '../../hooks/useWindowSize'

import { hoverStationInfo } from '../../redux/actions/stations_actions'

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

    // Location ID passed down through workstations via redux
    const stationID = hoveringInfo.id

    // If widgetPage exists in URL params, then the widget pages are open
    const HandleWidgetPageOpen = () => {
        if (!!widgetPage) {
            dispatchHoverStationInfo(hoveringInfo)
        }
    }

    // Renders the buttons under the location. useMemo is passed a blank array because the buttons only need to be rendered once
    const handleWidgetButtons = useMemo(() => {

        const location = locations[hoveringInfo.id]

        // If location has a device, then see what type of widget buttons need to be displayed, else just show statistics and dashboards
        if (!!location.device_id) {
            const device = devices[location.device_id]
            let deviceType = DeviceItemTypes['generic']


            if (!!DeviceItemTypes[device.device_model]) deviceType = DeviceItemTypes[device.device_model]


            return deviceType.widgetPages.map((page) => {
                switch (page) {
                    case 'statistics':
                        return (
                            <WidgetButton
                                id={stationID}
                                type={'statistics'}
                                currentPage={widgetPage}
                            />
                        )
                    case 'dashboards':
                        return (
                            <WidgetButton
                                id={stationID}
                                type={'dashboards'}
                                currentPage={widgetPage}
                            />
                        )
                    case 'view':
                        return (
                            <WidgetButton
                                id={stationID}
                                type={'view'}
                                currentPage={widgetPage}
                            />
                        )

                    default:
                        break;
                }

            })

        } else {
            return (
                <>
                    <WidgetButton
                        id={stationID}
                        type={'statistics'}
                        currentPage={widgetPage}
                    />

                    <WidgetButton
                        id={stationID}
                        type={'dashboards'}
                        currentPage={widgetPage}
                    />

                    {/* Commented out for now, these widgets aren't working as of Sept. 1 2020. Once re-implemented make sure to update CSS */}
                    {/* <WidgetButton
                    id={locationID}
                    type={'tasks'}
                    currentPage={widgetPage}
                /> */}

                    {/* <WidgetButton
                    id={locationID}
                    type={'objects'}
                    currentPage={widgetPage}
                /> */}

                    {/* <WidgetButton
                    id={locationID}
                    type={'view'}
                    currentPage={widgetPage}
                /> */}
                </>

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
                }}

                onMouseLeave={() => {
                    if (!widgetPage) {
                        dispatchHoverStationInfo(null)
                    }
                }}

                xPosition={hoveringInfo.xPosition + 'px'}
                yPosition={hoveringInfo.yPosition + 'px'}
                scale={hoveringInfo.scale}
                widgetPage={widgetPage}
            >

                {!widgetPage &&
                    <styled.WidgetHoverArea
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
                    {/* <styled.CloseButton
                        onClick={() => {
                            history.push('/locations')
                            dispatchHoverStationInfo(null)
                        }}
                        className='fas fa-times'
                    /> */}

                    <WidgetPages />
                </>
            }

        </>

    )
}

export default Widgets