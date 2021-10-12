import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import * as styled from "./station.style";

// Import actions
import { hoverStationInfo } from "../../../../redux/actions/widget_actions";
import {
    setSelectedStation,
    setStationAttributes,
} from "../../../../redux/actions/stations_actions";
import {
    setSelectedTask,
    setTaskAttributes,
} from "../../../../redux/actions/tasks_actions";
import { pageDataChanged } from "../../../../redux/actions/sidebar_actions";

// Import Utils
import { handleWidgetHoverCoord } from "../../../../methods/utils/widget_utils";
import { convertD3ToReal } from "../../../../methods/utils/map_utils";
import { editing } from "../../../../methods/utils/locations_utils";

// Import Constants
import { StationTypes } from "../../../../constants/station_constants";

// Import Components
import LocationSvg from "../location_svg/location_svg";
import DragEntityProto from "../drag_entity_proto";
import {
    generateDefaultRoute,
} from "../../../../methods/utils/route_utils";

function Station(props) {
    const {
        station,
        rd3tClassName,
        d3,
        handleEnableDrag,
        handleDisableDrag,
        mouseDown,
        // isSelected,
    } = props;

    const [hovering, setHovering] = useState(false);
    const [rotating, setRotating] = useState(false);
    const [translating, setTranslating] = useState(false);

    const selectedStation = useSelector(
        (state) => state.stationsReducer.selectedStation
    );
    const editingProcess = useSelector(
        (state) => state.processesReducer.editingProcess
    );
    const selectedPosition = useSelector(
        (state) => state.positionsReducer.selectedPosition
    );
    const selectedTask = useSelector(
        (state) => state.tasksReducer.selectedTask
    );
    const selectedProcess = useSelector(
        (state) => state.processesReducer.selectedProcess
    );
    const hoveringInfo = useSelector(
        (state) => state.widgetReducer.hoverStationInfo
    );

    const dispatch = useDispatch();
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info));
    const dispatchSetSelectedStation = (station) =>
        dispatch(setSelectedStation(station));
    const dispatchSetStationAttributes = (id, attr) =>
        dispatch(setStationAttributes(id, attr));
    const dispatchSetSelectedTask = async (task) =>
        await dispatch(setSelectedTask(task));
    const dispatchSetTaskAttributes = (id, load) =>
        dispatch(setTaskAttributes(id, load));
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(true));

    // ======================================== //
    //                                          //
    //        Station Characteristics           //
    //                                          //
    // ======================================== //

    const isSelected = !!selectedStation && selectedStation._id === station._id

    let disabled = false;
    if (!!selectedTask && !!selectedProcess) {
    } else {
        // Disable if the selected station is not this station
        if (!!selectedStation && selectedStation._id !== station._id)
            disabled = true;
        // Disable if theres a selected position and the station's children dont contain that position
        else if (
            !!selectedPosition &&
            !station.children.includes(selectedPosition._id)
        )
            disabled = true;
    }

    const shouldGlow = false;

    let highlight = false;
    // Set selected to true if the selected task inculdes the station
    if (
        !!selectedTask &&
        (selectedTask?.load === station._id ||
            selectedTask?.unload === station._id)
    )
        highlight = true;

    // Set Color
    let color = StationTypes[station.type].color;
    if (!isSelected && disabled) color = "#c4cbff";
    // Grey
    else if (highlight) color = "#38eb87"; // Green

    // ======================================== //
    //                                          //
    //            Station Functions             //
    //                                          //
    // ======================================== //

    // Used to see if a widget Page is opened
    let params = useParams();
    useEffect(() => {
        window.addEventListener("mouseup", onSetListener);
        return () => {
            window.removeEventListener("mouseup", onSetListener);
        };
    }, []);

    const onSetListener = () => {
        setRotating(false);
        setTranslating(false);
    };

    /**
     * This runs on page load (thats mean station are mounted) and shows a widget page if it returns true.
     * If there is a station ID in the params (URL) and it matches this station,
     * and the URL (params) container a widget page then the widget page should be showing
     */
    useEffect(() => {
        if (
            params.stationID !== undefined &&
            params.stationID === props.station._id &&
            !!params.widgetPage
        ) {
            dispatchHoverStationInfo(handleWidgetHover());
        }
    }, []);

    /**
     * Passes the X, Y, scale and ID of station to redux which is then used in widgets
     */
    const handleWidgetHover = () => {
        return handleWidgetHoverCoord(station, rd3tClassName, d3);
    };

    // Handles if URL has widget page open
    const onWidgetPageOpen = () => {
        // If widget page is open, hovering is false and the open widget page stations id matches the station ID, set it to true so
        // that the widget page doesn't disappear when mouse goes out of page
        if (
            !!params.widgetPage &&
            !hovering &&
            params.stationID === station._id
        ) {
            setHovering(true);
            dispatchHoverStationInfo(handleWidgetHover());
        }

        // If hovering is true but there's no hoverInfo in the reducer (see widgets for when hoverInfo is set to null), set hovering to false
        else if (!isSelected && hovering && hoveringInfo === null) {
            setHovering(false);
        }
    };

    /**
     * This handles when a station is selected for a task
     * Can only add a station to a task if the station is a warehouse or a human
     *
     * For a warehouse, the thing to remember is that you push to a warehouse and pull from a warehouse
     */
    const onSetStationTask = () => {
        if (!!selectedTask) {
            if (
                selectedTask?.load !== null &&
                selectedTask?.unload === null &&
                selectedTask.load !== station._id
            ) {
                // If it's a warehouse and the load station has been selected, then the task type has to be a push
                // You can only push to a ware house
                let type = station.type === "warehouse" ? "push" : "push";

                dispatchSetTaskAttributes(selectedTask._id, {
                    unload: station._id,
                    type,
                });
            } else {
                // If it's a warehouse and the load position has not been selected then the task type is a pull
                // You can only pull from a ware house
                let type = station.type === "warehouse" ? "pull" : "push";

                dispatchSetTaskAttributes(selectedTask._id, {
                    load: station._id,
                    unload: null,
                    type,
                });
            }
        } else if (!!selectedProcess) {
            let newRoute = generateDefaultRoute(selectedProcess._id);
            newRoute.type = station.type === "warehouse" ? "push" : "push";
            newRoute.load = station._id;
            newRoute.unload = null;

            dispatchSetSelectedTask(newRoute);
        }
    };

    const onMouseEnter = () => {
        // Only allow hovering if there is no selected task and mouse is not down on the map
        if (
            !hoveringInfo &&
            selectedTask === null &&
            !station.temp &&
            !mouseDown &&
            !editingProcess
        ) {
            setHovering(true);

            if (
                !editing() &&
                !rotating &&
                !translating &&
                !selectedStation &&
                !selectedTask &&
                !selectedProcess
            ) {
                dispatchHoverStationInfo(handleWidgetHover());
                dispatchSetSelectedStation(station);
            }
        }
    };

    const onMouseDown = () => {
        if (!disabled) onSetStationTask();
        dispatchPageDataChanged(true);
    };

    const onTranslating = (bool) => {
        setTranslating(bool);
    };

    const onRotating = (bool) => {
        setRotating(bool);
    };

    const onMouseLeave = () => {
        setHovering(false);
    };

    return (
        <React.Fragment key={`frag-loc-${station._id}`}>
            <LocationSvg
                location={station}
                rd3tClassName={rd3tClassName}
                color={color}
                d3={d3}
                isSelected={isSelected}
                hovering={hovering}
                rotating={rotating}
                hoveringInfo={hoveringInfo}
                shouldGlow={shouldGlow}
                handleMouseEnter={onMouseEnter}
                handleMouseLeave={onMouseLeave}
                handleMouseDown={onMouseDown}
                handleTranslating={onTranslating}
                handleRotating={onRotating}
            ></LocationSvg>

            <DragEntityProto
                isSelected={isSelected}
                location={station}
                rd3tClassName={rd3tClassName}
                d3={() => d3()}
                handleRotate={(rotation) => {
                    dispatchSetStationAttributes(station._id, { rotation });
                }}
                handleTranslate={({ x, y }) => 
                    dispatchSetStationAttributes(station._id, { x, y })
                }
                handleTranslateEnd={({ x, y }) => {
                    const pos = convertD3ToReal([x, y], props.d3);
                    dispatchSetStationAttributes(station._id, {
                        x,
                        y,
                        pos_x: pos[0],
                        pos_y: pos[1],
                    });                    
                }}
                handleEnableDrag={() => {
                    handleEnableDrag();
                }}
                handleDisableDrag={() => {
                    handleDisableDrag();
                }}
            />
            {onWidgetPageOpen()}
        </React.Fragment>
    );
}

export default Station;
