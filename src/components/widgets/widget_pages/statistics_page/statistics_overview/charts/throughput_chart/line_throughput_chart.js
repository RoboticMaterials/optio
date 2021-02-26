import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment';
import { Formik, Form } from 'formik'

// Import Styles
import * as styled from '../charts.style'

// Import components
import TextField from '../../../../../../basic/form/text_field/text_field.js'
import Textbox from '../../../../../../basic/textbox/textbox'
import TimePickerField from '../../../../../../basic/form/time_picker_field/time_picker_field'
import Switch from '../../../../../../basic/form/switch_field/switch_field'

// Import Charts
import { ResponsiveLine, Line } from '@nivo/line'

// Import utils
import { throughputSchema } from '../../../../../../../methods/utils/form_schemas'
import { convert12hto24h, convert24hto12h, convertTimeStringto24h, convert24htoInt, convertIntto24h, convert24htoEpoch } from '../../../../../../../methods/utils/time_utils'
import { deepCopy } from '../../../../../../../methods/utils/utils';

// Import actions
import { postSettings } from '../../../../../../../redux/actions/settings_actions'
import { convertData } from '../../../../../../../redux/actions/report_event_actions';

const LineThroughputChart = (props) => {

    const {
        data,
        themeContext,
        isData,
        date,
    } = props

    // // This ref is used for formik values.
    // // The issue it solves is that the values the formik is comparing might have changed, and formik does not have the latest vlaues
    // // IE: Change the end of the first break to be after the start of the second break; causes error. Fix error by adjusting second break, but the second break updated time is not availabel in formik so it still throughs an error
    // const ref = useRef(null)

    const dispatch = useDispatch()
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))

    const settings = useSelector(state => state.settingsReducer.settings)

    const [breaksEnabled, setBreaksEnabled] = useState({})

    const shiftDetails = settings.shiftDetails;

    // Used for colors in line chart below
    const colors = { Actual: 'hsl(53, 84%, 50%)', Expected: 'hsl(120, 60%, 50%)' }

    // Settings local state here because enabled breaks needs to access breaks outside of formik
    // See the Switch below forme details
    useEffect(() => {

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

    /**
    * This converts the incoming data for a line graph
    * IT does a few things
    * 1) Converts incoming data to have the start and end of the shift 
    * 2) If theres an expected output, it adds thatline
    * 3) if they're breaks, It adds those as well (pretty complex so see comments below)
    * 
    * Uses usememo for performance reasons
    */
    const lineDataConverter = useMemo(() => {

        // The array of converted incoming data
        let convertedData = []

        let dataCopy = deepCopy(data)

        // Convert to epoch
        const startEpoch = convert24htoEpoch(shiftDetails.startOfShift, date)
        let startIndex

        // Find Start of Shift in the data based on selected input
        for (let i = 0; i < dataCopy.length; i++) {
            const dataDate = dataCopy[i].x
            // Go through the data until the time is equal to or after the start of shift input
            if (dataDate >= startEpoch) {
                startIndex = i
                break
            }
        }

        // Convert to epoch
        const endEpoch = convert24htoEpoch(shiftDetails.endOfShift, date)
        let endIndex = dataCopy.length
        // Find end of Shift in the data based on selected input
        for (let i = 0; i < dataCopy.length; i++) {
            const dataDate = dataCopy[i].x
            // Go through the data until the time is  after the end of shift input and take the vlaue before that one
            if (dataDate > endEpoch) {
                startIndex = i - 1
                break
            }
        }

        dataCopy = dataCopy.slice(startIndex, endIndex)
        // Modify y values to be stacked (IE add the next value to the total previous sum)
        let stack = 0
        for (const point of dataCopy) {
            convertedData.push({ x: point.x, y: stack + point.y })
            stack += point.y
        }

        // Delete all points after the end of the shift if there are any
        let pointsAfterShiftEnd = []
        for (let point of convertedData) {
            if (point.x > endEpoch) {
                const ind = convertedData.indexOf(data => data.x === point.x)
                console.log('QQQQ Index', ind)
                pointsAfterShiftEnd.push(ind)
            }
        }
        console.log('QQQQ Should be deleting these points', pointsAfterShiftEnd)
        pointsAfterShiftEnd.forEach((point) => {
            convertedData.splice(point, 1)
        })

        // Add 0 for the start of the shift
        convertedData.unshift({ x: startEpoch, y: 0 })

        // Add the last value in converted data to the end of the shift
        convertedData.push({ x: endEpoch, y: convertedData[convertedData.length - 1].y })

        // This is the array of data that is passed to the line chart
        let expectedOutput = []

        // These are the steps it takes to account for breaks
        // 1s) Create an array of minutes between the start and end of the shift
        // 2s) Subtract time that belongs to breaks
        // 3s) Find expected output sum for each point found in step 2
        // 4s) Find Y value for each existing point (start of shift, breaks, end of shift) in expected output line in the array generated in step 3

        // 1s) Create an array of minutes between the start and end of the shift
        // Iterates I by 1 minute in epoch times (1000 (converts to seconds) * 60 (converts to minutes))

        // This array is used to find indexes in the expected output where a slope should be applied to
        // IE, where the expected output is not stagnant (part of a break)
        let slopeValues = []
        for (let i = startEpoch; i <= endEpoch; i = i + 60000) {
            slopeValues.push(i)
        }

        // Add Expected output
        if (!!shiftDetails.expectedOutput) {

            // Add the beginning and end of each shift
            expectedOutput.push({ x: startEpoch, y: 0 })
            expectedOutput.push({ x: endEpoch, y: shiftDetails.expectedOutput })

            /**
             * This handles breaks
             * 1b) Finds where the start and end of the break belong inside of the expected output array and adds
             * 2b) Subtracts the breaks corresponding minutes from the slopeValues
             * 3b) Adds the start of the break to the start of breaks array to be used to find the y value of the end of the break
             */
            let startOfBreaks = []
            const breaks = Object.values(shiftDetails.breaks)
            breaks.forEach((br, ind) => {
                if (!br.enabled) return
                const start = convert24htoEpoch(br.startOfBreak, date)
                const end = convert24htoEpoch(br.endOfBreak, date)

                // Find the value of y at startof the break using y = mx + b
                // const m = (shiftDetails.expectedOutput - 0) / (endEpoch - startEpoch)
                // const b = shiftDetails.expectedOutput - m * endEpoch
                // const yStart = m * start + b


                // 1b) Find where the x value fits
                for (let i = 0; i < expectedOutput.length; i++) {
                    const output = expectedOutput[i]
                    const nextOutput = expectedOutput[i + 1]

                    // If the output x is less or equal to the start and the next output is greater or equal to the start, then this is where the break belongs in the expectedOutput
                    if (output.x <= start && nextOutput.x >= start) {
                        expectedOutput.splice(i + 1, 0, { x: start, y: 0 })
                        expectedOutput.splice(i + 2, 0, { x: end, y: 0 })
                        break
                    }
                }

                // 2s/2b) Subtract time that belongs to breaks (start at the next minut after the break starts)
                for (let i = start + 60000; i <= end; i = i + 60000) {
                    slopeValues = slopeValues.filter(item => item !== i)
                }

                // 3b) Add the start of the break
                startOfBreaks.push(start)

            })

            // 3s/4s)
            // Add slope y points to matching points in expected output
            slopeValues.forEach((val, ind) => {
                expectedOutput.forEach((output, ind2) => {
                    if (output.x !== val) {
                        return
                    }
                    else {
                        expectedOutput[ind2].y = (ind / (slopeValues.length - 1)) * shiftDetails.expectedOutput
                    }
                })
            })

            // 4s)
            // Add stagnent y points for each break
            expectedOutput.forEach((output, ind) => {

                // Add the start of the break y value to the end of the break
                // Ideally this is the next output after the start of the break
                if (startOfBreaks.includes(output.x)) {
                    expectedOutput[ind + 1].y = expectedOutput[ind].y
                }
            })

        }



        // These next 2 maps add the corresspoding points from each line to the other line
        // This allows for direct comparison between where you should be vs where you are

        // Update expected to have the same x values as converted
        convertedData.map((output, ind) => {
            let inExpected = false

            // Go through expected and see if the value is in it 
            for (let i = 0; i < expectedOutput.length; i++) {
                const expOutput = expectedOutput[i]
                // If the x's are the same, then its in it
                if (output.x === expOutput.x) {
                    inExpected = true
                    break
                }
            }

            // If not in expected, add it
            if (!inExpected) {
                // Find where it belongs
                for (let i = 0; i < expectedOutput.length; i++) {
                    const expOutput = expectedOutput[i]
                    const nextExpOutput = expectedOutput[i + 1]

                    if (nextExpOutput === undefined) {
                        continue
                    }

                    // If the output is greater then the expoutput and less then the next exp output, it belongs hur
                    else if (expOutput.x <= output.x && (nextExpOutput === undefined || nextExpOutput.x >= output.x)) {

                        // Find the value of y at the output x point using y = mx + b
                        // Point 1 on the slope is the expOutput and point 2 is the nextExpOutput
                        const m = (nextExpOutput.y - expOutput.y) / (nextExpOutput.x - expOutput.x)
                        const b = expOutput.y - m * expOutput.x
                        const yValue = m * output.x + b
                        expectedOutput.splice(i + 1, 0, { x: output.x, y: yValue })
                        break
                    }
                }
            }
        })

        if (expectedOutput.length > 0) {
            // Do the same to converted
            expectedOutput.map((output, ind) => {
                let inExpected = false

                // Go through expected and see if the value is in it 
                for (let i = 0; i < convertedData.length; i++) {
                    const expOutput = convertedData[i]
                    // If the x's are the same, then its in it
                    if (output.x === expOutput.x) {
                        inExpected = true
                        break
                    }
                }

                // If not in expected, add it
                if (!inExpected) {
                    // Find where it belongs
                    for (let i = 0; i < convertedData.length; i++) {
                        const expOutput = convertedData[i]
                        const nextExpOutput = convertedData[i + 1]

                        // If the output is greater then the expoutput and less then the next exp output, it belongs hur
                        if (expOutput.x <= output.x && nextExpOutput.x >= output.x) {

                            // Find the value of y at the output x point using y = mx + b
                            // Point 1 on the slope is the expOutput and point 2 is the nextExpOutput
                            const m = (nextExpOutput.y - expOutput.y) / (nextExpOutput.x - expOutput.x)
                            const b = expOutput.y - m * expOutput.x
                            const yValue = m * output.x + b
                            convertedData.splice(i + 1, 0, { x: output.x, y: yValue })
                            break
                        }
                    }
                }
            })
        }


        // Now convert all x values to times from Epoch
        // Nivo cant handle epoch for some reason
        convertedData.forEach((data, i) => {
            convertedData[i] = { x: new Date(data.x), y: data.y }
        })
        expectedOutput.forEach((data, i) => {
            expectedOutput[i] = { x: new Date(data.x), y: data.y }
        })

        const lineData = [{
            "id": 'Actual',
            "color": "hsl(182, 70%, 50%)",
            "data": convertedData

        },
        {
            "id": 'Expected',
            "color": "hsl(120, 60%, 50%)",
            "data": expectedOutput

        },
        ]

        console.log('QQQQ Line Data', lineData)
        return lineData
    }, [shiftDetails])

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

        return numberOfBreaks.map((bk, ind) => {
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
                            onColor='red'
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
                            <styled.BreakLabel>
                                Start of Break
                        </styled.BreakLabel>
                            <TimePickerField
                                disabled={!breakEnabled}
                                mapInput={
                                    (value) => {
                                        if (value) {
                                            const time24hr = convert12hto24h(value)
                                            const splitVal = time24hr.split(':')
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
                            <styled.BreakLabel>
                                End of Break
                            </styled.BreakLabel>
                            <TimePickerField
                                disabled={!breakEnabled}
                                mapInput={
                                    (value) => {
                                        if (value) {
                                            const time24hr = convert12hto24h(value)
                                            const splitVal = time24hr.split(':')
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
    }, [shiftDetails, breaksEnabled])

    const renderForm = () => {
        return (
            <div style={{ flexGrow: '3' }}>
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
                    validateOnChange={false}
                    validateOnMount={true}
                    validateOnBlur={false}

                    onSubmit={async (values, { setSubmitting, setTouched, }) => {
                        setSubmitting(true)
                        onSubmitShift(values)
                        setSubmitting(false)
                    }}
                >
                    {formikProps => {
                        const {
                            submitForm,
                            setValidationSchema,
                            value,
                            errors,
                        } = formikProps



                        return (
                            <Form
                                style={{
                                    backgroundColor: '#6c6e78',
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
                                            mapInput={
                                                (value) => {
                                                    if (value) {
                                                        const time24hr = convert12hto24h(value)
                                                        const splitVal = time24hr.split(':')
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
                                            mapInput={
                                                (value) => {
                                                    if (value) {
                                                        const time24hr = convert12hto24h(value)
                                                        const splitVal = time24hr.split(':')
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
                                                width: '6rem',
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
                                <styled.ChartButton type='submit' >Calculate</styled.ChartButton>


                            </Form>
                        )
                    }}
                </Formik>
            </div>
        )
    }

    return (
        <styled.RowContainer>
            {breaksEnabled !== null &&
                <>
                    {renderForm()}
                    < styled.PlotContainer style={{ flexGrow: '7' }} minHeight={27}>
                        <ResponsiveLine
                            data={lineDataConverter}
                            // data={!!convertedData ? convertedData : []}
                            colors={line => colors[line.id]}

                            xScale={{ type: "time" }}
                            xFormat="time:%H:%M"
                            yFormat={value => Math.round(value)}
                            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}

                            axisTop={null}
                            axisRight={null}
                            axisBottom={{ format: "%H:%M", tickRotation: 45 }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 5,
                                tickOffset: 10,
                                tickValues: 4
                            }}
                            axisLeft={{
                                enable: true,
                            }}

                            animate={true}
                            useMesh={true}

                            enablePoints={true}
                            pointSize={5}
                            pointBorderWidth={1}
                            pointBorderColor={{ from: 'white' }}
                            pointLabel="y"
                            pointLabelYOffset={-12}

                            margin={{ top: 22, left: 70, right: 70, bottom: 30 }}
                            enableGridY={isData ? true : false}

                            // curve="monotoneX"
                            // mainTheme={themeContext}
                            legends={[
                                {
                                    anchor: 'top-left',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 10,
                                    translateY: 0,
                                    itemsSpacing: 0,
                                    itemDirection: 'left-to-right',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }]}
                            theme={{
                                textColor: '#ffffff',
                                axis: {
                                    ticks: {
                                        line: {
                                            stroke: "fff",
                                        },
                                        // text: {
                                        //     fill: "fff",
                                        //     textColor: '#ffffff',
                                        //     // fontFamily: 'Montserrat',
                                        //     fontSize: "0.8rem"
                                        // },
                                    }
                                },
                                grid: {
                                    line: {
                                        stroke: '#55575e',
                                        strokeWidth: 1,
                                    }
                                },
                                crosshair: {
                                    line: {
                                        stroke: "#fff",
                                        strokeDasharray: "0"
                                    }
                                }
                            }}

                        />


                    </styled.PlotContainer>
                </>

            }
        </styled.RowContainer >
    )


}


export default LineThroughputChart