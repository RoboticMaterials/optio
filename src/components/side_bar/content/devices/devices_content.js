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

import { putDevices, postDevices, getDevices, deleteDevices } from '../../../../redux/actions/devices_actions'

const widthBreakPoint = 450


const DevicesContent = () => {


    // ======================================== //
    //                                          //
    //             Constructor                  //
    //                                          //
    // ======================================== //

    const [editingDeviceID, setEditingDeviceID] = useState('')
    const [openDeviceStats, setOpenDeviceStats] = useState('')

    // Redux Set Up
    const dispatch = useDispatch()
    const onDeviceAdd = (device) => dispatch(postDevices(device))
    const onDeviceChange = (device, ID) => dispatch(putDevices(device, ID))
    const onDeviceDelete = (ID) => dispatch(deleteDevices(ID))
    const onGetDevices = () => dispatch(getDevices())

    const tasks = useSelector(state => state.tasksReducer.tasks)

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
        onGetDevices()
    }, [])

    // Sets the editingDeviceID to new so that the save knows to post instead of put
    const handleAddDevice = () => {
        setEditingDeviceID('new')
    }

    // Renders Existing Devices
    const handleExistingDevices = () => {

        let devicesValue = Object.values(devices)

        // Maps through the existing devices
        return devicesValue.map((device, ind) => {

            return (
                <DeviceItem
                    device={device}
                    isSmall={isSmall}
                    ind={ind}
                    setOpenDeviceStats={(deviceID) => setOpenDeviceStats(deviceID)}
                />
            )

        })

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
                mode={!!editingDeviceID ? 'create' : !!openDeviceStats ? 'title' : 'list' }
                onClickAdd={() => { handleAddDevice() }}
                onClickBack={() => setEditingDeviceID('')}

                backEnabled={!!openDeviceStats ? true : false }

                onClickSave={() => {
                    // Commented out for now, not sure if you're going ot have to 'Save' device, only reason would be if you wanted to give it a custom name
                    // handleSaveDevice(device)
                    // setEditingDeviceID('')
                }}

            />


            {!!editingDeviceID ?
                <DeviceEdit editingDeviceID={editingDeviceID} devices={devices} onDeviceDelete={(id) => onDeviceDelete(id)} setEditingDeviceID={(id) => setEditingDeviceID(id)}/>
                :
                !!openDeviceStats ?
                    <DeviceStatistics />
                    :
                    <>
                        {handleExistingDevices()}
                    </>
            }



        </styled.ContentContainer>
    )
}

export default DevicesContent