import React, { useState, useEffect, useMemo } from 'react';
import { FieldArray, useField, useFormikContext } from 'formik'

// Import style
import * as styled from './device_schedule.style'

const DayOfTheWeekButton = (props) => {

    const {
        checked,
        day,
    } = props

    const { setFieldValue, setFieldTouched } = useFormikContext();


    return (
        <styled.DayOfTheWeekContainer
            checked={checked}
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
}

export default DayOfTheWeekButton