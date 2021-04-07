import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import uuid from 'uuid'

import * as styled from './edit_location.style'
import { Formik, Form } from 'formik'

// Import Components
import LocationButton from './location_button/location_button'
import ContentHeader from '../../content_header/content_header'
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import AssociatedPositions from './associated_positions/associated_positions'

// Import Basic Components
import Textbox from '../../../../basic/textbox/textbox.js'
import TextField from '../../../../basic/form/text_field/text_field.js'
import Button from '../../../../basic/button/button'


// Import Constants
import { StationTypes } from '../../../../../constants/station_constants'
import { PositionTypes } from '../../../../../constants/position_constants'
import { LocationDefaultAttributes } from '../../../../../constants/location_constants'

// Import utils
import { deepCopy } from '../../../../../methods/utils/utils'
import { locationSchema } from '../../../../../methods/utils/form_schemas'


// Import actions
import { setSelectedPosition, setPositionAttributes, addPosition, deletePosition, setEditingPosition, putPosition, postPosition, setSelectedStationChildrenCopy, removePosition } from '../../../../../redux/actions/positions_actions'
import { setSelectedStation, setStationAttributes, addStation, deleteStation, setEditingStation, putStation, postStation, removeStation } from '../../../../../redux/actions/stations_actions'
import { pageDataChanged } from '../../../../../redux/actions/sidebar_actions'

