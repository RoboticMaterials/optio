import React, { useState, useEffect, useMemo } from 'react';
import { FieldArray, useField, useFormikContext } from 'formik'

// Import style
import * as styled from './device_schedule.style'

import { getMessageFromError } from "../../../../../../methods/utils/form_utils";

const DayOfTheWeekButton = (props) => {

    const {
        day,
        onChange,
        index,
    } = props

    const { setFieldValue, setFieldTouched } = useFormikContext();
    const [field, meta] = useField(props);

    const {
        value: fieldValue,
        name: fieldName
    } = field

    const {
        touched,
        error
    } = meta

    const daysOnField = useField(`schedules.${index}.days_on`)
    const daysOnValue = daysOnField[0].value

    const hasError = touched && error;
    const errorMessage = getMessageFromError(error);

    return (
        <styled.DayOfTheWeekContainer
            checked={!!daysOnValue && daysOnValue.includes(day)}
            onClick={() => {

                if (!touched) setFieldTouched(fieldName, true)

                // If daysOnValue is falsy, then add the first day
                if (!daysOnValue) {
                    setFieldValue(`schedules.${index}.days_on`, [day])

                }
                // If it includes the day, then remove
                else if (daysOnValue.includes(day)) {
                    const ind = daysOnValue.indexOf(day)
                    daysOnValue.splice(ind, 1)
                    setFieldValue(`schedules.${index}.days_on`, daysOnValue)
                }
                // Else add the day
                else {
                    setFieldValue(`schedules.${index}.days_on`, [...daysOnValue, day])
                }
                onChange && onChange(day)

            }}
        >
            <styled.DayOfTheWeekText>{day}</styled.DayOfTheWeekText>
        </styled.DayOfTheWeekContainer>
    )
}

export default DayOfTheWeekButton