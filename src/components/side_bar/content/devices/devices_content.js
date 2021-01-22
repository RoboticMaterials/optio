import React, { useState, useEffect } from 'react'

// external functions
import { useDispatch, useSelector } from 'react-redux'

// import styles
import * as styled from './devices_content.style'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'

// Import basic components
import ContentHeader from '../content_header/content_header'
import DropDownSearch from '../../../basic/drop_down_search_v2/drop_down_search'
import BackButton from '../../../basic/back_button/back_button'
import Button from '../../../basic/button/button'
import Textbox from '../../../basic/textbox/textbox'
import PlusButton from '../../../basic/plus_button/plus_button'

// Import Components
import DeviceEdit from './device_edit/device_edit'
import DeviceStatistics from './device_statistics/device_statistics'
import DeviceItem from './device_item/device_item'

// Import Actions
import { putDevices, postDevices, getDevices, deleteDevices, setSelectedDevice } from '../../../../redux/actions/devices_actions'
import { setSelectedStation, putStation, postStation } from '../../../../redux/actions/stations_actions'
import { postPosition, putPosition, setSelectedStationChildrenCopy } from '../../../../redux/actions/positions_actions'
import { postDashboard } from '../../../../redux/actions/dashboards_actions'
import * as stationActions from '../../../../redux/actions/stations_actions'


const widthBreakPoint = 450


const DevicesContent = () => {


    // ======================================== //
    //                                          //
    //             Constructor                  //
    //                                          //
    // ======================================== //


    // Redux Set Up
    const dispatch = useDispatch()
    const dispatchPutDevice = (device, ID) => dispatch(putDevices(device, ID))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetSelectedStationChildrenCopy = (children) => dispatch(setSelectedStationChildrenCopy(children))
    const dispatchSetSelectedDevice = (selectedDevice) => dispatch(setSelectedDevice(selectedDevice))

    const dispatchPostPosition = (position) => dispatch(postPosition(position))
    const dispatchPutPosition = (position) => dispatch(putPosition(position))
    const dispatchPostDashboard = (dashboard) => dispatch(postDashboard(dashboard))

    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedStationChildrenCopy = useSelector(state => state.positionsReducer.selectedStationChildrenCopy)
    const stations = useSelector(state => state.stationsReducer.stations)
    const positions = useSelector(state => state.positionsReducer.positions)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const selectedDevice = useSelector(state => state.devicesReducer.selectedDevice)

    const width = useSelector(state => state.sidebarReducer.width)
    const isSmall = width < widthBreakPoint

    const devices = useSelector(state => { return state.devicesReducer.devices })


    // ======================================== //
    //                                          //
    //             Main Functions               //
    //                                          //
    // ======================================== //

    // Gets devices on component mount. TODO: Remove this once API container is back in place
    useEffect(() => {
    }, [])

    // Sets the editingDeviceID to new so that the save knows to post instead of put
    const handleAddDevice = () => {
    }

    // Renders Existing Devices
    const handleExistingDevices = () => {

        try {


            let devicesValue = Object.values(devices)

            // Maps through the existing devices
            return devicesValue.map((device, ind) => {

                // This handles devices that still have station ids but the station has been deleted
                // Commented out for now because it may be causing other bugs
                // if (!!device.station_id) {
                //     if (!Object.keys(locations).includes(device.station_id)) {
                //         delete device.station_id
                //         dispatchPutDevice(device, device._id)
                //         console.log('QQQQ Device has a station ID that does not exist')
                //     }
                // }

                return (
                    <DeviceItem
                        key={ind}
                        device={device}
                        isSmall={isSmall}
                        ind={ind}
                        tasks={tasks}
                        taskQueue={taskQueue}
                        setSelectedDevice={(deviceID) => {

                            console.log('QQQQ Selected Device', devices[deviceID])
                            dispatchSetSelectedDevice(deepCopy(devices[deviceID]))

                        }
                        }
                    />
                )

            })

        } catch (error) {
            console.log('Device is undefined', devices)
        }

    }

    /**
     * This function is called when the save button is pressed. The location is POSTED or PUT to the backend.
     * If the location is new and is a station, this function also handles posting the default dashboard and
     * tieing it to this location. Each child position for a station is also either POSTED or PUT.
     */
    const handleSaveDevice = () => {

        // If a AMR, then just put device, no need to save locaiton since it does not need one
        if (selectedDevice.device_model === 'MiR100') {
            dispatchPutDevice(selectedDevice, selectedDevice._id)
        }

        dispatchSetSelectedStation(null)
        dispatchSetSelectedDevice(null)
    }

    const onBack = () => {

    }

    /**
    * Called when the delete button is pressed. Deletes the location, its children, its dashboards,
    * and any tasks associated with the location
    */
    const onDeleteDeviceLocation = () => {

    }


    return (
        <styled.ContentContainer>

            {/* Content header changes based on whats going on with devices
                If in standard list mode then header should be in list mode (add button)
                If in editing/adding then the header should be in create mode (save button)
                If in stats then the header should be in title mode with back enabled
            */}
            <ContentHeader
                content={'devices'}
                mode={!!selectedDevice ? 'create' : 'list'}
                onClickAdd={() => { handleAddDevice() }}
                onClickBack={onBack}

                backEnabled={!!selectedDevice ? true : false}

                onClickSave={() => {
                    handleSaveDevice()
                }}

            />


            {!!selectedDevice ?
                <DeviceEdit deviceLocationDelete={onDeleteDeviceLocation} />
                :

                handleExistingDevices()
            }



        </styled.ContentContainer>
    )
}

export default DevicesContent
