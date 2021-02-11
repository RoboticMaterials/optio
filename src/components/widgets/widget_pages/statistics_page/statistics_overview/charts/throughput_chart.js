import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { Formik, Form } from 'formik'
import moment from 'moment';

// Import Styles
import * as styled from './charts.style'
import { ThemeContext } from 'styled-components';

// Import components
import Textbox from '../../../../../basic/textbox/textbox'
import TimePickerField from '../../../../../basic/form/time_picker_field/time_picker_field'

// Import Charts
import BarChart from '../../chart_types/bar_chart'
import LineChart from '../../chart_types/line_chart'

// Import utils
import { throughputSchema } from '../../../../../../methods/utils/form_schemas'
import { convert12hto24h, convert24hto12h, convertTimeStringto24h } from '../../../../../../methods/utils/time_utils'
import { deepCopy } from '../../../../../../methods/utils/utils';

const testData = [
    {
        "x": "8 am",
        "y": 0
    },
    {
        "x": "9 am",
        "y": 251
    },
    {
        "x": "10 am",
        "y": 83
    },
    {
        "x": "11 am",
        "y": 0
    },
    {
        "x": "12 am",
        "y": 85
    },
    {
        "x": "1 pm",
        "y": 0
    },
    {
        "x": "2 pm ",
        "y": 75
    },
    {
        "x": "3 pm ",
        "y": 73
    },
    {
        "x": "4 pm ",
        "y": 75
    },
    {
        "x": "5 pm",
        "y": 0
    },
    {
        "x": "6 pm",
        "y": 69
    },
    {
        "x": "7 pm",
        "y": 212
    },
    {
        "x": "8 pm",
        "y": 33
    }
]

