import React, { useState, useEffect } from 'react'

// external functions
import { useDispatch, useSelector } from 'react-redux'

// import styles
import * as styled from './devices_content.style'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'

// Import basic components
import ContentHeader from '../content_header/content_header'

// Import Components
import DeviceEdit from './device_edit/device_edit'
import DeviceStatistics from './device_statistics/device_statistics'
import DeviceItem from './device_item/device_item'

// Import Actions
import { putDevices, setSelectedDevice } from '../../../../redux/actions/devices_actions'
import { setSelectedStation } from '../../../../redux/actions/stations_actions'
import { putDashboard } from '../../../../redux/actions/dashboards_actions'

const widthBreakPoint = 450


const DevicesContent = () => {


    // ======================================== //
    //                                          //
    //             Constructor                  //
    //                                          //
    // ======================================== //


    // Redux Set Up
    const dispatch = useDispatch()
    const dispatchSetSelectedDevice = (selectedDevice) => dispatch(setSelectedDevice(selectedDevice))

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


            {!!selectedDevice ?
                <DeviceEdit deviceLocationDelete={onDeleteDeviceLocation} />
                :
                <>
                    <ContentHeader
                        content={'devices'}
                        mode={'title'}
                    />



                    {renderExistingDevices()}
                </>
            }



        </styled.ContentContainer>
    )
}

export default DevicesContent
