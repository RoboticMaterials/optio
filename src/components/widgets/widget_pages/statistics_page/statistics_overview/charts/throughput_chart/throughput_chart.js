import React, { useState, useEffect, useContext, useRef, useMemo } from "react";

// Import Styles
import * as styled from "../charts.style";
import { ThemeContext } from "styled-components";

// Import Basic Components
import SortDropdown from "../../../../../../basic/sort_dropdown/sort_dropdown";

// Import components
import LineThroughputChart from "./line_throughput_chart/line_throughput_chart";

// Import Actions
import { getStationAnalytics } from "../../../../../../../redux/actions/stations_actions";

// Import Charts
import BarChart from "../../../chart_types/bar_chart";
import { useSelector } from "react-redux";
import { isObject } from "../../../../../../../methods/utils/object_utils";
import { capitalizeFirstLetter } from "../../../../../../../methods/utils/string_utils";
import { TIME_SPANS } from "../../statistics_overview";

const minHeight = 0;

const ThroughputChart = (props) => {
    const themeContext = useContext(ThemeContext);

    const {
        barData,
        lineData,

        loading,
        timeSpan,
        loadLineChartData,
        loadBarChartData,
        disableTimeSpan,
        isWidget,
        sortLevel,
        setParentSortLevel,
    } = props;

    // redux state
    const cards = useSelector((state) => state.cardsReducer.cards);
    const tasks = useSelector((state) => state.tasksReducer.tasks);
    const productGroups =
        useSelector((state) => {
            return state.lotTemplatesReducer.lotTemplates;
        }) || {};

    const [showBar, setShowBar] = useState(true);
    const [isData, setIsData] = useState(false);
    const [chartKeys, setChartKeys] = useState(false);

    const [formattedBarData, setFormattedBarData] = useState([])
    const [formattedLineData, setFormattedLineData] = useState([])

    const dropDownOptions = [
        { label: "Product Group", value: "product_group_id" },
        { label: "Lot", value: "lot_id" },
        { label: "Route", value: "route_id" },
    ];

    useEffect(() => {
        if (showBar || isWidget) {
            disableTimeSpan(false);
        } else {
            disableTimeSpan(true);
        }
    }, [showBar]);

    // UseEffect for when to show a line chart or a bar chart
    useEffect(() => {
        if (timeSpan === "line") {
            setShowBar(false);
        } else {
            setShowBar(true);
        }
    }, [timeSpan]);
    
    useEffect(() => {
        if (showBar) formatBarData(barData);
    }, [barData, sortLevel.value])

    useEffect(() => {
        formatLineData(lineData)
    }, [lineData])

    const formatLineData = (newData) => {
        setFormattedLineData(newData?.throughPut);
        setFormattedBarData([]);
    }

    const formatBarData = (newData) => {
        let tempChartKeys = []; // keys for chart = object names
        // let tempChartColors = {}
        let tempFilteredData = [];
        let deletedChartKeys = [];


        newData?.throughPut?.forEach((currItem) => {
            const { lable, ...sortedIds } = currItem || {};

            let updatedItem = { lable }; // used for changing keys from object ids to object names, keep label the same

            Object.entries(sortedIds)
                .filter((currEntry) => {
                    const [currKey, currVal] = currEntry;

                    // remove entry if value is 0 to prevent showing a bunch of 0's on the axis
                    return currVal > 0;
                })
                .forEach((currEntry, currIndex) => {
                    const [currKey, currVal] = currEntry;

                    // for null key, set default name and use value. This is for objectless routes
                    if (currKey === null || currKey === "null") {
                        // default name
                        const currObjectName = `No ${sortLevel.label}`;

                        // if name isn't in chart keys, add it, or else it won't show up on the chart
                        if (!tempChartKeys.includes(currObjectName)) {
                            tempChartKeys.push(currObjectName);
                        }
                        // add key,value pair to data item
                        updatedItem[currObjectName] = currVal;
                    }

                    // route does have object id
                    else {
                        const onChartKeys = (name) => {
                            // if name isn't in chart keys, add it, or else it won't show up on the chart
                            if (!tempChartKeys.includes(name)) {
                                tempChartKeys.push(name);
                            }

                            // add key,value pair to data item
                            updatedItem[name] = currVal;
                        };

                        const onDeletedKeys = (key) => {
                            // if this id isn't already in deletedObjs array, add it
                            if (!deletedChartKeys.includes(key)) {
                                deletedChartKeys.push(key);
                            }

                            // get index of id in deletedObjs arr
                            const deletedObjKeyIndex =
                                deletedChartKeys.indexOf(key);

                            // create name using index
                            const currObjectName = `Deleted ${
                                sortLevel.label
                            } ${deletedObjKeyIndex + 1}`;

                            onChartKeys(currObjectName);
                        };
                        switch (sortLevel.value) {
                            case "product_group_id":
                                const currProductGroup =
                                    productGroups[currKey];

                                // object with id was found
                                if (isObject(currProductGroup)) {
                                    // get object name
                                    const {
                                        name: currProductGroupName = `Unnamed`,
                                    } = currProductGroup || {};

                                    // format
                                    const currProductGroupNameCapitalized =
                                        capitalizeFirstLetter(
                                            currProductGroupName
                                        );

                                    onChartKeys(
                                        currProductGroupNameCapitalized
                                    );
                                } else if (
                                    currKey === "BASIC_LOT_TEMPLATE"
                                ) {
                                    onChartKeys("Basic");
                                }

                                // object with id was NOT found
                                else {
                                    onDeletedKeys(currKey);
                                }
                                break;

                            case "lot_id":
                                const lot = cards[currKey];
                                if (!!lot) {
                                    onChartKeys(lot.name);
                                } else {
                                    onDeletedKeys(currKey);
                                }
                                break;

                            case "route_id":
                                const route = tasks[currKey];
                                if (!!route) {
                                    onChartKeys(route.name);
                                } else {
                                    onDeletedKeys(currKey);
                                }
                                break;

                            default:
                                break;
                        }
                    }
                });

            tempFilteredData.push(updatedItem);
        });

        setChartKeys(tempChartKeys);
        setIsData(
            tempFilteredData &&
                Array.isArray(tempFilteredData) &&
                tempFilteredData.length > 0
        );
        setFormattedBarData(tempFilteredData);
        setFormattedLineData([]);
    }

    return (
        <styled.SinglePlotContainer minHeight={minHeight}>
            {isWidget && (
                // If its a widget then have some elements here that control the data
                // These elements all have callbacks to their parent component, which is statistics overveiw
                <styled.PlotHeader>
                    <styled.PlotTitle>Output</styled.PlotTitle>
                    {/* <styled.ChartButton onClick={() => setShowBar(!showBar)} >Compare Expected output</styled.ChartButton> */}

                    {(timeSpan === "day" || timeSpan === "line") && (
                        <styled.RowContainer style={{ marginBottom: ".5rem" }}>
                            <styled.ChartTypeButton
                                style={{
                                    borderRadius: ".5rem 0rem 0rem .5rem",
                                }}
                                onClick={() => {
                                    loadBarChartData();
                                }}
                                selected={showBar}
                            >
                                Bar
                            </styled.ChartTypeButton>
                            <styled.ChartTypeButton
                                style={{
                                    borderRadius: "0rem .5rem .5rem 0rem",
                                }}
                                onClick={() => {
                                    loadLineChartData();
                                }}
                                selected={!showBar}
                            >
                                Line
                            </styled.ChartTypeButton>
                        </styled.RowContainer>
                    )}
                    {timeSpan !== "line" && (
                        <SortDropdown
                            options={dropDownOptions}
                            labelField={"label"}
                            valueField={"label"}
                            dropDownSearchStyle={{ minWidth: "10rem" }}
                            onChange={(val) => {
                                setParentSortLevel(val);
                            }}
                            values={[sortLevel]}
                        />
                    )}
                </styled.PlotHeader>
            )}

            {loading ? (
                <styled.PlotContainer>
                    <styled.LoadingIcon
                        className="fas fa-circle-notch fa-spin"
                        style={{ fontSize: "3rem" }}
                    />
                </styled.PlotContainer>
            ) : (
                <styled.PlotContainer minHeight={!!showBar ? minHeight : 27}>
                    {!showBar ? (
                        <LineThroughputChart
                            themeContext={themeContext}
                            data={formattedLineData ? formattedLineData : []}
                            isData={isData}
                            date={lineData?.date_title}
                            isWidget={isWidget}
                        />
                    ) : (
                        <BarChart
                            data={formattedBarData ? formattedBarData : []}
                            enableGridY={isData ? true : false}
                            mainTheme={themeContext}
                            timeSpan={timeSpan}
                            axisBottom={{
                                legend:
                                    TIME_SPANS[timeSpan]?.displayName ||
                                    TIME_SPANS.day.displayName,
                                tickRotation: 45,
                            }}
                            axisLeft={{
                                enable: true,
                            }}
                            keys={chartKeys}
                            indexBy={"lable"}
                            colorBy={"id"}
                        />
                    )}

                    {!formattedBarData && !formattedLineData && <styled.NoDataText>No Data</styled.NoDataText>}
                </styled.PlotContainer>
            )}
        </styled.SinglePlotContainer>
    );
};

// Specifies the default values for props:
ThroughputChart.defaultProps = {
    sortLevel: { label: "Product Group", value: "product_group_id" },
    disableTimeSpan: () => {}
};

export default ThroughputChart;
