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
import { putDashboard } from '../../../../redux/actions/dashboards_actions'
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
    const dispatchSetSelectedDevice = (selectedDevice) => dispatch(setSelectedDevice(selectedDevice))
    const dispatchPutDashboards = (dashboard, id) => dispatch(putDashboard(dashboard, id))

    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedStationChildrenCopy = useSelector(state => state.positionsReducer.selectedStationChildrenCopy)
    const stations = useSelector(state => state.stationsReducer.stations)
    const positions = useSelector(state => state.positionsReducer.positions)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const selectedDevice = useSelector(state => state.devicesReducer.selectedDevice)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)

    const width = useSelector(state => state.sidebarReducer.width)
    const isSmall = width < widthBreakPoint

    const devices = useSelector(state => { return state.devicesReducer.devices })


    // ======================================== //
    //                                          //
    //             Main Functions               //
    //                                          //
    // ======================================== //

    // Sets the editingDeviceID to new so that the save knows to post instead of put
    const onAddDevice = () => {
    }

    // Renders Existing Devices
    const renderExistingDevices = () => {

        try {


            let devicesValue = Object.values(devices)

            // Maps through the existing devices
            return devicesValue.map((device, ind) => {
                return (
                    <DeviceItem
                        key={ind}
                        device={device}
                        isSmall={isSmall}
                        ind={ind}
                        tasks={tasks}
                        taskQueue={taskQueue}
                        setSelectedDevice={(deviceID) => {
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
     * This function is called when the save button is pressed. 
     * If its a Mir100 and the idle location has changed, then handle the associated device dashboard
     */
    const onSaveDevice = async () => {

        // If a AMR, then just put device, no need to save locaiton since it does not need one
        if (selectedDevice.device_model === 'MiR100') {

            // Handle Idle Location changes
            // If the idle location of selected device and the unedited version of selected device is different, then change the dashboard button
            if (selectedDevice.idle_location !== devices[selectedDevice._id].idle_location) {

                const dashboard = dashboards[selectedDevice.dashboards[0]]

                // If no idle location, then delete dashboard button if need be
                if (!selectedDevice.idle_location || selectedDevice.idle_location.length === 0) {

                    // Map through buttons
                    dashboard.buttons.map((button, ind) => {
                        // If the button uses the old idle location, then delete the button
                        if (!!button.custom_task && button.custom_task.position === devices[selectedDevice._id].idle_location) {

                            // Delete button
                            dashboard.buttons.splice(ind, 1)
                        }
                    })
                }

                // Add/edit the dashboard button
                else {

                    // Used to see if an idleButton alread exists
                    let idleButtonExists = false

                    dashboard.buttons.map((button, ind) => {
                        // If the button uses the old idle location, then update
                        if (!!button.custom_task && button.custom_task.position === devices[selectedDevice._id].idle_location) {
                            // button exists so dont add a new on
                            idleButtonExists = true

                            // Edit the existing button to use the new idle location
                            button = {
                                ...button,
                                custom_task: {
                                    ...button.custom_task,
                                    position: selectedDevice.idle_location
                                }
                            }
                            // Splice in the new button
                            dashboard.buttons.splice(ind, 1, button)
                        }
                    })

                    // If the button doesnt exist then add the button to the dashbaord
                    if (!idleButtonExists) {
                        const newButton = {
                            'name': 'Send to Idle Location',
                            'color': '#FF4B4B',
                            'task_id': 'custom_task',
                            'custom_task': {
                                'type': 'position_move',
                                'position': selectedDevice.idle_location,
                                'device_type': 'MiR_100',
                            },
                            'deviceType': 'MiR_100',
                            'id': 'custom_task_idle'
                        }
                        dashboard.buttons.push(newButton)
                    }
                }

                // Put the dashboard
                await dispatchPutDashboards(dashboard, dashboard._id.$oid)
            }


            await dispatchPutDevice(selectedDevice, selectedDevice._id)
        }


        dispatchSetSelectedStation(null)
        dispatchSetSelectedDevice(null)
    }

    const onBack = () => {
        dispatchSetSelectedDevice(null)
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
                mode={!!selectedDevice ? 'create' : 'title'}
                onClickAdd={() => { onAddDevice() }}
                onClickBack={onBack}

                backEnabled={!!selectedDevice ? true : false}

                onClickSave={() => {
                    onSaveDevice()
                }}

            />


            {!!selectedDevice ?
                <DeviceEdit deviceLocationDelete={onDeleteDeviceLocation} />
                :

                renderExistingDevices()
            }



        </styled.ContentContainer>
    )
}

export default DevicesContent
