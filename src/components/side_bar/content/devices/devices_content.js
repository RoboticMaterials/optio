import React, { useState, useEffect } from 'react'

// external functions
import { useDispatch, useSelector } from 'react-redux'

// import styles
import * as styled from './devices_content.style'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'
import { } from '../../../../methods/utils/locations_utils'

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
import { selectLocation, putLocation, postLocation, deselectLocation, sideBarBack, deleteLocationProcess, setSelectedLocation, setSelectedLocationCopy, setSelectedLocationChildrenCopy } from '../../../../redux/actions/locations_actions'
import * as positionActions from '../../../../redux/actions/positions_actions'
import * as dashboardActions from '../../../../redux/actions/dashboards_actions'
import * as stationActions from '../../../../redux/actions/stations_actions'
import * as taskActions from '../../../../redux/actions/tasks_actions'


const widthBreakPoint = 450


const DevicesContent = () => {


    // ======================================== //
    //                                          //
    //             Constructor                  //
    //                                          //
    // ======================================== //


    // Redux Set Up
    const dispatch = useDispatch()
    const onPostDevice = (device) => dispatch(postDevices(device))
    const onPutDevice = (device, ID) => dispatch(putDevices(device, ID))
    const onDeviceDelete = (ID) => dispatch(deleteDevices(ID))
    const onSetSelectedLocation = (selectedLocation) => dispatch(setSelectedLocation(selectedLocation))
    const onSetSelectedDevice = (selectedDevice) => dispatch(setSelectedDevice(selectedDevice))
    const onSetSelectedLocationCopy = (location) => dispatch(setSelectedLocationCopy(location))
    const onSetSelectedLocationChildrenCopy = (locationChildren) => dispatch(setSelectedLocationChildrenCopy(locationChildren))
    const onSideBarBack = (props) => dispatch(sideBarBack(props))
    const onDeleteLocationProcess = (props) => dispatch(deleteLocationProcess(props))

    const onSelectLocation = (props) => dispatch(selectLocation(props))
    const onPostPosition = (props) => dispatch(positionActions.postPosition(props))
    const onPutLocation = (location, id) => dispatch(putLocation(location, id))
    const onPostDashboard = (props) => dispatch(dashboardActions.postDashboard(props))
    const onPutStation = (postedLocation, id) => dispatch(stationActions.putStation(postedLocation, id))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const selectedLocationCopy = useSelector(state => state.locationsReducer.selectedLocationCopy)
    const selectedLocationChildrenCopy = useSelector(state => state.locationsReducer.selectedLocationChildrenCopy)
    const locations = useSelector(state => state.locationsReducer.locations)
    const positions = useSelector(state => state.locationsReducer.positions)
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
                //         onPutDevice(device, device._id)
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
                            onSetSelectedDevice(deepCopy(devices[deviceID]))

                            // If the device has a station Id, set the station ID. It wouldnt have a station ID because the device has not been placed on the map
                            if (!!devices[deviceID].station_id) {

                                onSetSelectedLocation(deepCopy(locations[devices[deviceID].station_id]))
                                onSetSelectedLocationCopy(deepCopy(locations[devices[deviceID].station_id]))

                                if (!!locations[devices[deviceID].station_id].children) {
                                    onSetSelectedLocationChildrenCopy(locations[devices[deviceID].station_id].children.map(positionID => deepCopy(positions[positionID])))
                                }

                                onSelectLocation(locations[devices[deviceID].station_id]._id)

                            }
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
            onPutDevice(selectedDevice, selectedDevice._id)
        }
        // Else go through and see if it needs to save the locations
        else {
            const saveChildren = (locationID) => {

                //// Function to save the children of a posted station
                // Since the child has a .parent attribute, this function needs to be given the station's id
                let postPositionPromise, child
                selectedLocation.children.forEach((childID, ind) => {
                    child = positions[childID]
                    child.parent = locationID
                    if (child.new) { // If the position is new, post it and update its id in the location.children array
                        postPositionPromise = onPostPosition(child)
                        postPositionPromise.then(postedPosition => {
                            selectedLocation.children[ind] = postedPosition._id
                            onPutLocation(selectedLocation, selectedLocation._id)
                        })
                    } else { //  If the position is not new, just update it
                        onPutLocation(child, child._id)
                    }
                })
            }

            //// Post the location
            if (selectedLocation.new == true) {
                const locationPostPromise = onPostPosition(selectedLocation)
                locationPostPromise.then(postedLocation => {
                    //// On return of the posted location, if it is a station we also need to assign it a default dashboard
                    // TODO: Aren't devices always stations??
                    // TODO: Should devices have dashboards?? Yes?
                    if (postedLocation.schema == 'station') {
                        let defaultDashboard = {
                            name: postedLocation.name + ' Dashboard',
                            buttons: [],
                            station: postedLocation._id
                        }

                        //// Now post the dashboard, and on return tie that dashboard to location.dashboards and put the location
                        const postDashboardPromise = onPostDashboard(defaultDashboard)
                        postDashboardPromise.then(postedDashboard => {
                            postedLocation.dashboards = [postedDashboard._id.$oid]
                            onPutStation(postedLocation, postedLocation._id)
                        })

                        const device = {
                            ...selectedDevice,
                            station_id: postedLocation._id
                        }
                        onPutDevice(device, selectedDevice._id)



                        saveChildren(postedLocation._id)

                    }
                })
            } else { // If the location is not new, PUT it and update it's children
                onPutLocation(selectedLocation, selectedLocation._id)
                if (selectedLocation.schema == 'station') {
                    saveChildren(selectedLocation._id)
                }
            }
        }

        dispatch(deselectLocation())    // Deselect
        onSetSelectedDevice(null)
    }

    const onBack = () => {
        onSideBarBack({ selectedLocation, selectedLocationCopy, selectedLocationChildrenCopy })

    }

    /**
    * Called when the delete button is pressed. Deletes the location, its children, its dashboards,
    * and any tasks associated with the location
    */
    const onDeleteDeviceLocation = () => {

        onDeleteLocationProcess({ selectedLocation, locations, selectedDevice, positions, tasks })

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
