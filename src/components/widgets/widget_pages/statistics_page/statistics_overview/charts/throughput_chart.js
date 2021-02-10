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
import { convert12hto24h, convert24hto12h } from '../../../../../../methods/utils/time_utils'
import { deepCopy } from '../../../../../../methods/utils/utils';

const testData = [
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
        "y": 166
    },
    {
        "x": "12 am",
        "y": 211
    },
    {
        "x": "1 pm",
        "y": 58
    },
    {
        "x": "2 pm ",
        "y": 117
    },
    {
        "x": "3 pm ",
        "y": 73
    },
    {
        "x": "4 pm ",
        "y": 231
    },
    {
        "x": "5 pm",
        "y": 75
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
        endOfShift: '18:00',
        startOfShift: '10:00',
        expectedOutput: 1000,
        breaks: {
            break1: {
                startOfBreak: '12:00',
                endOfBreak: '14:00',
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
     * 1)
     * 2)
     * 3)
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
        // Find Start of Shift
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

        let expectedOutput = []
        // Add Expected output
        if (!!compareExpectedOutput.expectedOutput) {
            for (let i = 0; i < dataCopy.length; i++) {
                console.log('QQQQ length', i, dataCopy.length)
                // Y value is a function of where the data point is in the array of the data
                const yValue = (i / (dataCopy.length - 1)) * compareExpectedOutput.expectedOutput
                expectedOutput.push({ x: dataCopy[i].x, y: yValue })
            }
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
        console.log('QQQQ Data', lineData)

        return lineData
    }

    const renderBreaks = () => {
        return (
            <styled.RowContainer>
                <styled.columnContainer>
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
                </styled.columnContainer>
                <styled.columnContainer>
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
                </styled.columnContainer>
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
                        }}

                        // validation control
                        validationSchema={throughputSchema}
                        validateOnChange={true}
                        validateOnMount={true}
                        validateOnBlur={true}

                        onSubmit={async (values, { setSubmitting, setTouched }) => {
                        }}
                    >
                        {formikProps => {

                            return (
                                <Form>
                                    <styled.RowContainer>

                                        <styled.columnContainer>
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
                                        </styled.columnContainer>
                                        <styled.columnContainer>
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
                                        </styled.columnContainer>

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