import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import { Formik, Form } from 'formik'

const LineThroughputForm = () => {

    const renderBreaks = useMemo(() => {

        const numberOfBreaks = [0, 1, 2]

        return (
            <>
                <styled.RowContainer style={{ alignItems: 'center', minWidth: '23rem' }}>

                    <styled.RowContainer style={{ width: '100%' }}>

                    </styled.RowContainer>
                    <styled.RowContainer>
                        <styled.ColumnContainer style={{ margin: '.25rem', width: '6rem' }}>
                            <styled.BreakLabel>
                                Start of Break
                        </styled.BreakLabel>
                        </styled.ColumnContainer>
                        <styled.ColumnContainer style={{ margin: '.25rem', width: '6rem' }}>
                            <styled.BreakLabel>
                                End of Break
                        </styled.BreakLabel>
                        </styled.ColumnContainer>
                    </styled.RowContainer>
                </styled.RowContainer>

                {
                    numberOfBreaks.map((bk, ind) => {
                        const adjustedInd = ind + 1

                        // This uses useState
                        // The reasoning behind this, is to be able to enable/disable switches without going through formik submit
                        // This also allows to enable a break, but not effect the graph until submitted
                        const breakEnabled = breaksEnabled[ind]

                        const breakName = `Break ${adjustedInd}`
                        const switchName = `switch${adjustedInd}`
                        const breakStart = `startOfBreak${adjustedInd}`
                        const breakEnd = `endOfBreak${adjustedInd}`
                        return (
                            <styled.RowContainer style={{ alignItems: 'center', minWidth: '23rem' }}>

                                <styled.RowContainer style={{ width: '100%', marginTop: '.25rem' }}>
                                    <styled.Label>{breakName}</styled.Label>
                                    <Switch
                                        name={switchName}
                                        schema={'charts'}
                                        checked={breaksEnabled[ind]}
                                        onChange={() => {
                                            setBreaksEnabled({
                                                ...breaksEnabled,
                                                [ind]: !breakEnabled
                                            })
                                        }}
                                    />
                                </styled.RowContainer>
                                <styled.RowContainer>
                                    <styled.ColumnContainer style={{ margin: '.25rem' }}>
                                        {/* <styled.BreakLabel>
                                        Start of Break
                                </styled.BreakLabel> */}
                                        <TimePickerField
                                            disabled={!breakEnabled}
                                            schema={'charts'}
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
                                            name={breakStart}
                                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
                                            containerStyle={{ width: '6rem' }}
                                            showHour={true}
                                            showMinute={true}
                                            showSecond={false}
                                            className="xxx"
                                            use12Hours
                                            format={'hh:mm a'}
                                            autocomplete={"off"}
                                            allowEmpty={false}
                                            defaultOpenValue={moment().set({ 'hour': 1, 'minute': 0 })}
                                            defaultValue={moment().set({ 'hour': 1, 'minute': 0 })}
                                        />
                                    </styled.ColumnContainer>
                                    <styled.ColumnContainer style={{ margin: '.25rem' }}>
                                        {/* <styled.BreakLabel>
                                        End of Break
                                    </styled.BreakLabel> */}
                                        <TimePickerField
                                            disabled={!breakEnabled}
                                            schema={'charts'}
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
                                            name={breakEnd}
                                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
                                            containerStyle={{ width: '6rem' }}
                                            showHour={true}
                                            showMinute={true}
                                            showSecond={false}
                                            className="xxx"
                                            use12Hours
                                            format={'hh:mm a'}
                                            autocomplete={"off"}
                                            allowEmpty={false}
                                            defaultOpenValue={moment().set({ 'hour': 1, 'minute': 0 })}
                                            defaultValue={moment().set({ 'hour': 1, 'minute': 0 })}
                                        />
                                    </styled.ColumnContainer>
                                </styled.RowContainer>
                            </styled.RowContainer>
                        )
                    })
                }
            </>
        )

    }, [shiftDetails, breaksEnabled])

    return (
        <Formik
            initialValues={{
                startOfShift: shiftDetails.startOfShift,
                endOfShift: shiftDetails.endOfShift,
                startOfBreak1: shiftDetails.breaks.break1.startOfBreak,
                endOfBreak1: shiftDetails.breaks.break1.endOfBreak,
                switch1: shiftDetails.breaks.break1.enabled,
                startOfBreak2: shiftDetails.breaks.break2.startOfBreak,
                endOfBreak2: shiftDetails.breaks.break2.endOfBreak,
                switch2: shiftDetails.breaks.break2.enabled,
                startOfBreak3: shiftDetails.breaks.break3.startOfBreak,
                endOfBreak3: shiftDetails.breaks.break3.endOfBreak,
                switch3: shiftDetails.breaks.break3.enabled,
                expectedOutput: shiftDetails.expectedOutput,
            }}

            // validation control
            validationSchema={throughputSchema}
            validateOnChange={true}
            validateOnMount={false}
            validateOnBlur={false}

            onSubmit={async (values, { setSubmitting, setTouched, validateForm, resetForm }) => {

                setSubmitting(true)
                onSubmitShift(values)
                setSubmitting(false)
                setTouched({})
                dispatchPageDataChanged(false)
            }}
        >
            {formikProps => {

                const {
                    submitForm,
                    setValidationSchema,
                    values,
                    errors,
                    touched,
                    initialValues
                } = formikProps


                if (Object.keys(touched).length > 0) {
                    dispatchPageDataChanged(true)
                }

                return (
                    <Form
                        style={{
                            backgroundColor: themeContext.bg.primary,
                            boxShadow: themeContext.cardShadow,
                            padding: '.5rem',
                            borderRadius: '.5rem'
                        }}
                    >
                        <styled.ColumnContainer>
                            <styled.Label>Shift Details</styled.Label>
                            <styled.RowContainer style={{ justifyContent: 'space-between' }}>
                                <styled.Label>
                                    Start of Shift
                            </styled.Label>
                                <TimePickerField
                                    schema={'charts'}
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
                                    name={'startOfShift'}
                                    style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
                                    containerStyle={{ width: '6rem' }}
                                    showHour={true}
                                    formikProps
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
                            <styled.RowContainer style={{ justifyContent: 'space-between' }}>
                                <styled.Label>
                                    End of Shift
                            </styled.Label>
                                <TimePickerField
                                    schema={'charts'}
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
                                    style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
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

                            <styled.RowContainer style={{ justifyContent: 'space-between' }}>
                                <styled.Label>
                                    Expected Output
                            </styled.Label>
                                <TextField
                                    name={"expectedOutput"}
                                    placeholder='Qty'
                                    InputComponent={Textbox}
                                    ContentContainer={styled.RowContainer}
                                    style={{
                                        'fontSize': '1rem',
                                        'fontWeight': '600',
                                        'marginBottom': '.5rem',
                                        'marginTop': '0',
                                        'width': '6rem',
                                    }}
                                />
                            </styled.RowContainer>

                        </styled.ColumnContainer>
                        <styled.BreakContainer>
                            <styled.Label>Breaks</styled.Label>
                            {renderBreaks}
                        </styled.BreakContainer>
                        {/* <styled.RowContainer>

        </styled.RowContainer> */}
                        <styled.ChartButton type={'submit'}>Calculate and Save</styled.ChartButton>


                    </Form>
                )
            }}
        </Formik>
    )
}

export default LineThroughputForm