import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";
import Calendar from 'react-calendar'
import { getMessageFromError } from "../../../../methods/utils/form_utils";

// import styles
import * as styled from './calendar_field.style'
import ErrorTooltip from "../error_tooltip/error_tooltip";
import { isEmpty } from "ramda";


const CalendarField = ({
    onChange,
    Container,
    onDropdownClose,
    startEnd,
    ...props
}) => {

    const { setFieldValue, setFieldTouched, ...formikContext } = useFormikContext();
    const [{ value, ...field }, { initialValue, ...meta }] = useField(props);
    const hasError = meta.touched && meta.error;

    const errorMessage = getMessageFromError(meta.error);

    const startYearVal = value?.start?.year || 0
    const startMonthVal = value?.start?.month || 0
    const startDayVal = value?.start?.day || 0

    const endYearVal = value?.end?.year || 0
    const endMonthVal = value?.end?.month || 0
    const endDayVal = value?.end?.day || 0

    const startDate = (startYearVal && (startMonthVal + 1) && startDayVal) ? new Date(startYearVal, startMonthVal, startDayVal, 0, 0, 0, 0) : new Date()
    const endDate = (endYearVal && (endMonthVal + 1) && endDayVal) ? new Date(endYearVal, endMonthVal, endDayVal, 0, 0, 0, 0) : null

    const isStart = startEnd === 'CALENDAR_START' ? true : false

    return (
        <Container>
            <styled.StyledCalendar
                onDropdownClose={() => {
                    // set this field to touched if not already

                    // call any additional function that was passed as prop
                    onDropdownClose && onDropdownClose();
                }}
                {...field}
                // selectRange={true}
                // value={[startDate, endDate]}
                // allowPartialRange
                value={!!isStart ? startDate : endDate}
                // minDate={!isStart ? (startDate) : null}
                // maxDate={isStart ? endDate : null}

                // defaultValue={[initialStartDate, initialEndDate]}
                // defaultActiveStartDate={initialStartDate}
                // defaultValue={value}
                {...props}
                onChange={changeValue => {
                    const isTouched = meta.touched;
                    if (!isTouched) {
                        setFieldTouched(true)
                    }

                    const date = changeValue

                    let month = date.getUTCMonth()
                    let day = date.getUTCDate();
                    let year = date.getUTCFullYear();

                    let newValue
                    // If start add Start
                    if (!!isStart) {
                        newValue = {
                            ...value,
                            start: { year, month, day }
                        }
                    }
                    // Else add end
                    else {
                        newValue = {
                            ...value,
                            end: { year, month, day }
                        }
                    }

                    // const startDate = value[0]


                    // let month = startDate.getUTCMonth()
                    // let day = startDate.getUTCDate();
                    // let year = startDate.getUTCFullYear();



                    // if (Array.isArray(value) && value.length > 1) {
                    //     const endDate = value[1]
                    //     let month = endDate.getUTCMonth()
                    //     let day = endDate.getUTCDate() - 1
                    //     let year = endDate.getUTCFullYear()
                    // }

                    setFieldValue(field.name, newValue);
                    onChange && onChange(value)
                }}
            />
            {/*</style.DefaultFieldDropdownContainer>*/}

            <ErrorTooltip
                visible={hasError}
                text={errorMessage}
                ContainerComponent={styled.IconContainerComponent}
            />
        </Container>
    );
};

// Specifies propTypes
CalendarField.propTypes = {
};

// Specifies the default values for props:
CalendarField.defaultProps = {
    Container: styled.DefaultContainer,
    onChange: null,
};

export default CalendarField;
