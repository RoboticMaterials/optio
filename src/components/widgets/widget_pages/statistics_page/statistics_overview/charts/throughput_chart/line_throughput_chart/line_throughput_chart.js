import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux'

// Import Styles
import * as styled from '../../charts.style'

// Import components
import LineThroughputForm from './line_throughput_form'

// Import Charts
import { ResponsiveLine } from '@nivo/line'

// Import utils
import { convert24htoEpoch, convertDateto12h } from '../../../../../../../../methods/utils/time_utils'
import { deepCopy } from '../../../../../../../../methods/utils/utils';

const LineThroughputChart = (props) => {

    const {
        data,
        themeContext,
        isData,
        date,
        loading,
        isWidget,
    } = props

    const settings = useSelector(state => state.settingsReducer.settings)

    const [breaksEnabled, setBreaksEnabled] = useState({})
    const [showForm, setShowForm] = useState(false)
    const shiftDetails = settings.shiftDetails;

    // Used for colors in line chart below
    const colors = { Actual: themeContext.schema.statistics.solid, Expected: 'rgba(84, 170, 255, 0.4)' }

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
        console.log('QQQQ data', data)

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

        // Convert end of shift to epoch
        const endEpoch = convert24htoEpoch(shiftDetails.endOfShift, date)
        let endIndex = dataCopy.length
        // Find end of Shift in the data based on selected input
        for (let i = 0; i < dataCopy.length; i++) {
            const dataDate = dataCopy[i].x
            // Go through the data until the time is  after the end of shift input and take the vlaue before that one
            if (dataDate > endEpoch) {
                endIndex = i
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
                pointsAfterShiftEnd.push(ind)
            }
        }
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
            "color": themeContext.bg.octonary,
            "data": convertedData

        },
        {
            "id": 'Expected',
            "color": themeContext.bg.octonary,
            "data": expectedOutput

        },
        ]
        return lineData
    }, [shiftDetails, data])


    const renderResponsiveLine = useMemo(() => {

        return (
            <styled.PlotContainer style={{ flexGrow: '7' }} minHeight={27}>
                <ResponsiveLine
                    data={lineDataConverter}
                    // data={!!convertedData ? convertedData : []}
                    colors={line => colors[line.id]}

                    xScale={{ type: "time" }}
                    xFormat={(value) => convertDateto12h(value)}
                    yFormat={value => Math.round(value)}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}

                    axisTop={null}
                    axisRight={null}
                    axisBottom={{ format: (value) => convertDateto12h(value) }}

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

                    animate={false}
                    useMesh={true}

                    enablePoints={true}
                    // pointLabel={(value) => `${convertDateto12h(value.x)}:${value.y}`}
                    pointSize={5}
                    pointBorderWidth={1}
                    pointBorderColor={{ from: 'white' }}
                    pointLabelYOffset={-12}

                    margin={{ top: 22, left: 70, right: 70, bottom: 32 }}
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

                        textColor: themeContext.bg.octonary,
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
                                stroke: 'rgba(0, 0, 0, 0.1)',
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
        )
    }, [lineDataConverter])

    return (
        <styled.RowContainer>
            {breaksEnabled !== null &&
                <>
                    {renderResponsiveLine}

                    {isWidget &&
                        <>
                            { showForm &&
                                <div style={{ flexGrow: '3' }}>
                                    <LineThroughputForm themeContext={themeContext} />
                                </div>
                            }
                            <styled.FormIcon onClick={() => setShowForm(!showForm)} className="fas fa-cog" />
                        </>
                    }

                </>
            }

        </styled.RowContainer >
    )


}


export default LineThroughputChart
