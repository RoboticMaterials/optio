import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import uuid from "uuid";

import * as styled from "./edit_location.style";
import { Formik, Form } from "formik";
import ReactTooltip from "react-tooltip";
import Portal from "../../../../../higher_order_components/portal";

// Import Components
import LocationButton from "./location_button/location_button";
import ContentHeader from "../../content_header/content_header";
import ConfirmDeleteModal from "../../../../basic/modals/confirm_delete_modal/confirm_delete_modal";
import AssociatedPositions from "./associated_positions/associated_positions";

// Import Basic Components
import Textbox from "../../../../basic/textbox/textbox.js";
import TextField from "../../../../basic/form/text_field/text_field.js";
import Button from "../../../../basic/button/button";

// Import Constants
import { StationTypes } from "../../../../../constants/station_constants";
import { PositionTypes } from "../../../../../constants/position_constants";
import { LocationDefaultAttributes } from "../../../../../constants/location_constants";

// Import utils
import { deepCopy } from "../../../../../methods/utils/utils";
import { locationSchema } from "../../../../../methods/utils/form_schemas";
import { flattenProcessStations } from "../../../../../methods/utils/processes_utils";

// Import actions
import {
    setSelectedPosition,
    setPositionAttributes,
    addPosition,
    deletePosition,
    setEditingPosition,
    putPosition,
    postPosition,
    setSelectedStationChildrenCopy,
    removePosition,
} from "../../../../../redux/actions/positions_actions";
import {
    setSelectedStation,
    setStationAttributes,
    addStation,
    deleteStation,
    setEditingStation,
    putStation,
    postStation,
    removeStation,
} from "../../../../../redux/actions/stations_actions";
import { pageDataChanged } from "../../../../../redux/actions/sidebar_actions";
import { putProcesses } from "../../../../../redux/actions/processes_actions";
import { useTranslation } from 'react-i18next';



