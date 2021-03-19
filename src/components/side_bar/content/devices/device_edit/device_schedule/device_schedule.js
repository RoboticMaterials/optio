import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import uuid from 'uuid';

// Import style
import * as styled from './device_schedule.style'

// Import Basic Components
import Button from '../../../../../basic/button/button'
import Switch from '../../../../../basic/form/switch_field/switch_field'

// Import Actions
import { setSelectedDevice } from '../../../../../../redux/actions/devices_actions'

// Import Utils
import { deepCopy } from '../../../../../../methods/utils/utils'

const DeviceSchedule = (props) => {

    const {
    } = props

    const dispatch = useDispatch()
    const dispatchSetSelectedDevice = (selectedDevice) => dispatch(setSelectedDevice(selectedDevice))

    const selectedDevice = useSelector(state => state.devicesReducer.selectedDevice)

    const onAddSchedule = () => {

        let newSchedules = {}
        if (!!selectedDevice.schedules) {
            newSchedules = deepCopy(selectedDevice.schedules)
        }
        newSchedules = {
            ...newSchedules,
            [uuid.v4()]: 'test'
        }

        dispatchSetSelectedDevice({
            ...selectedDevice,
            schedules: newSchedules
        })
    }

    const renderPositionSchedule = () => {
        return (
            <styled.SectionsContainer>
                <styled.Label schema={'devices'} >Position Schedule</styled.Label>

                {!!selectedDevice.schedules && renderSchedules()}

                <Button
                    schema={'devices'}
                    style={{ display: 'inline-block', float: 'right', maxWidth: '25rem', boxSizing: 'border-box' }}
                    onClick={() => {
                        onAddSchedule()
                    }}
                >
                    Add Schedule
                </Button>
            </styled.SectionsContainer>
        )
    }

    const renderSchedules = () => {

        const renderDaySelector = () => {
            const daysOfTheWeek = ['M', 'T', 'W', 'Th', 'F', 'S', 'S']

            return daysOfTheWeek.map((day) => {
                return (
                    <styled.DayOfTheWeekContainer
                        checked={day === 'T' ? true : false}
                    >
                        <styled.DayOfTheWeekText>{day}</styled.DayOfTheWeekText>
                    </styled.DayOfTheWeekContainer>
                )
            })
        }

        return Object.values(selectedDevice.schedules).map((schedule, ind) => {

            return (
                <styled.ScheduleContainer>

                    <styled.RowContainer>
                        <styled.ScheduleLabel schema={'devices'} >Position Schedule {ind}</styled.ScheduleLabel>
                        <Switch
                            name={'chargeLevelSwitch'}
                            onColor='red'
                            checked={selectedDevice?.charge_level?.enabled}
                            onChange={() => {
                                dispatchSetSelectedDevice({
                                    ...selectedDevice,
                                    charge_level: {
                                        ...selectedDevice.charge_level,
                                        enabled: !selectedDevice?.charge_level?.enabled
                                    }
                                })
                            }}
                        />
                    </styled.RowContainer>

                    <styled.RowContainer style={{margin:'.2rem'}}>
                        {renderDaySelector()}
                    </styled.RowContainer>

                </styled.ScheduleContainer>

            )
        })
    }

    return (
        <>
            {renderPositionSchedule()}
        </>
    )
}

export default DeviceSchedule