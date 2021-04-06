import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { FieldArray, useField, useFormikContext } from 'formik'
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

// Import Componenets
import DayOfTheWeekButton from './day_of_the_week_button'

// Import Actions
import { setSelectedDevice } from '../../../../../../redux/actions/devices_actions'

// Import Utils
import { deepCopy } from '../../../../../../methods/utils/utils'
import { convert12hto24h } from '../../../../../../methods/utils/time_utils'

// Import Constants
import { deviceSchedule } from '../../../../../../constants/scheduler_constants'

const DeviceSchedule = (props) => {

    const {
        values
    } = props

    const dispatch = useDispatch()

    const selectedDevice = useSelector(state => state.devicesReducer.selectedDevice)
    const positions = useSelector(state => state.positionsReducer.positions)

    const renderSchedules = () => {

        const renderDaySelector = (id, ind1) => {
            const daysOfTheWeek = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']

            return daysOfTheWeek.map((day, ind2) => {
                return (
                    <DayOfTheWeekButton
                        name={`schedules.${ind1}.${day}`}
                        key={`day.${ind2}`}
                        day={day}
                        index={ind1}
                    />
                )
            })
        }

        return (
            <FieldArray
                name={'schedules'}
                validateOnChange={true}
                render={arrayHelpers => (
                    <styled.SectionsContainer>
                        <styled.Label schema={'devices'} >Position Schedule</styled.Label>
                        {!!values.schedules && values.schedules.map((schedule, ind) => {
                            return (
                                <styled.ScheduleContainer
                                    key={`schedule.${ind}`}
                                >

                                    <styled.RowContainer>
                                        <TextField
                                            name={`schedules.${ind}.name`}
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
                                            name={`schedules.${ind}.enabled`}
                                            schema={'devices'}
                                        // onColor='red'
                                        />
                                    </styled.RowContainer>

                                    <styled.RowContainer style={{ margin: '.2rem' }}>
                                        {renderDaySelector(schedule.id, ind)}
                                    </styled.RowContainer>

                                    <styled.RowContainer style={{ marginTop: '.5rem' }}>
                                        <DropDownSearchField
                                            name={`schedules.${ind}.position`}
                                            containerSyle={{ flex: '9', marginRight: '1rem' }}
                                            placeholder="Select Position"
                                            pattern={null}
                                            labelField={'name'}
                                            valueField={"_id"}
                                            options={Object.values(positions)}
                                            mapInput={(val) => {
                                                return [positions[val]]
                                            }}
                                            mapOutput={(val) => {
                                                return val[0]._id
                                            }}
                                        />
                                        <TimePickerField
                                            name={`schedules.${ind}.time`}
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
                                        type={'button'}
                                        style={{ display: 'inline-block', float: 'right', maxWidth: '25rem', boxSizing: 'border-box' }}
                                        secondary
                                        onClick={() => {
                                            // onDeleteSchedule(schedule)
                                            // Removes the values from formik. 
                                            // Otherwise you would delete and schedule and then when re-adding a new one, it owuld use the old valus
                                            arrayHelpers.remove(ind)
                                        }}
                                    >
                                        Delete Schedule
                                </Button>

                                </styled.ScheduleContainer>

                            )
                        }
                        )
                        }



                        <Button
                            schema={'devices'}
                            type={'button'}
                            style={{ display: 'inline-block', float: 'right', maxWidth: '25rem', boxSizing: 'border-box' }}
                            onClick={() => {
                                let newSchedule = deepCopy(deviceSchedule)
                                newSchedule.id = uuid.v4()
                                arrayHelpers.push(newSchedule)
                            }}
                        >
                            Add Schedule
                            </Button>
                    </styled.SectionsContainer>

                )
                }
            />
        )
    }

    return (
        <>
            {renderSchedules()}
        </>
    )
}

export default DeviceSchedule