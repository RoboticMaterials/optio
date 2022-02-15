import React, { useState, useEffect, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import { Formik, Form } from 'formik'

// Import Components
import TextField from '../../../../basic/form/text_field/text_field.js'
import Textbox from '../../../../basic/textbox/textbox'
import TimePickerField from '../../../../basic/form/time_picker_field/time_picker_field'
import Switch from '../../../../basic/form/switch_field/switch_field'
import Button from '../../../../basic/button/button'

// Import Styles
import * as styled from './shift_settings.style'

// Import utils
import { throughputSchema } from '../../../../../methods/utils/form_schemas'
import { convert12hto24h } from '../../../../../methods/utils/time_utils'

// Import actions
import { postSettings } from '../../../../../redux/actions/settings_actions'
import { pageDataChanged } from '../../../../../redux/actions/sidebar_actions'

import { useTranslation } from 'react-i18next';

const ShiftSettings = (props) => {

    const { t, i18n } = useTranslation();

    const {
        themeContext,
        enableOutput,
    } = props


    const dispatch = useDispatch()
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))

    const settingsInReducer = useSelector(state => state.settingsReducer.settings)

    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)
    const [settings,setSettings] = useState(settingsInReducer)
    const [breaksEnabled, setBreaksEnabled] = useState({})
    const shiftDetails = settings.shiftDetails;

    // Settings local state here because enabled breaks needs to access breaks outside of formik
    // See the Switch below for more details
    useEffect(() => {
      console.log('QQQQ here')

        // If there's shift details
        if (!!settings.shiftDetails) {
            let enabledBreaks = {}
            Object.keys(settings.shiftDetails.breaks).forEach((br, ind) => {
                const enabled = settings.shiftDetails.breaks[br].enabled
                const breakString = `break${ind}`
                enabledBreaks[ind] = enabled
            })
            setBreaksEnabled(enabledBreaks)
        }
        else {
            setBreaksEnabled(null)
        }
        return () => {
        }
    }, [settings])

    // Submits the shift details to the backend via settings
    const onSubmitShift = (values) => {

        let {
            startOfShift,
            endOfShift,
            expectedOutput,
            startOfBreak1,
            endOfBreak1,
            switch1,
            startOfBreak2,
            endOfBreak2,
            switch2,
            startOfBreak3,
            endOfBreak3,
            switch3,
        } = values

        const shiftSettings = {
            startOfShift: startOfShift,
            endOfShift: endOfShift,
            expectedOutput: expectedOutput,
            breaks: {
                break1: {
                    enabled: switch1,
                    startOfBreak: startOfBreak1,
                    endOfBreak: endOfBreak1,
                },
                break2: {
                    ...shiftDetails.breaks.break2,
                    enabled: switch2,
                    startOfBreak: startOfBreak2,
                    endOfBreak: endOfBreak2,
                },
                break3: {
                    enabled: switch3,
                    startOfBreak: startOfBreak3,
                    endOfBreak: endOfBreak3,
                },
            },
        }

        dispatchPostSettings({
            ...settings,
            shiftDetails: shiftSettings,
        })


    }

    const renderBreaks = useMemo(() => {

        const numberOfBreaks = [0, 1, 2]

        return (
            <>
                    <styled.RowContainer style = {{width: '100%'}}>
                      <styled.ColumnContainer style={{ margin: '.25rem', flex: '3'}}>
                          <styled.BreakLabel>
                              Break #
                      </styled.BreakLabel>
                      </styled.ColumnContainer>
                        <styled.ColumnContainer style={{ margin: '.25rem', paddingRight: '2rem'}}>
                            <styled.BreakLabel>
                                Start Time
                        </styled.BreakLabel>
                        </styled.ColumnContainer>
                        <styled.ColumnContainer style={{ margin: '.25rem', paddingRight: '1.5rem'}}>
                            <styled.BreakLabel>
                                End Time
                        </styled.BreakLabel>
                        </styled.ColumnContainer>
                    </styled.RowContainer>
                {
                    numberOfBreaks.map((bk, ind) => {
                        const adjustedInd = ind + 1

                        // This uses useState
                        // The reasoning behind this, is to be able to enable/disable switches without going through formik submit
                        // This also allows to enable a break, but not effect the graph until submitted
                        const breakEnabled = breaksEnabled[ind]

                        const breakName = `${adjustedInd}`
                        const switchName = `switch${adjustedInd}`
                        const breakStart = `startOfBreak${adjustedInd}`
                        const breakEnd = `endOfBreak${adjustedInd}`
                        return (
                            <styled.RowContainer style={{width:'100%', minWidth: '20rem' }}>

                                <styled.RowContainer style={{ justifyContent: 'space-between', width: '100%', marginTop: '.25rem'}}>
                                    <styled.Label>{breakName}</styled.Label>
                                    <Switch
                                        name={switchName}
                                        schema={'statistics'}
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
                                            schema={'statistics'}
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
                                            containerStyle={{ width: '6.5rem' }}
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
                                            schema={'statistics'}
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
                                            containerStyle={{ width: '6rem', marginLeft: '1rem' }}
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
            validateOnBlur={true}

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
                    initialValues,
                    setSubmitting,
                    validateForm
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
                            borderRadius: '.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <styled.ColumnContainer>
                            <styled.RowContainer style={{ justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <styled.Label>
                                    {t("Settings.startofshift","Start of Shift")}
                            </styled.Label>
                                <TimePickerField
                                    schema={'statistics'}
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
                                    containerStyle={{ width: '7rem' }}
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
                            <styled.RowContainer style={{ justifyContent: 'space-between', borderBottom: '1px solid #b8b9bf', marginBottom: '0.5rem', paddingBottom: '0.5rem'}}>
                                <styled.Label>
                                    {t("Settings.endofshift","End of Shift")}
                            </styled.Label>
                                <TimePickerField
                                    schema={'statistics'}
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
                                    containerStyle={{ width: '7rem' }}
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

                            <styled.RowContainer style={{ justifyContent: 'space-between', }}>
                                <styled.Label>
                                    {t("Settings.breaks","Breaks")}
                            </styled.Label>
                            </styled.RowContainer>
                            {!!enableOutput &&
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
                            }

                        </styled.ColumnContainer>
                        <styled.BreakContainer>
                            {renderBreaks}
                        </styled.BreakContainer>
                        {/* <styled.RowContainer>

        </styled.RowContainer> */}
                        <Button schema={'settings'} disabled = {!pageInfoChanged} type={'submit'} style = {{margin: '.5rem 0rem 0rem 0rem'}}>{!!enableOutput ? t("Settings.calculateandsave","Recompute and save") : t("save","Save")}</Button>

                    </Form>
                )
            }}
        </Formik>
    )
}

ShiftSettings.defaultProps = {
    enableOutput: true
};

export default ShiftSettings
