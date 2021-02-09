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
        endOfShift: 1,
        startOfShift: 2,
        expectedOutput: 3,
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

    const lineDataConver = () => {
        let convertedData = []

        let stack = 0
        for (const point of testData) {
            convertedData.push({ x: point.x, y: stack + point.y })
            stack += point.y
        }

        

        return convertedData
    }

    return (
        <styled.SinglePlotContainer
            minHeight={minHeight}
        >
            <styled.PlotHeader>
                <styled.PlotTitle>Throughput</styled.PlotTitle>
                <styled.ChartButton onClick={() => setCompareExpectedOutput(!compareExpectedOutput)} >Compare Extected output</styled.ChartButton>
                {!!compareExpectedOutput &&
                    <Formik
                        initialValues={{
                            start_time: '01:00 PM'
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
                                                            console.log('QQQQ Setting', value)
                                                            const splitVal = value.split(':')
                                                            const splitSpace = value.split(' ')
                                                            // return moment(value).format('hh:mm A')
                                                            // TODO: Can not set pm or am
                                                            return moment().set({ 'hour': splitVal[0], 'minute': splitVal[1] })
                                                            // return value
                                                        }
                                                    }
                                                }
                                                mapOutput={(value) => {
                                                    return value.format("hh:mm a")
                                                }}
                                                name={'start_time'}
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
                                                    console.log('QQQQ Setting time', time.format("hh:mm a"))
                                                    setCompareExpectedOutput({
                                                        ...compareExpectedOutput,
                                                        startOfShift: time.format("hh:mm a")
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
                                                            console.log('QQQQ Setting', value)
                                                            const splitVal = value.split(':')
                                                            const splitSpace = value.split(' ')
                                                            // return moment(value).format('hh:mm A')
                                                            return moment().set({ 'hour': splitVal[0], 'minute': splitVal[1] })
                                                            // return value
                                                        }
                                                    }
                                                }
                                                mapOutput={(value) => {
                                                    return value.format("hh:mm a")
                                                }}
                                                name={'start_time'}
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
                                                    console.log('QQQQ Setting time', time.format("hh:mm a"))
                                                    setCompareExpectedOutput({
                                                        ...compareExpectedOutput,
                                                        startOfShift: time.format("hh:mm a")
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