const ThroughputChart = (props) => {

    const themeContext = useContext(ThemeContext);

    const [compareExpectedOutput, setCompareExpectedOutput] = useState({
        startOfShift: '08:00',
        endOfShift: '20:00',
        expectedOutput: 1100,
        breaks: {
            break1: {
                startOfBreak: '10:00',
                endOfBreak: '11:00',
            },
            break2: {
                startOfBreak: '12:00',
                endOfBreak: '13:00',
            },
            break3: {
                startOfBreak: '16:00',
                endOfBreak: '17:00',
            },
        },
    })
    // const [compareExpectedOutput, setCompareExpectedOutput] = useState(null)

    const {
        throughputData,
        isThroughputLoading,
        timeSpan,
    } = props

    const filteredData = throughputData?.throughPut

    const minHeight = 0

    const isData = (filteredData && Array.isArray(filteredData) && filteredData.length > 0)

    /**
     * This converts the incoming data for a line graph
     * IT does a few things
     * 1) Modifys the x axis based on start and end dates by converting input data to match the same format as incoming
     * 2) If there is an expected output, it adds that 
     * 3) If breaks, adds 'stagnate' (flat) sections to the graph when no parts are being processes
     * 
     */
    const lineDataConver = () => {
        let convertedData = []

        let dataCopy = deepCopy(testData)

        // Modify X values based on start and end
        const startOfShift12h = convert24hto12h(compareExpectedOutput.startOfShift)
        let startOfShiftHour = startOfShift12h.split(':')[0]
        // If the first character is a 0 then delete, the backend does not have 0 as the first character
        if (startOfShiftHour.charAt(0) == 0) startOfShiftHour = startOfShiftHour.substring(1)
        const startOfShiftModifier = startOfShift12h.split(' ')[1]
        const startOfShift = `${startOfShiftHour} ${startOfShiftModifier}`
        let startIndex
        // Find Start of Shift in the test data based on selected inpt
        for (let i = 0; i < dataCopy.length; i++) {
            if (dataCopy[i].x === startOfShift) startIndex = i
        }

        const endOfShift12h = convert24hto12h(compareExpectedOutput.endOfShift)
        let endOfShiftHour = endOfShift12h.split(':')[0]
        if (endOfShiftHour.charAt(0) == 0) endOfShiftHour = endOfShiftHour.substring(1)
        const endOfShiftModifier = endOfShift12h.split(' ')[1]
        const endOfShift = `${endOfShiftHour} ${endOfShiftModifier}`

        let endIndex
        // Find End of shift
        for (let i = 0; i < dataCopy.length; i++) {
            if (dataCopy[i].x === endOfShift) endIndex = i + 1
        }

        dataCopy = dataCopy.slice(startIndex, endIndex)

        // Modify y values
        let stack = 0
        for (const point of dataCopy) {
            convertedData.push({ x: point.x, y: stack + point.y })
            stack += point.y
        }

        // This is the array of data that is passed to the line chart
        let expectedOutput = []

        // This array is used to find indexes in the expected output where a slope should be applied to
        // IE, where the expected output is not stagnant (part of a break)
        let slopeValues = []

        // Add Expected output
        if (!!compareExpectedOutput.expectedOutput) {

            for (let i = 0; i < dataCopy.length; i++) {
                slopeValues.push(i)
                expectedOutput.push({ x: dataCopy[i].x, y: null })
            }

            /**
             * This handles breaks
             * It takes the start and end time of each break and then creates an array of all indexes of expected output that fall within that range
             * It also deletes values from slopeValues, slope values is used for points on the graph that have a slope
             * It then sets the stagnant value to the value at the start of the break
             * This creates flat spots in the expected output graph
             */
            // TODO: this will probably change depending on how we bin data together
            let breakObj = {}
            const breaks = Object.values(compareExpectedOutput.breaks)
            breaks.forEach((b, ind) => {

                const start = b.startOfBreak
                const end = b.endOfBreak

                // Convert expected output to times
                let convertedOutput = []
                expectedOutput.forEach((output) => {
                    const convert = convertTimeStringto24h(output.x)
                    convertedOutput.push(convert)
                })


                // Find the start index in the array 
                // TODO: Probably pass through a function that finds the closest time
                const matchedStartBreak = (el) => start === el
                const startIndex = convertedOutput.findIndex(matchedStartBreak)
                // Find the end index in the array
                const matchEndBreak = (el) => end === el
                const endIndex = convertedOutput.findIndex(matchEndBreak)

                // Create an array the contains the indexes between the start and end index
                let arrayIndexList = []
                for (let i = startIndex + 1; i <= endIndex; i++) {
                    slopeValues.splice(slopeValues.indexOf(i), 1)
                    arrayIndexList.push(i)
                }

                // Add the created array to obj to use for creating the output data
                breakObj = {
                    ...breakObj,
                    [ind]: arrayIndexList
                }

            })


            // Add slope y points
            slopeValues.forEach((val, ind) => {
                expectedOutput[val].y = (ind / (slopeValues.length - 1)) * compareExpectedOutput.expectedOutput
            })

            // Add stagnent y points
            Object.values(breakObj).forEach(b => {
                const stagnantValue = expectedOutput[b[0] - 1].y
                b.forEach(index => {
                    expectedOutput[index].y = stagnantValue
                })
            })

        }

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

        return lineData
    }

    const renderBreaks = () => {
        return (
            <styled.RowContainer>
                <styled.BreakContainer>
                    <styled.ColumnContainer>
                        <styled.Label>
                            Start of Break
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
                                return value.format("hh:mm a")
                            }}
                            name={'startOfBreak1'}
                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
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
                            onChange={(time) => {
                                const string = convert12hto24h(time.format("hh:mm a"))
                                setCompareExpectedOutput({
                                    ...compareExpectedOutput,
                                    breaks: {
                                        ...compareExpectedOutput.breaks,
                                        break1: {
                                            ...compareExpectedOutput.breaks.break1,
                                            startOfBreak: string
                                        }
                                    }
                                })
                            }}
                        />
                    </styled.ColumnContainer>
                    <styled.ColumnContainer>
                        <styled.Label>
                            End of Break
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
                                return value.format("hh:mm a")
                            }}
                            name={'endOfBreak1'}
                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
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
                            onChange={(time) => {
                                const string = convert12hto24h(time.format("hh:mm a"))
                                setCompareExpectedOutput({
                                    ...compareExpectedOutput,
                                    breaks: {
                                        ...compareExpectedOutput.breaks,
                                        break1: {
                                            ...compareExpectedOutput.breaks.break1,
                                            endOfBreak: string
                                        }
                                    }
                                })
                            }}
                        />
                    </styled.ColumnContainer>
                </styled.BreakContainer>

                <styled.BreakContainer>
                    <styled.ColumnContainer>
                        <styled.Label>
                            Start of Break
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
                                return value.format("hh:mm a")
                            }}
                            name={'startOfBreak2'}
                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
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
                            onChange={(time) => {
                                const string = convert12hto24h(time.format("hh:mm a"))
                                setCompareExpectedOutput({
                                    ...compareExpectedOutput,
                                    breaks: {
                                        ...compareExpectedOutput.breaks,
                                        break2: {
                                            ...compareExpectedOutput.breaks.break2,
                                            startOfBreak: string
                                        }
                                    }
                                })
                            }}
                        />
                    </styled.ColumnContainer>
                    <styled.ColumnContainer>
                        <styled.Label>
                            End of Break
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
                                return value.format("hh:mm a")
                            }}
                            name={'endOfBreak2'}
                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
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
                            onChange={(time) => {
                                const string = convert12hto24h(time.format("hh:mm a"))
                                setCompareExpectedOutput({
                                    ...compareExpectedOutput,
                                    breaks: {
                                        ...compareExpectedOutput.breaks,
                                        break2: {
                                            ...compareExpectedOutput.breaks.break2,
                                            endOfBreak: string
                                        }
                                    }
                                })
                            }}
                        />
                    </styled.ColumnContainer>
                </styled.BreakContainer>

                <styled.BreakContainer>
                    <styled.ColumnContainer>
                        <styled.Label>
                            Start of Break
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
                                return value.format("hh:mm a")
                            }}
                            name={'startOfBreak3'}
                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
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
                            onChange={(time) => {
                                const string = convert12hto24h(time.format("hh:mm a"))
                                setCompareExpectedOutput({
                                    ...compareExpectedOutput,
                                    breaks: {
                                        ...compareExpectedOutput.breaks,
                                        break3: {
                                            ...compareExpectedOutput.breaks.break3,
                                            startOfBreak: string
                                        }
                                    }
                                })
                            }}
                        />
                    </styled.ColumnContainer>
                    <styled.ColumnContainer>
                        <styled.Label>
                            End of Break
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
                                return value.format("hh:mm a")
                            }}
                            name={'endOfBreak3'}
                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
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
                            onChange={(time) => {
                                const string = convert12hto24h(time.format("hh:mm a"))
                                setCompareExpectedOutput({
                                    ...compareExpectedOutput,
                                    breaks: {
                                        ...compareExpectedOutput.breaks,
                                        break3: {
                                            ...compareExpectedOutput.breaks.break3,
                                            endOfBreak: string
                                        }
                                    }
                                })
                            }}
                        />
                    </styled.ColumnContainer>
                </styled.BreakContainer>
            </styled.RowContainer>
        )
    }

    return (
        <styled.SinglePlotContainer
            minHeight={minHeight}
        >
            <styled.PlotHeader>
                <styled.PlotTitle>Throughput</styled.PlotTitle>
                <styled.ChartButton onClick={() => setCompareExpectedOutput(!compareExpectedOutput)} >Compare Expected output</styled.ChartButton>
                {!!compareExpectedOutput &&
                    <Formik
                        initialValues={{
                            startOfShift: compareExpectedOutput.startOfShift,
                            endOfShift: compareExpectedOutput.endOfShift,
                            startOfBreak1: compareExpectedOutput.breaks.break1.startOfBreak,
                            endOfBreak1: compareExpectedOutput.breaks.break1.endOfBreak,
                            startOfBreak2: compareExpectedOutput.breaks.break2.startOfBreak,
                            endOfBreak2: compareExpectedOutput.breaks.break2.endOfBreak,
                            startOfBreak3: compareExpectedOutput.breaks.break3.startOfBreak,
                            endOfBreak3: compareExpectedOutput.breaks.break3.endOfBreak,
                        }}

                        // validation control
                        validationSchema={throughputSchema(compareExpectedOutput)}
                        validateOnChange={true}
                        validateOnMount={true}
                        validateOnBlur={true}

                        onSubmit={async (values, { setSubmitting, setTouched }) => {
                            setSubmitting(true)
                            console.log('QQQQ Values', values)
                            setSubmitting(false)
                        }}
                    >
                        {formikProps => {
                            const {
                                submitForm,
                                errors,
                            } = formikProps
                            return (
                                <Form
                                    onMouseDown={() => {
                                        console.log('QQQQ Submitting form', errors)
                                        submitForm()
                                    }}
                                >
                                    <styled.RowContainer>

                                        <styled.ColumnContainer>
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
                                                    return value.format("hh:mm a")
                                                }}
                                                name={'startOfShift'}
                                                style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
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
                                                onChange={(time) => {
                                                    const string = convert12hto24h(time.format("hh:mm a"))
                                                    setCompareExpectedOutput({
                                                        ...compareExpectedOutput,
                                                        startOfShift: string
                                                    })
                                                }}
                                            />
                                        </styled.ColumnContainer>
                                        <styled.ColumnContainer>
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
                                                    return value.format("hh:mm a")
                                                }}
                                                name={'endOfShift'}
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
                                                onChange={(time) => {
                                                    const string = convert12hto24h(time.format("hh:mm a"))
                                                    setCompareExpectedOutput({
                                                        ...compareExpectedOutput,
                                                        endOfShift: string
                                                    })
                                                }}
                                            />
                                        </styled.ColumnContainer>

                                        <Textbox
                                            value={!!compareExpectedOutput && !!compareExpectedOutput.expectedOutput ? compareExpectedOutput.expectedOutput : ''}
                                            onChange={(e) => {
                                                setCompareExpectedOutput({
                                                    ...compareExpectedOutput,
                                                    expectedOutput: e.target.value
                                                })
                                            }}
                                            label={'Expected Output'}
                                            inline={true}
                                            labelStyle={{ fontSize: '1rem' }}
                                        />
                                    </styled.RowContainer>
                                    {renderBreaks()}

                                    {/* <styled.RowContainer>

                                    </styled.RowContainer> */}

                                </Form>
                            )
                        }}
                    </Formik>

                }
            </styled.PlotHeader>


            {isThroughputLoading ?
                <styled.PlotContainer>
                    <styled.LoadingIcon className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem', marginTop: '5rem' }} />
                </styled.PlotContainer>
                :

                <styled.PlotContainer
                    minHeight={minHeight}
                >

                    {!!compareExpectedOutput ?

                        <LineChart
                            // data={filteredData ? filteredData : []}
                            data={lineDataConver()}
                            enableGridY={isData ? true : false}
                            mainTheme={themeContext}
                            timeSpan={timeSpan}
                            axisBottom={{
                                tickRotation: -90,
                            }}
                            axisLeft={{
                                enable: true,
                            }}
                        />
                        :
                        <BarChart
                            data={filteredData ? filteredData : []}
                            enableGridY={isData ? true : false}
                            mainTheme={themeContext}
                            timeSpan={timeSpan}
                            axisBottom={{
                                tickRotation: -90,
                            }}
                            axisLeft={{
                                enable: true,
                            }}
                        />

                    }


                    {!throughputData &&
                        <styled.NoDataText>No Data</styled.NoDataText>
                    }
                </styled.PlotContainer>
            }

        </styled.SinglePlotContainer>
    )
}

export default ThroughputChart