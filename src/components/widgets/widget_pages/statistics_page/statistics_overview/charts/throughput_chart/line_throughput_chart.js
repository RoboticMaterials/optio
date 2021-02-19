import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import moment from 'moment';
import { Formik, Form } from 'formik'

// Import Styles
import * as styled from '../charts.style'

// Import components
import TextField from '../../../../../../basic/form/text_field/text_field.js'
import Textbox from '../../../../../../basic/textbox/textbox'
import TimePickerField from '../../../../../../basic/form/time_picker_field/time_picker_field'
import Switch from 'react-ios-switch'

// Import Charts
import LineChart from '../../../chart_types/line_chart'

// Import utils
import { throughputSchema } from '../../../../../../../methods/utils/form_schemas'
import { convert12hto24h, convert24hto12h, convertTimeStringto24h, convert24htoInt, convertIntto24h } from '../../../../../../../methods/utils/time_utils'
import { deepCopy } from '../../../../../../../methods/utils/utils';


const testExpectedOutput = {
    startOfShift: '07:00',
    endOfShift: '20:00',
    expectedOutput: 200,
    breaks: {
        break1: {
            enabled: false,
            startOfBreak: '10:00',
            endOfBreak: '11:00',
        },
        break2: {
            enabled: false,
            startOfBreak: '12:00',
            endOfBreak: '13:00',
        },
        break3: {
            enabled: false,
            startOfBreak: '16:00',
            endOfBreak: '17:00',
        },
    },
}

