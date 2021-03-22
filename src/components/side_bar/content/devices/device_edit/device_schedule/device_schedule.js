import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { FieldArray } from 'formik'
import moment from 'moment';
import uuid from 'uuid';

// Import style
import * as styled from './device_schedule.style'

// Import Basic Components
import Button from '../../../../../basic/button/button'
import Switch from '../../../../../basic/form/switch_field/switch_field'
import DropDownSearchField from '../../../../../basic/form/drop_down_search_field/drop_down_search_field'
import TimePickerField from '../../../../../basic/form/time_picker_field/time_picker_field'
import Textbox from '../../../../../basic/textbox/textbox'
import TextField from '../../../../../basic/form/text_field/text_field'

// Import Actions
import { setSelectedDevice } from '../../../../../../redux/actions/devices_actions'

// Import Utils
import { deepCopy } from '../../../../../../methods/utils/utils'
import { convert12hto24h } from '../../../../../../methods/utils/time_utils'

// Import Constants
import { deviceSchedule } from '../../../../../../constants/scheduler_constants'

const DeviceSchedule = (props) => {

    const {
    } = props

    const dispatch = useDispatch()
    const dispatchSetSelectedDevice = (selectedDevice) => dispatch(setSelectedDevice(selectedDevice))

    const selectedDevice = useSelector(state => state.devicesReducer.selectedDevice)
    const positions = useSelector(state => state.positionsReducer.positions)

    const onAddSchedule = () => {

        let newSchedule = deepCopy(deviceSchedule)
        newSchedule.id = uuid.v4()

        let schedulesCopy = {}
        if (!!selectedDevice.schedules) {
            schedulesCopy = deepCopy(selectedDevice.schedules)
        }
        schedulesCopy = {
            ...schedulesCopy,
            [newSchedule.id]: newSchedule
        }

        dispatchSetSelectedDevice({
            ...selectedDevice,
            schedules: schedulesCopy
        })
    }

    const onUpdateSchedule = (id, attr) => {
        console.log('QQQQ updating this schedule', id, attr)

        dispatchSetSelectedDevice({
            ...selectedDevice,
            schedules: {
                ...selectedDevice.schedules,
                [id]: {
                    ...selectedDevice.schedules[id],
                    ...attr
                }
            }
        })
    }

    const onDeleteSchedule = (schedule) => {
        let schedulesCopy = deepCopy(selectedDevice.schedules)
        delete schedulesCopy[schedule.id]
        dispatchSetSelectedDevice({
            ...selectedDevice,
            schedules: schedulesCopy
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

        const renderDaySelector = (id) => {
            const daysOfTheWeek = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']

            return daysOfTheWeek.map((day) => {
                return (
                    <styled.DayOfTheWeekContainer
                        checked={selectedDevice.schedules[id].days_on.includes(day)}
                        onClick={() => {
                            let newDaysOn = deepCopy(selectedDevice.schedules[id].days_on)

                            // If day is in days array, remove
                            if (newDaysOn.includes(day)) {
                                const index = newDaysOn.indexOf(day)
                                newDaysOn.splice(index, 1)
                            }
                            // Else add
                            else {
                                newDaysOn.push(day)
                            }

                            newDaysOn = { days_on: newDaysOn }
                            onUpdateSchedule(id, newDaysOn)
                        }}
                    >
                        <styled.DayOfTheWeekText>{day}</styled.DayOfTheWeekText>
                    </styled.DayOfTheWeekContainer>
                )
            })
        }

        return (
            <FieldArray
                name='schedules'
                render={
                    Object.values(selectedDevice.schedules).map((schedule, ind) => {
                        return (
                            <styled.ScheduleContainer>

                                <styled.RowContainer>
                                    <TextField
                                        name={"scheduleName"}
                                        placeholder='Schedule Name'
                                        InputComponent={Textbox}
                                        ContentContainer={styled.RowContainer}
                                        style={{
                                            'marginBottom': '.5rem',
                                            'marginTop': '0',
                                            'width': '10rem',
                                        }}
                                    />
                                    <Switch
                                        name={'chargeLevelSwitch'}
                                        onColor='red'
                                        checked={schedule.enabled}
                                        onChange={() => {
                                            const enabled = { enabled: !schedule.enabled }
                                            onUpdateSchedule(schedule.id, enabled)
                                        }}
                                    />
                                </styled.RowContainer>

                                <styled.RowContainer style={{ margin: '.2rem' }}>
                                    {renderDaySelector(schedule.id)}
                                </styled.RowContainer>

                                <styled.RowContainer style={{ marginTop: '.5rem' }}>
                                    <DropDownSearchField
                                        containerSyle={{ flex: '9', marginRight: '1rem' }}
                                        pattern={null}
                                        name="moveLocation"
                                        labelField={'name'}
                                        options={Object.values(positions)}
                                        valueField={"_id"}
                                    />
                                    <TimePickerField
                                        mapInput={
                                            (value) => {
                                                if (value) {
                                                    const splitVal = value.split(':')
                                                    return moment().set({ 'hour': splitVal[0], 'minute': splitVal[1] })
                                                }
                                            }
                                        }
                                        mapOutput={(value) => {
                                            return convert12hto24h(value.format('hh:mm a'))
                                        }}
                                        name={'endOfShift'}
                                        containerStyle={{ width: '6rem' }}
                                        style={{ flex: '1', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
                                        showHour={true}
                                        showSecond={false}
                                        className="xxx"
                                        use12Hours
                                        format={'hh:mm a'}
                                        autocomplete={"off"}
                                        allowEmpty={false}
                                        defaultOpenValue={moment().set({ 'hour': 1, 'minute': 0 })}
                                        defaultValue={moment().set({ 'hour': 1, 'minute': 0 })}
                                    />

                                </styled.RowContainer>
                                <Button
                                    schema={'devices'}
                                    style={{ display: 'inline-block', float: 'right', maxWidth: '25rem', boxSizing: 'border-box' }}
                                    onClick={() => {
                                        onDeleteSchedule(schedule)
                                    }}
                                >
                                    Delete Schedule
                                </Button>

                            </styled.ScheduleContainer>

                        )
                    })
                }
            />
        )

        return Object.values(selectedDevice.schedules).map((schedule, ind) => {
            return (
                <styled.ScheduleContainer>

                    <styled.RowContainer>
                        <TextField
                            name={"scheduleName"}
                            placeholder='Schedule Name'
                            InputComponent={Textbox}
                            ContentContainer={styled.RowContainer}
                            style={{
                                'marginBottom': '.5rem',
                                'marginTop': '0',
                                'width': '10rem',
                            }}
                        />
                        <Switch
                            name={'chargeLevelSwitch'}
                            onColor='red'
                            checked={schedule.enabled}
                            onChange={() => {
                                const enabled = { enabled: !schedule.enabled }
                                onUpdateSchedule(schedule.id, enabled)
                            }}
                        />
                    </styled.RowContainer>

                    <styled.RowContainer style={{ margin: '.2rem' }}>
                        {renderDaySelector(schedule.id)}
                    </styled.RowContainer>

                    <styled.RowContainer style={{ marginTop: '.5rem' }}>
                        <DropDownSearchField
                            containerSyle={{ flex: '9', marginRight: '1rem' }}
                            pattern={null}
                            name="moveLocation"
                            labelField={'name'}
                            options={Object.values(positions)}
                            valueField={"_id"}
                        />
                        <TimePickerField
                            mapInput={
                                (value) => {
                                    if (value) {
                                        const splitVal = value.split(':')
                                        return moment().set({ 'hour': splitVal[0], 'minute': splitVal[1] })
                                    }
                                }
                            }
                            mapOutput={(value) => {
                                return convert12hto24h(value.format('hh:mm a'))
                            }}
                            name={'endOfShift'}
                            containerStyle={{ width: '6rem' }}
                            style={{ flex: '1', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
                            showHour={true}
                            showSecond={false}
                            className="xxx"
                            use12Hours
                            format={'hh:mm a'}
                            autocomplete={"off"}
                            allowEmpty={false}
                            defaultOpenValue={moment().set({ 'hour': 1, 'minute': 0 })}
                            defaultValue={moment().set({ 'hour': 1, 'minute': 0 })}
                        />

                    </styled.RowContainer>
                    <Button
                        schema={'devices'}
                        style={{ display: 'inline-block', float: 'right', maxWidth: '25rem', boxSizing: 'border-box' }}
                        onClick={() => {
                            onDeleteSchedule(schedule)
                        }}
                    >
                        Delete Schedule
                    </Button>

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