const EditLocation = (props) => {
    const dispatch = useDispatch()
    let selectedLocationRef = useRef()
    let selectedStationChildrenCopyRef = useRef()

    // Station Dispatches
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetEditingStation = (bool) => dispatch(setEditingStation(bool))
    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchAddStation = (station) => dispatch(addStation(station))
    const dispatchSetSelectedStationChildrenCopy = (children) => dispatch(setSelectedStationChildrenCopy(children))
    const dispatchPutStation = async (station) => await dispatch(putStation(station))
    const dispatchPostStation = async (station) => await dispatch(postStation(station))
    const dispatchDeleteStation = async (id) => await dispatch(deleteStation(id))
    const dispatchRemoveStation = (id) => dispatch(removeStation(id))
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))


    // Position Dispatches
    const dispatchSetSelectedPosition = async (position) => await dispatch(setSelectedPosition(position))
    const dispatchAddPosition = async (pos) => await dispatch(addPosition(pos))
    const dispatchSetPositionAttributes = (id, attr) => dispatch(setPositionAttributes(id, attr))
    const dispatchSetEditingPosition = (bool) => dispatch(setEditingPosition(bool))
    const dispatchDeletePosition = async (id) => dispatch(deletePosition(id))
    const dispatchPutPosition = async (position) => await dispatch(putPosition(position))
    const dispatchPostPosition = async (position) => await dispatch(postPosition(position))

    const stations = useSelector(state => state.stationsReducer.stations)
    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const selectedStationChildrenCopy = useSelector(state => state.positionsReducer.selectedStationChildrenCopy)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)
    const positions = useSelector(state => state.positionsReducer.positions)

    const devices = useSelector(state => state.devicesReducer.devices)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const serverSettings = useSelector(state => state.settingsReducer.settings)
    const deviceEnabled = serverSettings.deviceEnabled

    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [confirmExitModal, setConfirmExitModal] = useState(false);
    const [isLocationDragging, setIsLocationDragging] = useState(false)

    const [newName, setNewName] = useState('')
    const selectedLocation = !!selectedStation ? selectedStation : selectedPosition
    const locations = { ...stations, ...positions }
    const LocationTypes = {
        ...StationTypes,
        ...PositionTypes,
    }

    useEffect(() => {
        return () => {
            onBack()
            // dispatchSetEditingStation(false)
            // dispatchSetEditingPosition(false)
            // dispatchSetSelectedPosition(null)
            // dispatchSetSelectedStation(null)
            // dispatchSetSelectedStationChildrenCopy(null)
        }
    }, [])


    // These 2 useEffects use refs for onBack()
    // Since onback is called in the return statement of the usseffect that runs when the component mounts, it keeps in memory the current state on load (redux, useState, etc...)
    // So this ref will pass in the actual state vs the old state that the useEffect has
    useEffect(() => {
        selectedLocationRef.current = selectedLocation
    }, [selectedLocation])
    useEffect(() => {
        selectedStationChildrenCopyRef.current = selectedStationChildrenCopy
    }, [selectedStationChildrenCopy])

    /**
     * This function is called when the save button is pressed. The location is POSTED or PUT to the backend.
     * If the location is new and is a station, this function also handles posting the default dashboard and
     * tieing it to this location. Each child position for a station is also either POSTED or PUT.
     */
    const onSave = async (name) => {
        // Station
        if (!!selectedStation) {
            const copyStation = deepCopy(selectedStation)
            copyStation.name = name
            // Post
            if (!!copyStation.new) {
                await dispatchPostStation(copyStation)
            }
            // Put
            else {
                await dispatchPutStation(copyStation)
            }
        }

        // Position
        else if (!!selectedPosition) {
            const copyPosition = deepCopy(selectedPosition)
            copyPosition.name = name
            // Post
            if (!!copyPosition.new) {
                await dispatchPostPosition(copyPosition)

                // Add dashboard
            }
            // Put
            else {
                await dispatchPutPosition(copyPosition)
            }

        }

        else {
            throw ('You son of a bitch Trebech')
        }

        onBack(true)
    }

    /**
     * Deletes the selected location
     * The whole delete process can be found in each locations respected actions
     */
    const onDelete = async () => {

        // Station
        if (!!selectedLocation) {
            if (selectedLocation.schema === 'station') {
                await dispatchDeleteStation(selectedStation._id)
            }

            // Position
            else {
                await dispatchDeletePosition(selectedPosition._id)
            }
        }

        // Adding true to save even though you arent saving
        // Since deleting location, there is no need to remove location in onBack (see use of save in onBack function)
        onBack(true)
    }

    /**
     * Handles Back
     * Sets editing to false
     * Removes Station if new and not a save
     * Sets selected Location to null
     */
    const onBack = (save) => {

        // The order of these functions matter
        dispatchSetEditingStation(false)
        dispatchSetEditingPosition(false)

        // If theres a children copy check the children
        if (!!selectedStationChildrenCopyRef.current) {
            Object.values(selectedStationChildrenCopyRef.current).forEach(child => {
                // If it's a new child remove the position
                if (!!child.new) {
                    dispatchDeletePosition(child._id)
                }
            })
        }
        dispatchSetSelectedStationChildrenCopy(null)

        // If there's a selected location and its new without saving, then delete
        if (!!selectedLocationRef.current && !!selectedLocationRef.current.new && !save) {
            if (selectedLocationRef.current.schema === 'station') {
                dispatchRemoveStation(selectedLocationRef.current._id)
            }

            else if (selectedLocationRef.current.schema === 'position') {
                dispatchDeletePosition(selectedLocationRef.current._id)
            }
        }

        dispatchSetSelectedPosition(null)
        dispatchSetSelectedStation(null)
    }


    /**
     * The X and Y here are set in map view view dragNewEntity
     */
    const onAddLocation = async (type) => {
        dispatchPageDataChanged(true)
        // TODO: Stick this into Constants
        const defaultAttributes = deepCopy(LocationDefaultAttributes)

        defaultAttributes['name'] = newName
        defaultAttributes['map_id'] = currentMap._id
        defaultAttributes['_id'] = uuid.v4()
        defaultAttributes['temp'] = true

        const attributes = deepCopy(LocationTypes[type].attributes)

        const newLocation = {
            ...defaultAttributes,
            ...attributes
        }


        // Handle Station addition
        if (attributes.schema === 'station') {
            dispatchSetSelectedStationChildrenCopy({})
            await dispatchAddStation(newLocation)
            await dispatchSetSelectedStation(newLocation)
        }

        else if (attributes.schema === 'position') {
            await dispatchAddPosition(newLocation)
            await dispatchSetSelectedPosition(newLocation)
        }

        else {
            throw ('Schema Does Not exist')
        }
    }

    const onRemoveTempLocation = async () => {

        console.log("deleteLoc")

        // Station
        if(!!selectedLocation && selectedLocation.temp){
          if (selectedLocation.schema === 'station') {
              await dispatchRemoveStation(selectedStation._id)
          }

          // Position
          else {
              await dispatchRemovePosition(selectedPosition._id)
          }
          
            dispatchSetSelectedStationChildrenCopy(null)
            dispatchSetSelectedPosition(null)
            dispatchSetSelectedStation(null)
        }
    }

    const onLocationNameChange = (e) => {
        if (!!selectedStation) {
            dispatchSetStationAttributes(selectedStation._id, { name: e.target.value })
        }
        else if (!!selectedPosition) {
            dispatchSetPositionAttributes(selectedPosition._id, { name: e.target.value })
        }

        // Location Type has not been defined yet
        else {
            setNewName(e.target.value)
        }
    }

    const handleSetPositionToCartCoords = async () => {

        Object.values(devices).map(async (device, ind) => {
            if (device.device_model === 'MiR100') {
                const devicePosition = device.position

                const updatedSelectedLocation = {
                    ...selectedLocation,
                    pos_x: devicePosition.pos_x,
                    pos_y: devicePosition.pos_y,
                    x: devicePosition.x,
                    y: devicePosition.y,
                    rotation: devicePosition.orientation,
                }

                // Not sure why onSetSelectedLocation is not working, should be the same as a normal dispatch...
                await dispatchAddPosition(updatedSelectedLocation)
                await dispatchSetSelectedPosition(updatedSelectedLocation)
            }
        })
    }

    const handlePageDataChange = () => {
        dispatchPageDataChanged(true)
    }

    const handleSetChildPositionToCartCoords = (position) => {
        Object.values(devices).map(async (device, ind) => {
            if (device.device_model === 'MiR100') {
                const devicePosition = device.position
                const copyPos = deepCopy(position)
                const updatedPosition = {
                    ...copyPos,
                    pos_x: devicePosition.pos_x,
                    pos_y: devicePosition.pos_y,
                    x: devicePosition.x,
                    y: devicePosition.y,
                    rotation: devicePosition.orientation,
                }

                if (updatedPosition._id in selectedStationChildrenCopy) {
                    let copyOfCopy = deepCopy(selectedStationChildrenCopy)
                    copyOfCopy = {
                        ...copyOfCopy,
                        [updatedPosition._id]: updatedPosition,
                    }
                    dispatchSetSelectedStationChildrenCopy(copyOfCopy)
                }

                else {
                    setSelectedPosition(updatedPosition)
                }


            }
        })
    }


    const renderStationButtons = () => {
        // If there is a type selected and its not the button type, that means this type has not been selected so gray everything out
        const types = ['human', 'warehouse']

        return types.map((type, i) => {
            const isSelected = (!!selectedStation && selectedStation.type !== null && selectedStation.type === type) ? selectedStation.type : false;
            return (
                <LocationButton key={`stat_button_${i}`} schema={'station'} type={type} isSelected={isSelected} handleAddLocation={onAddLocation}/>
            )
        })

    }

    const renderPositionButtons = () => {
        const types = ['cart_position', 'shelf_position']

        return types.map((type, i) => {
            const isSelected = (!!selectedPosition && selectedPosition.type !== null && selectedPosition.type === type) ? selectedPosition.type : false;
            return (
                <LocationButton key={`pos_button_${i}`} schema={'position'} type={type} isSelected={isSelected} handleAddLocation={onAddLocation} />
            )
        })
    }

    return (
        <>
            <styled.ContentContainer style={{ padding: '0' }}>

                <ConfirmDeleteModal
                    isOpen={!!confirmDeleteModal}
                    title={"Are you sure you want to delete this Location?"}
                    button_1_text={"Yes"}
                    handleOnClick1={() => {
                        onDelete()
                        setConfirmDeleteModal(null)
                    }}
                    button_2_text={"No"}
                    handleOnClick2={() => setConfirmDeleteModal(null)}
                    handleClose={() => setConfirmDeleteModal(null)}
                />

                <ConfirmDeleteModal
                    isOpen={!!confirmExitModal}
                    title={"Are you sure you want to go back? Any progress will not be saved"}
                    button_1_text={"Yes"}
                    handleOnClick1={() => {
                        onBack()
                        setConfirmExitModal(null)
                        dispatchPageDataChanged(false)
                    }}
                    button_2_text={"No"}
                    handleOnClick2={() => setConfirmExitModal(null)}
                    handleClose={() => setConfirmExitModal(null)}
                />

                <Formik

                    initialValues={{
                        locationName: !!selectedLocation ? selectedLocation.name : '',

                    }}
                    initialTouched={{
                        locationName: false,

                    }}
                    validateOnChange={true}
                    validateOnMount={true}
                    validateOnBlur={true}
                    // Chooses what schema to use based on whether it's a sign in or sign up
                    // TODO: The schemas are not 100% working as of 9/14/2020. Need to figure out regex for passwords
                    validationSchema={locationSchema(stations, selectedLocation)}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true)

                        await onSave(deepCopy(values.locationName))

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
                                onKeyDown={(e) => {
                                    if (((e.charCode || e.keyCode) === 13) && Object.keys(errors).length === 0) {
                                        submitForm()
                                    }
                                    else if ((e.charCode || e.keyCode) === 13) {
                                        e.preventDefault();
                                    }
                                }}
                                style={{ flex: '1', margin: '0' }}
                            >
                                <styled.ContentContainer style={{ height: '100%' }}>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <ContentHeader
                                            content={'locations'}
                                            disabled={selectedLocation === null}
                                            mode={'create'}
                                            onClickBack={pageInfoChanged ? () => setConfirmExitModal(true) : () => onBack()}
                                        />
                                    </div>

                                    <TextField
                                        name={"locationName"}
                                        changed={() => handlePageDataChange()}
                                        textStyle={{ fontWeight: 'Bold', 'fontSize': '3rem' }}
                                        placeholder='Enter Location Name'
                                        type='text'
                                        label='Location Name'
                                        schema='locations'
                                        InputComponent={Textbox}
                                        style={{
                                            'fontSize': '1.2rem',
                                            'fontWeight': '600',
                                            'marginBottom': '.5rem',
                                            'marginTop': '0',
                                        }}
                                    />

                                <TextField
                                    name={"locationName"}
                                    changed={() => handlePageDataChange()}
                                    textStyle={{ fontWeight: 'Bold', 'fontSize': '3rem' }}
                                    placeholder='Enter Location Name'
                                    type='text'
                                    label='Location Name'
                                    schema='locations'
                                    InputComponent={Textbox}
                                    style={{
                                        'fontSize': '1.2rem',
                                        'fontWeight': '600',
                                        'marginBottom': '.5rem',
                                        'marginTop': '0',
                                    }}
                                />

                                {/* Location Type */}
                                <styled.DefaultTypesContainer>

                                {!selectedLocation || selectedLocation.temp ?
                                    <>
                                        <styled.LocationTypeContainer onMouseUp={onRemoveTempLocation}>
                                            <styled.Label schema={'locations'}>Stations</styled.Label>
                                            <styled.LocationButtonConatiner>
                                                {renderStationButtons()}
                                            </styled.LocationButtonConatiner>

                                            {/* <styled.LocationButtonSubtitleContainer>
                                                <styled.Subtitle schema={'locations'}>Workstation</styled.Subtitle>
                                                <styled.Subtitle schema={'locations'}>Warehouse</styled.Subtitle>
                                            </styled.LocationButtonSubtitleContainer> */}

                                                </styled.LocationTypeContainer>

                                        {deviceEnabled &&
                                            <styled.LocationTypeContainer  onMouseUp={onRemoveTempLocation}>
                                                <styled.Label schema={'locations'} style={{ marginTop: '1rem' }}>Positions</styled.Label>
                                                <styled.LocationButtonConatiner>
                                                    {renderPositionButtons()}
                                                </styled.LocationButtonConatiner>

                                                        {/* <styled.LocationButtonSubtitleContainer style={{ marginRight: '1.1rem' }}>
                                                    <styled.Subtitle schema={'locations'} style={{ marginRight: '4.5rem' }}>Cart</styled.Subtitle>
                                                    <styled.Subtitle schema={'locations'}>Shelf</styled.Subtitle>
                                                </styled.LocationButtonSubtitleContainer> */}

                                                    </styled.LocationTypeContainer>
                                                }
                                            </>

                                            :
                                            <LocationButton
                                                type={selectedLocation['type']}
                                                isSelected={(!!selectedLocation && selectedLocation.type !== null) ? selectedLocation.type : false}
                                                handleAddLocation={() => null}
                                            />

                                        }

                                    </styled.DefaultTypesContainer>

                                    {(!!selectedLocation && selectedLocation.schema === 'station') ?

                                        <AssociatedPositions handleSetChildPositionToCartCoords={handleSetChildPositionToCartCoords} />
                                        :
                                        <>
                                            {!!deviceEnabled && !!selectedLocation &&
                                                <Button
                                                    schema={'locations'}
                                                    secondary
                                                    onClick={() => {
                                                        handleSetPositionToCartCoords()
                                                        dispatchPageDataChanged(true)
                                                    }}
                                                    style={{ marginBottom: '1rem' }}
                                                >
                                                    Use Cart Location
                                    </Button>
                                            }
                                        </>

                                    }
                                    <div style={{ height: "100%" }}></div>


                                    {/* Delete Location Button */}
                                    <Button type={'submit'} schema={'locations'} onClick={() => { }} >Save Location</Button>
                                    <Button schema={'locations'} secondary disabled={selectedLocation === null || !!selectedLocation.new} onClick={() => setConfirmDeleteModal(true)} >Delete</Button>
                                </styled.ContentContainer>
                            </Form>
                        )
                    }}

                </Formik>
            </styled.ContentContainer>

        </>
    )
}

export default EditLocation
