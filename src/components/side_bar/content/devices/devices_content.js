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
import { putDevices, postDevices, getDevices, deleteDevices } from '../../../../redux/actions/devices_actions'
import * as locationActions from '../../../../redux/actions/locations_actions'
import * as positionActions from '../../../../redux/actions/positions_actions'
import * as dashboardActions from '../../../../redux/actions/dashboards_actions'
import * as stationActions from '../../../../redux/actions/stations_actions'
import * as taskActions from '../../../../redux/actions/tasks_actions'
import * as deviceActions from '../../../../redux/actions/devices_actions'


const widthBreakPoint = 450


const DevicesContent = () => {


    // ======================================== //
    //                                          //
    //             Constructor                  //
    //                                          //
    // ======================================== //


    // Redux Set Up
    const dispatch = useDispatch()
    const onDeviceAdd = (device) => dispatch(postDevices(device))
    const onDeviceChange = (device, ID) => dispatch(putDevices(device, ID))
    const onDeviceDelete = (ID) => dispatch(deleteDevices(ID))
    const onGetDevices = () => dispatch(getDevices())
    const onAddLocation = (selectedLocation) => dispatch(locationActions.addLocation(selectedLocation))
    const onSetSelectedLocation = (selectedLocation) => dispatch(locationActions.setSelectedLocation(selectedLocation))
    const onSetSelectedDevice = (selectedDevice) => dispatch(deviceActions.setSelectedDevice(selectedDevice))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
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
                //         onDeviceChange(device, device._id)
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
                                dispatch(locationActions.selectLocation(locations[devices[deviceID].station_id]._id))
                            }
                        }
                        }
                    />
                )

            })

        } catch (error) {
            console.log('QQQQ Device is undefined', devices)
        }

    }

    /**
     * This function is called when the save button is pressed. The location is POSTED or PUT to the backend. 
     * If the location is new and is a station, this function also handles posting the default dashboard and
     * tieing it to this location. Each child position for a station is also either POSTED or PUT. 
     */
    const handleSaveDevice = () => {

        const saveChildren = (locationID) => {

            //// Function to save the children of a posted station
            // Since the child has a .parent attribute, this function needs to be given the station's id
            let postPositionPromise, child
            selectedLocation.children.forEach((childID, ind) => {
                child = positions[childID]
                child.parent = locationID
                if (child.new) { // If the position is new, post it and update its id in the location.children array
                    postPositionPromise = dispatch(positionActions.postPosition(child))
                    postPositionPromise.then(postedPosition => {
                        selectedLocation.children[ind] = postedPosition._id
                        dispatch(locationActions.putLocation(selectedLocation, selectedLocation._id))
                    })
                } else { //  If the position is not new, just update it
                    dispatch(positionActions.putPosition(child, child._id))
                }
            })
        }

        //// Post the location
        if (selectedLocation.new == true) {
            const locationPostPromise = dispatch(locationActions.postLocation(selectedLocation))
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
                    const postDashboardPromise = dispatch(dashboardActions.postDashboard(defaultDashboard))
                    postDashboardPromise.then(postedDashboard => {
                        postedLocation.dashboards = [postedDashboard._id.$oid]
                        dispatch(stationActions.putStation(postedLocation, postedLocation._id))
                    })

                    const device = {
                        ...selectedDevice,
                        station_id: postedLocation._id
                    }
                    onDeviceChange(device, selectedDevice._id)



                    saveChildren(postedLocation._id)

                }
            })
        } else { // If the location is not new, PUT it and update it's children
            dispatch(locationActions.putLocation(selectedLocation, selectedLocation._id))
            if (selectedLocation.schema == 'station') {
                saveChildren(selectedLocation._id)
            }
        }

        dispatch(locationActions.deselectLocation())    // Deselect
        // setSelectedLocationCopy(null)                   // Reset the local copy to null
        // setSelectedLocationChildrenCopy(null)           // Reset the local children copy to null
        onSetSelectedDevice(null)
    }

    /**
    * This function is called when the back button is pressed. If the location is new, it is deleted;
    * otherwise, it is reverted to the state it was when editing begun.
    */
    const onBack = () => {

        //// Revert location
        if (selectedLocation.new == true) { // If the location was new, simply delete it 
            dispatch(locationActions.removeLocation(selectedLocation._id))
        } else { // If the location is not new, revert it to the old copy, and do the same to its children
            // dispatch(locationActions.updateLocation(selectedLocationCopy))
            // selectedLocationChildrenCopy.forEach(child => dispatch(positionActions.updatePosition(child)))
        }

        dispatch(locationActions.deselectLocation())    // Deselect
        // setSelectedLocationCopy(null)                   // Reset the local copy to null
        // setSelectedLocationChildrenCopy(null)           // Reset the local children copy to null

        onSetSelectedDevice(null)

    }

    /**
    * Called when the delete button is pressed. Deletes the location, its children, its dashboards, 
    * and any tasks associated with the location
    */
    const onDeleteDeviceLocation = () => {

        // Grabs location to delete by finding the station_id corresponding with the device
        const locationToDelete = locations[selectedDevice.station_id]

        dispatch(locationActions.deselectLocation())

        // If locationToDelete is undefined, that means it's not in the backend so it must not have been posted yet. So just remove location from front end, set selected device to null and return 
        if (locationToDelete === undefined) {
            dispatch(locationActions.removeLocation(selectedLocation._id))
            onSetSelectedDevice(null)
            return
        }

        if (locationToDelete.schema == 'station') {
            dispatch(stationActions.deleteStation(locationToDelete._id))

            //// Delete children
            locationToDelete.children.forEach(childID => {
                dispatch(positionActions.deletePosition(positions[childID], childID))
            })

            //// Delete dashboards
            locationToDelete.dashboards.forEach(dashboardID => {
                dispatch(dashboardActions.deleteDashboard(dashboardID))
            })

            //// Delete relevant tasks
            Object.values(tasks)
                .filter(task => task.load.station == locationToDelete._id || task.unload.station == locationToDelete._id)
                .forEach(task => dispatch(taskActions.deleteTask(task._id.$oid)))
        } else {

            // dispatch(positionActions.deletePosition(locationToDelete))
            dispatch(positionActions.deletePosition(locationToDelete, locationToDelete._id))

            //// Delete Relevant tasks
            Object.values(tasks)
                .filter(task => task.load.position == locationToDelete._id || task.unload.position == locationToDelete._id)
                .forEach(task => dispatch(taskActions.deleteTask(task._id.$oid)))
        }

        // Delete the station_id attatched to the device as well
        delete selectedDevice.station_id
        onDeviceChange(selectedDevice, selectedDevice._id)

        onSetSelectedDevice(null)

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