const LineThroughputChart = (props) => {

    const {
        data,
        themeContext,
        isData
    } = props

    const [compareExpectedOutput, setCompareExpectedOutput] = useState(testExpectedOutput)
    const [convertedData, setConvertedData] = useState(null)

    // This ref is used for formik values.
    // The issue it solves is that the values the formik is comparing might have changed, and formik does not have the latest vlaues
    // IE: Change the end of the first break to be after the start of the second break; causes error. Fix error by adjusting second break, but the second break updated time is not availabel in formik so it still throughs an error
    const ref = useRef(null)

    useEffect(() => {
        lineDataConverter()
        return () => {

        }
    }, [])

    /**
    * This converts the incoming data for a line graph
    * IT does a few things
    * 1) Modifys the x axis based on start and end dates by converting input data to match the same format as incoming
    * 2) If there is an expected output, it adds that 
    * 3) If breaks, adds 'stagnate' (flat) sections to the graph when no parts are being processes
    * 
    */
    const lineDataConverter = () => {
        let convertedData = []

        let dataCopy = deepCopy(data)

        // Convert to int for comparison
        const startInt = convert24htoInt(compareExpectedOutput.startOfShift)
        let startIndex

        // Find Start of Shift in the data based on selected input
        for (let i = 0; i < dataCopy.length; i++) {
            // Convert to int for comparision
            const dataInt = convert24htoInt(dataCopy[i].x)
            // Go through the data until the time is equal to or after the start of shift input
            if (dataInt >= startInt) {
                startIndex = i
                break
            }

        }

        // Convert to int for comparison
        const endInt = convert24htoInt(compareExpectedOutput.endOfShift)

        let endIndex = dataCopy.length
        // Find end of Shift in the data based on selected input
        for (let i = 0; i < dataCopy.length; i++) {
            // Convert to int for comparision
            const dataInt = convert24htoInt(dataCopy[i].x)
            // Go through the data until the time is  after the end of shift input and take the vlaue before that one
            if (dataInt > endInt) {
                startIndex = i - 1
                break
            }
        }

        dataCopy = dataCopy.slice(startIndex, endIndex)
        // Modify y values
        let stack = 0
        for (const point of dataCopy) {
            convertedData.push({ x: convert24htoInt(point.x), y: stack + point.y })
            stack += point.y
        }

        // Add 0 for the start of the shift
        convertedData.unshift({ x: convert24htoInt(compareExpectedOutput.startOfShift), y: 0 })

        // Add the last value in converted data to the end of the shift
        convertedData.push({ x: convert24htoInt(compareExpectedOutput.endOfShift), y: convertedData[convertedData.length - 1].y })

        // This is the array of data that is passed to the line chart
        let expectedOutput = []

        // This array is used to find indexes in the expected output where a slope should be applied to
        // IE, where the expected output is not stagnant (part of a break)
        let slopeValues = []

        // Add Expected output
        if (!!compareExpectedOutput.expectedOutput) {

            // Add the beginning and end of each shift
            expectedOutput.push({ x: convert24htoInt(compareExpectedOutput.startOfShift), y: 0 })
            expectedOutput.push({ x: convert24htoInt(compareExpectedOutput.endOfShift), y: compareExpectedOutput.expectedOutput })
            slopeValues = expectedOutput.length

            // let slopeInd = 0
            // for (let i = convert24htoInt(compareExpectedOutput.startOfShift); i < convert24htoInt(compareExpectedOutput.endOfShift) + 1; i++) {
            //     const x = convertIntto24h(i)

            //     // Add to the array of slopeValues. Will be used for breaks
            //     slopeValues.push(slopeInd)
            //     expectedOutput.push({ x: x, y: null })
            //     slopeInd += 1
            // }

            /**
             * This handles breaks
             * It takes the start and end time of each break and then creates an array of all indexes of expected output that fall within that range
             * It also deletes values from slopeValues, slope values is used for points on the graph that have a slope
             * It then sets the stagnant value to the value at the start of the break
             * This creates flat spots in the expected output graph
             */
            let breakObj = {}
            const breaks = Object.values(compareExpectedOutput.breaks)
            breaks.forEach((b, ind) => {
                if (!b.enabled) return
                const start = b.startOfBreak
                const end = b.endOfBreak

                // // Find the start index in the array 
                // const matchedStartBreak = (el) => start === el
                // const startIndex = expectedOutput.findIndex(matchedStartBreak)
                // // Find the end index in the array
                // const matchEndBreak = (el) => end === el
                // const endIndex = expectedOutput.findIndex(matchEndBreak)

                // Find the value of y at startof the break using y = mx + b
                const m = (0 - compareExpectedOutput.expectedOutput) / (convert24htoInt(compareExpectedOutput.startOfShift) - convert24htoInt(compareExpectedOutput.endOfShift))
                const yStart = m * convert24htoInt(start)

                // Find where the x value fits and add the stagnent y value to the expected outPut
                for (let i = 0; i < expectedOutput.length; i++) {
                    const output = expectedOutput[i]
                    const nextOutput = expectedOutput[i + 1]

                    // If the output x is less or equal to the start and the next output is greater or equal to the start, then this is where the break belongs in the expectedOutput
                    if (output.x <= convert24htoInt(start) && nextOutput.x >= convert24htoInt(start)) {
                        expectedOutput.splice(i + 1, 0, { x: convert24htoInt(start), y: yStart })
                        expectedOutput.splice(i + 2, 0, { x: convert24htoInt(end), y: yStart })
                        break
                    }
                }




                // // Create an array the contains the indexes between the start and end index
                // let arrayIndexList = []
                // for (let i = startIndex + 1; i <= endIndex; i++) {
                //     slopeValues.splice(slopeValues.indexOf(i), 1)
                //     arrayIndexList.push(i)
                // }

                // // Add the created array to obj to use for creating the output data
                // breakObj = {
                //     ...breakObj,
                //     [ind]: arrayIndexList
                // }

            })

            // // Add slope y points
            // slopeValues.forEach((val, ind) => {
            //     expectedOutput[val].y = (ind / (slopeValues.length - 1)) * compareExpectedOutput.expectedOutput
            // })

            // // Add stagnent y points
            // Object.values(breakObj).forEach(b => {
            //     const stagnantValue = expectedOutput[b[0] - 1].y
            //     b.forEach(index => {
            //         expectedOutput[index].y = stagnantValue
            //     })
            // })

        }


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

                    // If the output is greater then the expoutput and less then the next exp output, it belongs hur
                    if (expOutput.x <= output.x && nextExpOutput.x >= output.x) {
                        // Find the value of y at the output x point using y = mx + b
                        // Point 1 on the slope is the expOutput and point 2 is the nextExpOutput
                        console.log('QQQQ expOutput', expOutput)
                        console.log('QQQQ next', nextExpOutput)
                        console.log('QQQQ X', output)
                        const m = (nextExpOutput.y - expOutput.y) / (nextExpOutput.x - expOutput.x)
                        const b = expOutput.y - m * expOutput.x
                        console.log('QQQQ b', b)
                        const yValue = m * output.x + b
                        console.log('QQQQ y value', yValue)
                        expectedOutput.splice(i + 1, 0, { x: output.x, y: yValue })
                        break
                    }
                }
            }
        })

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
                        const m = (nextExpOutput.y - expOutput.y) / (nextExpOutput.x - expOutput.x)
                        const yValue = m * output.x
                        convertedData.splice(i + 1, 0, { x: output.x, y: yValue })
                        break
                    }
                }
            }
        })

        const lineData = [{
            'id': 'actualData',
            "color": "hsl(182, 70%, 50%)",
            'data': convertedData

        },
        {
            'id': 'expectedOutput',
            "color": "hsl(120, 60%, 50%)",
            'data': expectedOutput

        },
        ]

        console.log('QQQQ Line Data', lineData)
        setConvertedData(lineData)
        return lineData
    }

    const renderBreaks = () => {

        const numberOfBreaks = [0, 1, 2]

        return numberOfBreaks.map((bk, ind) => {
            const adjustedInd = ind + 1

            const breakName = `Break ${adjustedInd}`
            const breakVar = `break${adjustedInd}`
            const breakStart = `startOfBreak${adjustedInd}`
            const breakEnd = `endOfBreak${adjustedInd}`
            return (
                <styled.RowContainer style={{ alignItems: 'center', minWidth: '23rem' }}>

                    <styled.RowContainer style={{ width: '100%', marginTop: '.25rem' }}>
                        <styled.Label>{breakName}</styled.Label>
                        <Switch
                            onColor='red'
                            checked={compareExpectedOutput.breaks[breakVar].enabled}
                            onChange={() => {
                                setCompareExpectedOutput({
                                    ...compareExpectedOutput,
                                    breaks: {
                                        ...compareExpectedOutput.breaks,
                                        [breakVar]: {
                                            ...compareExpectedOutput.breaks[breakVar],
                                            enabled: !compareExpectedOutput.breaks[breakVar].enabled,
                                        }
                                    }
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
                                disabled={!compareExpectedOutput.breaks[breakVar].enabled}
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
                                showMinute={false}
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
                                disabled={!compareExpectedOutput.breaks[breakVar].enabled}

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
                                showMinute={false}
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

    const renderForm = () => {
        return (
            <div style={{ flexGrow: '3' }}>
                <Formik
                    innerRef={ref}
                    initialValues={{
                        startOfShift: compareExpectedOutput.startOfShift,
                        endOfShift: compareExpectedOutput.endOfShift,
                        startOfBreak1: compareExpectedOutput.breaks.break1.startOfBreak,
                        endOfBreak1: compareExpectedOutput.breaks.break1.endOfBreak,
                        startOfBreak2: compareExpectedOutput.breaks.break2.startOfBreak,
                        endOfBreak2: compareExpectedOutput.breaks.break2.endOfBreak,
                        startOfBreak3: compareExpectedOutput.breaks.break3.startOfBreak,
                        endOfBreak3: compareExpectedOutput.breaks.break3.endOfBreak,
                        expectedOutput: compareExpectedOutput.expectedOutput,
                    }}

                    // validation control
                    validationSchema={throughputSchema(!!ref.current ? ref.current.values : null)}
                    validateOnChange={false}
                    // validateOnMount={true}
                    validateOnBlur={false}

                    onSubmit={async (values, { setSubmitting, setTouched, }) => {
                        setSubmitting(true)
                        console.log('QQQQ values', values)
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
                                onMouseDown={() => {
                                    // console.log('QQQQ Submitting form', errors)
                                    // if (Object.keys(errors).length === 0) {
                                    //     submitForm(errors)
                                    // }
                                }}
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
                                    {renderBreaks()}
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

    const onSubmitShift = (values) => {
        let {
            startOfShift,
            endOfShift,
            expectedOutput,
            startOfBreak1,
            endOfBreak1,
            startOfBreak2,
            endOfBreak2,
            startOfBreak3,
            endOfBreak3
        } = values

        setCompareExpectedOutput({
            startOfShift: startOfShift,
            endOfShift: endOfShift,
            expectedOutput: expectedOutput,
            breaks: {
                break1: {
                    ...compareExpectedOutput.breaks.break1,
                    startOfBreak: startOfBreak1,
                    endOfBreak: endOfBreak1,
                },
                break2: {
                    ...compareExpectedOutput.breaks.break2,
                    startOfBreak: startOfBreak2,
                    endOfBreak: endOfBreak2,
                },
                break3: {
                    ...compareExpectedOutput.breaks.break3,
                    startOfBreak: startOfBreak3,
                    endOfBreak: endOfBreak3,
                },
            },
        })
    }

    return (
        <styled.RowContainer>
            {renderForm()}
            <styled.PlotContainer style={{ flexGrow: '7' }} minHeight={27}>
                <LineChart
                    // data={filteredData ? filteredData : []}
                    // data={lineDataConverter()}
                    data={!!convertedData ? convertedData : []}
                    enableGridY={isData ? true : false}
                    yScale={{
                        type: 'linear',
                        // stacked: boolean('stacked', false),
                        // stacked: true,
                    }}
                    curve="monotoneX"
                    mainTheme={themeContext}
                    axisBottom={{
                        tickRotation: -90,
                    }}
                    axisLeft={{
                        enable: true,
                    }}
                />


            </styled.PlotContainer>
        </styled.RowContainer>
    )


}


export default LineThroughputChart