const EditLocation = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    let selectedLocationRef = useRef();
    let selectedStationChildrenCopyRef = useRef();
    const formRef = useRef(null); // gets access to form state

    const { current } = formRef || {};

    const { values = {}, initialValues = {} } = current || {};

    // Station Dispatches
    const dispatchSetSelectedStation = (station) =>
        dispatch(setSelectedStation(station));
    const dispatchSetEditingStation = (bool) =>
        dispatch(setEditingStation(bool));
    const dispatchSetStationAttributes = (id, attr) =>
        dispatch(setStationAttributes(id, attr));
    const dispatchAddStation = (station) => dispatch(addStation(station));
    const dispatchSetSelectedStationChildrenCopy = (children) =>
        dispatch(setSelectedStationChildrenCopy(children));
    const dispatchPutStation = async (station) =>
        await dispatch(putStation(station));
    const dispatchPostStation = async (station) =>
        await dispatch(postStation(station));
    const dispatchDeleteStation = async (id) =>
        await dispatch(deleteStation(id));
    const dispatchRemoveStation = (id) => dispatch(removeStation(id));
    const dispatchPutProcess = (process, ID) =>
        dispatch(putProcesses(process, ID));
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool));

    // Position Dispatches
    const dispatchSetSelectedPosition = async (position) =>
        await dispatch(setSelectedPosition(position));
    const dispatchAddPosition = async (pos) => await dispatch(addPosition(pos));
    const dispatchSetPositionAttributes = (id, attr) =>
        dispatch(setPositionAttributes(id, attr));
    const dispatchSetEditingPosition = (bool) =>
        dispatch(setEditingPosition(bool));
    const dispatchDeletePosition = async (id) => dispatch(deletePosition(id));
    const dispatchPutPosition = async (position) =>
        await dispatch(putPosition(position));
    const dispatchPostPosition = async (position) =>
        await dispatch(postPosition(position));
    const dispatchRemovePosition = (id) => dispatch(removePosition(id));

    const stations = useSelector((state) => state.stationsReducer.stations);
    const selectedStation = useSelector(
        (state) => state.stationsReducer.selectedStation
    );
    const selectedPosition = useSelector(
        (state) => state.positionsReducer.selectedPosition
    );
    const selectedStationChildrenCopy = useSelector(
        (state) => state.positionsReducer.selectedStationChildrenCopy
    );
    const pageInfoChanged = useSelector(
        (state) => state.sidebarReducer.pageDataChanged
    );
    const positions = useSelector((state) => state.positionsReducer.positions);
    const processes = useSelector((state) => state.processesReducer.processes);
    const routes = useSelector((state) => state.tasksReducer.tasks);

    const currentMapId = useSelector(
        (state) => state.localReducer.localSettings.currentMapId
    );
    const serverSettings = useSelector(
        (state) => state.settingsReducer.settings
    );
    const deviceEnabled = false;

    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [confirmExitModal, setConfirmExitModal] = useState(false);
    const [isLocationDragging, setIsLocationDragging] = useState(false);
    const [didChangeType, setDidChangeType] = useState(false);

    const [newName, setNewName] = useState("");
    const selectedLocation = !!selectedStation
        ? selectedStation
        : selectedPosition;
    const locations = { ...stations, ...positions };
    const LocationTypes = {
        ...StationTypes,
        ...PositionTypes,
    };

    useEffect(() => {
        return () => {
            onBack();
            // dispatchSetEditingStation(false)
            // dispatchSetEditingPosition(false)
            // dispatchSetSelectedPosition(null)
            // dispatchSetSelectedStation(null)
            // dispatchSetSelectedStationChildrenCopy(null)
        };
    }, []);

    const cantDeleteReason = useMemo(() => {
        if (selectedLocation === null || !!selectedLocation.new) {
            return t("Editloc.cannotdeletewarning","New Stations cannot be deleted.");
        } else if (!!selectedLocation) {
            for (var process of Object.values(processes)) {
                for (var routeId of process.routes) {
                    const route = routes[routeId];
                    if (
                        route.load === selectedLocation._id ||
                        route.unload === selectedLocation._id
                    ) {
                        return t("Editloc.processwarning", {processname : process.name})
                        //return `This station is used in process ${process.name}. If you wish to delete this station either remove it from the process or delete the process.`;
                    }
                }
            }
        }

        return null;
    }, [selectedLocation, processes, routes]);

    // These 2 useEffects use refs for onBack()
    // Since onback is called in the return statement of the usseffect that runs when the component mounts, it keeps in memory the current state on load (redux, useState, etc...)
    // So this ref will pass in the actual state vs the old state that the useEffect has
    useEffect(() => {
        selectedLocationRef.current = selectedLocation;
    }, [selectedLocation]);
    useEffect(() => {
        selectedStationChildrenCopyRef.current = selectedStationChildrenCopy;
    }, [selectedStationChildrenCopy]);

    useEffect(() => {
        if (JSON.stringify(initialValues) !== JSON.stringify(values)) {
            dispatchPageDataChanged(true);
        } else {
            dispatchPageDataChanged(false);
        }
    }, [values]);

    /**
     * This function is called when the save button is pressed. The location is POSTED or PUT to the backend.
     * If the location is new and is a station, this function also handles posting the default dashboard and
     * tieing it to this location. Each child position for a station is also either POSTED or PUT.
     */
    const onSave = async (name) => {
        // Station
        if (!!selectedStation) {
            const currDate = new Date();

            const copyStation = deepCopy(selectedStation);
            copyStation.name = name;
            copyStation.edited_at = currDate.getTime();
            // Post
            if (!!copyStation.new) {
                copyStation.created_at = currDate.getTime();
                await dispatchPostStation(copyStation);
            }
            // Put
            else {
                await dispatchPutStation(copyStation);
            }

            const stationsCopy = {...deepCopy(stations), [copyStation._id]: copyStation}

            // If the station has switched type, we need to recalculate all process graphs that use that station
            if (didChangeType) {
                Object.values(processes).forEach((process) => {
                    const processRoutes = process.routes.map(
                        (routeId) => routes[routeId]
                    );
                    if (
                        processRoutes.some(
                            (route) =>
                                route.load === copyStation._id ||
                                route.unload === copyStation._id
                        )
                    ) {
                        dispatchPutProcess(
                            {
                                ...process,
                                flattened_stations: flattenProcessStations(
                                    processRoutes,
                                    stationsCopy
                                ),
                            },
                            process._id
                        );
                    }
                });
            }
        }

        // Position
        else if (!!selectedPosition) {
            const copyPosition = deepCopy(selectedPosition);
            copyPosition.name = name;
            // Post
            if (!!copyPosition.new) {
                await dispatchPostPosition(copyPosition);

                // Add dashboard
            }
            // Put
            else {
                await dispatchPutPosition(copyPosition);
            }
        } else {
            throw "You son of a bitch Trebech";
        }

        onBack(true);
    };

    /**
     * Deletes the selected location
     * The whole delete process can be found in each locations respected actions
     */
    const onDelete = async () => {
        // Station
        if (!!selectedLocation) {
            if (selectedLocation.schema === "station") {
                await dispatchDeleteStation(selectedStation._id);
            }

            // Position
            else {
                await dispatchDeletePosition(selectedPosition._id);
            }
        }

        // Adding true to save even though you arent saving
        // Since deleting location, there is no need to remove location in onBack (see use of save in onBack function)
        onBack(true);
    };

    /**
     * Handles Back
     * Sets editing to false
     * Removes Station if new and not a save
     * Sets selected Location to null
     */
    const onBack = (save) => {
        // The order of these functions matter
        dispatchSetEditingStation(false);
        dispatchSetEditingPosition(false);

        // If theres a children copy check the children
        if (!!selectedStationChildrenCopyRef.current) {
            Object.values(selectedStationChildrenCopyRef.current).forEach(
                (child) => {
                    // If it's a new child remove the position
                    if (!!child.new) {
                        dispatchDeletePosition(child._id);
                    }
                }
            );
        }
        dispatchSetSelectedStationChildrenCopy(null);

        // If there's a selected location and its new without saving, then delete
        if (
            !!selectedLocationRef.current &&
            !!selectedLocationRef.current.new &&
            !save
        ) {
            if (selectedLocationRef.current.schema === "station") {
                dispatchRemoveStation(selectedLocationRef.current._id);
            } else if (selectedLocationRef.current.schema === "position") {
                dispatchDeletePosition(selectedLocationRef.current._id);
            }
        }

        dispatchSetSelectedPosition(null);
        dispatchSetSelectedStation(null);
    };

    /**
     * The X and Y here are set in map view view dragNewEntity
     */
    const onAddLocation = async (type) => {
        dispatchPageDataChanged(true);
        // TODO: Stick this into Constants
        const defaultAttributes = deepCopy(LocationDefaultAttributes);

        defaultAttributes["name"] = newName;
        defaultAttributes["map_id"] = currentMapId;
        defaultAttributes["_id"] = uuid.v4();
        defaultAttributes["temp"] = true;

        const attributes = deepCopy(LocationTypes[type].attributes);

        const newLocation = {
            ...defaultAttributes,
            ...attributes,
        };

        // Handle Station addition
        if (attributes.schema === "station") {
            dispatchSetSelectedStationChildrenCopy({});
            await dispatchAddStation(newLocation);
            await dispatchSetSelectedStation(newLocation);
        } else if (attributes.schema === "position") {
            await dispatchAddPosition(newLocation);
            await dispatchSetSelectedPosition(newLocation);
        } else {
            throw "Schema Does Not exist";
        }
    };

    const onChangeLocationType = async (type) => {
        if (!!selectedLocation) {
            setDidChangeType(true);
            dispatchSetStationAttributes(selectedLocation._id, { type });
        }
    };

    const onRemoveTempLocation = async () => {
        // Station
        if (!!selectedLocation && selectedLocation.temp) {
            if (selectedLocation.schema === "station") {
                await dispatchRemoveStation(selectedStation._id);
            }

            // Position
            else {
                await dispatchRemovePosition(selectedPosition._id);
            }

            dispatchSetSelectedStationChildrenCopy(null);
            dispatchSetSelectedPosition(null);
            dispatchSetSelectedStation(null);
        }
    };

    const onLocationNameChange = (e) => {
        if (!!selectedStation) {
            dispatchSetStationAttributes(selectedStation._id, {
                name: e.target.value,
            });
        } else if (!!selectedPosition) {
            dispatchSetPositionAttributes(selectedPosition._id, {
                name: e.target.value,
            });
        }

        // Location Type has not been defined yet
        else {
            setNewName(e.target.value);
        }
    };

    const handlePageDataChange = () => {
        dispatchPageDataChanged(true);
    };

    const renderStationButtons = (onClick, onDrag, disableDrag) => {
        // If there is a type selected and its not the button type, that means this type has not been selected so gray everything out
        const types = ["human", "warehouse"];

        return types.map((type, i) => {
            const isSelected =
                !!selectedStation &&
                selectedStation.type !== null &&
                selectedStation.type === type
                    ? selectedStation.type
                    : false;
            return (
                <LocationButton
                    key={`stat_button_${i}`}
                    schema={"station"}
                    type={type}
                    isSelected={isSelected}
                    onClick={onClick}
                    onDragStart={onDrag}
                    disableDrag={disableDrag}
                />
            );
        });
    };

    return (
        <>
            <styled.ContentContainer style={{ padding: "0" }}>
                <ConfirmDeleteModal
                    isOpen={!!confirmDeleteModal}
                    title={
                        t("Editloc.deletewarning","WARNING! All historical data for this location will also be deleted. Are you sure you want to delete this Location?")
                    }
                    button_1_text={t("yes","Yes")}
                    handleOnClick1={() => {
                        onDelete();
                        setConfirmDeleteModal(null);
                    }}
                    button_2_text={t("no","No")}
                    handleOnClick2={() => setConfirmDeleteModal(null)}
                    handleClose={() => setConfirmDeleteModal(null)}
                />

                <ConfirmDeleteModal
                    isOpen={!!confirmExitModal}
                    title={
                        t("backwarning","Are you sure you want to go back? Any progress will not be saved")
                    }
                    button_1_text={t("yes","Yes")}
                    handleOnClick1={() => {
                        onBack();
                        setConfirmExitModal(null);
                        dispatchPageDataChanged(false);
                    }}
                    button_2_text={t("no","No")}
                    handleOnClick2={() => setConfirmExitModal(null)}
                    handleClose={() => setConfirmExitModal(null)}
                />

                <Formik
                    initialValues={{
                        locationName: !!selectedLocation
                            ? selectedLocation.name
                            : "",
                    }}
                    initialTouched={{
                        locationName: false,
                    }}
                    validateOnChange={true}
                    validateOnMount={true}
                    validateOnBlur={true}
                    innerRef={formRef}
                    // Chooses what schema to use based on whether it's a sign in or sign up
                    // TODO: The schemas are not 100% working as of 9/14/2020. Need to figure out regex for passwords
                    validationSchema={locationSchema(
                        stations,
                        selectedLocation
                    )}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        await onSave(deepCopy(values.locationName));
                        setSubmitting(false);
                    }}
                >
                    {(formikProps) => {
                        const { submitForm, errors, initialValues, values } =
                            formikProps;

                        return (
                            <Form
                                onKeyDown={(e) => {
                                    if ((e.charCode || e.keyCode) === 13) {
                                        e.preventDefault();
                                    }
                                }}
                                style={{ flex: "1", margin: "0" }}
                            >
                                <styled.ContentContainer
                                    style={{ height: "100%" }}
                                >
                                    <div style={{ marginBottom: "1rem" }}>
                                        <ContentHeader
                                            content={"locations"}
                                            disabled={selectedLocation === null}
                                            mode={"create"}
                                            onClickBack={
                                                pageInfoChanged
                                                    ? () =>
                                                          setConfirmExitModal(
                                                              true
                                                          )
                                                    : () => onBack()
                                            }
                                        />
                                    </div>

                                    <TextField
                                        name={"locationName"}
                                        autoFocus={true}
                                        changed={() => handlePageDataChange()}
                                        textStyle={{
                                            fontWeight: "Bold",
                                            fontSize: "3rem",
                                        }}
                                        placeholder={t("Editloc.entername","Enter Location Name")}
                                        type="text"
                                        label={t("Editloc.name","Location Name")}
                                        schema="locations"
                                        InputComponent={Textbox}
                                        style={{
                                            fontSize: "1.2rem",
                                            fontWeight: "600",
                                            marginBottom: ".5rem",
                                            marginTop: "0",
                                        }}
                                    />

                                    {/* Location Type */}
                                    <styled.DefaultTypesContainer>
                                        {!selectedLocation ||
                                        selectedLocation.temp ? (
                                            <styled.LocationTypeContainer
                                                onMouseUp={onRemoveTempLocation}
                                            >
                                                <styled.Label
                                                    schema={"locations"}
                                                >
                                                    {t("Editloc.type","Location Type")}
                                                </styled.Label>
                                                <styled.LocationButtonConatiner>
                                                    {renderStationButtons(
                                                        () => {},
                                                        onAddLocation
                                                    )}
                                                </styled.LocationButtonConatiner>
                                            </styled.LocationTypeContainer>
                                        ) : (
                                            <styled.LocationTypeContainer
                                                onMouseUp={onRemoveTempLocation}
                                            >
                                                <styled.Label
                                                    schema={"locations"}
                                                >
                                                    {t("Editloc.type","Location Type")}
                                                </styled.Label>
                                                <styled.LocationButtonConatiner>
                                                    {renderStationButtons(
                                                        onChangeLocationType,
                                                        () => {},
                                                        true
                                                    )}
                                                </styled.LocationButtonConatiner>
                                            </styled.LocationTypeContainer>
                                        )}
                                    </styled.DefaultTypesContainer>

                                    <div style={{ height: "100%" }}></div>

                                    {/* Delete Location Button */}
                                    <Button
                                        type={"button"}
                                        disabled={!values.locationName || Object.values(errors).length >0}
                                        schema={"locations"}
                                        onClick={() =>
                                            onSave(
                                                deepCopy(values.locationName)
                                            )
                                        }
                                    >
                                       {t("save","Save")}
                                    </Button>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                        data-tip
                                        data-for={"delete-tooltip"}
                                    >
                                        <Button
                                            schema={"locations"}
                                            secondary
                                            disabled={cantDeleteReason !== null}
                                            onClick={() =>
                                                setConfirmDeleteModal(true)
                                            }
                                        >
                                            {t("delete","Delete")}
                                        </Button>
                                    </div>

                                    {cantDeleteReason !== null && (
                                        <Portal>
                                            <ReactTooltip
                                                id={"delete-tooltip"}
                                                effect={"solid"}
                                                place={"right"}
                                            >
                                                {cantDeleteReason}
                                            </ReactTooltip>
                                        </Portal>
                                    )}
                                </styled.ContentContainer>
                            </Form>
                        );
                    }}
                </Formik>
            </styled.ContentContainer>
        </>
    );
};

export default EditLocation;
