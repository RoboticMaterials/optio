import React, { Component, useState } from 'react'
import { ReactDOM, Route } from 'react-dom'
import { connect } from 'react-redux';
import moduleName from 'react'
import { withRouter } from "react-router-dom";

import * as styled from './map_view.style'

import uuid from 'uuid';
import * as d3 from 'd3'

// Import Utils
import { convertD3ToReal, convertRealToD3, getRelativeOffset } from '../../methods/utils/map_utils'
import { isEquivalent, } from '../../methods/utils/utils.js'

// Import Actions
import { getMap } from '../../redux/actions/map_actions'
import { updateStations, setStationAttributes, setSelectedStation } from '../../redux/actions/stations_actions'
import { updatePositions, postPosition, setPositionAttributes, setSelectedPosition } from '../../redux/actions/positions_actions'
import * as deviceActions from '../../redux/actions/devices_actions'

import { widgetLoaded, hoverStationInfo } from '../../redux/actions/widget_actions'

// Import Components
import TaskPaths from '../../components/map/task_paths/task_paths.js'
import ProcessPaths from '../../components/map/process_paths/process_paths'
import MiR100 from '../../components/map/amrs/mir100/mir100.js'
import Zones from '../../components/map/zones/zones'
import RightClickMenu from '../../components/map/right_click_menu/right_click_menu'
import TaskStatistics from '../../components/map/task_statistics/task_statistics'
import Widgets from '../../components/widgets/widgets'

import Station from '../../components/map/locations/station/station'
import Position from '../../components/map/locations/position/position'

// logging
import log from "../../logger"
import { setCurrentMap } from "../../redux/actions/map_actions";

const logger = log.getLogger("MapView")

export class MapView extends Component {
    constructor(props) {
        super(props)

        this.mobileMode = this.props.mobileMode
        this.onClick = this.props.onClick

        this.state = {
            showRightClickMenu: {},
        }

        this.rd3tSvgClassName = `__SVG`     // Gives uniqe className to map components to reference for d3 events
        this.rd3tMapClassName = `__MAP`
        this.rd3tLocClassName = '__LOC'
        this.rd3tStationClassName = `__STATION`
        this.rd3tPosClassName = '__POS'

        this.lastEvent = null   // Save the latest event

        this.initialRender = true   // Keeps track of where the D3 SVG has been zoomed or dragged
        this.draggable = true   // Dragging is disabled when another event occurs (ex: moving a location)
        this.widgetDraggable = true   // Dragging is disabled when widget page is open (ex: moving a location)

        this.d3 = {
            translate: [0, 0],
            scale: 1,
            naturalScale: 1,
            boundingClientHeight: 0
        }

        this.naturalImageDimensions = {
            width: 100,
            heigh: 100
        }

        this.mouseDown = false
    }

    componentDidMount() {

        // Refresh the map on initial mount. This will only likely give you back the list of
        // maps, but componentDidUpdate will catch that and set the current map to the first map
        // in the returned list (which will be the active map)
        // this.refreshMap()
        this.checkForMapLoad()
        window.addEventListener('mousedown', () => this.mouseDown = true, { passive: false })
        window.addEventListener('mouseup', () => { this.mouseDown = false; this.validateNewEntity() }, { passive: false })

        // Event listener that will recalculate the map geometry when the screen size changes
        window.addEventListener('resize', () => {
            this.calculateD3Geometry()
            this.bindZoomListener()
        }, { passive: false })
    }

    checkForMapLoad = () => {
        var defaultMap = this.props.maps.find((map) => map._id === this.props.currentMapId)

        if (this.props.currentMapId && this.props.currentMap && this.props.currentMap._id && defaultMap) {
            if (this.props.currentMapId !== this.props.currentMap._id) {
                this.props.dispatchSetCurrentMap(defaultMap)
            }

        } else if (this.props.currentMapId && defaultMap) {
            this.props.dispatchSetCurrentMap(defaultMap)

        } else if (this.props.currentMap && this.props.currentMap._id) {
            // do nothing
        } else {

            // default to first map found
            this.props.dispatchSetCurrentMap(this.props.maps[0])
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // If new maps are available, refresh current map
        // NOTE: will be useless once we have a method to select map
        // if (prevProps.maps.length != this.props.maps.length) {
        //     this.refreshMap()
        // }
        this.checkForMapLoad()





        // If the map has been changed, recalculate the geometry and bind the zoom
        // listener to default to the correct translation
        if (!isEquivalent(prevProps.currentMap, this.props.currentMap)) {
            this.calculateD3Geometry(this.mapContainer)
            this.bindZoomListener()
        }

        // If the map has been changed, recalculate the geometry and bind the zoom
        // listener to default to the correct translation
        // if (!isEquivalent(prevProps.locations, this.props.locations)) {
        //     this.calculateD3Geometry()
        //     this.bindZoomListener()
        // }


        // if a widget page is open, disable window event listeners so events work normally within the widget page
        const { widgetPage } = this.props.match.params    // contains url params from route.
        if (widgetPage) {
            document.removeEventListener("dragend", this.validateNewLocation)
        } else {
            // reattach event listeners if necessary
            document.addEventListener('dragend', this.validateNewLocation, { capture: false, passive: true });
        }

        // if (this.props.currentMap != null && !isEquivalent(prevProps.locations, this.props.locations)) {
        //     let locations = this.props.locations
        //     locations.forEach((location, ind) => {
        //         locations[ind].x = this.d3.translate[0] + this.d3.scale*(location.pos_x/this.props.currentMap.resolution)
        //         locations[ind].y = this.d3.translate[1] + this.d3.scale*(this.d3.boundingClientHeight - location.pos_y/this.props.currentMap.resolution)
        //     })
        //     this.props.onUpdateLocations(locations)
        // }
    }


    /* ========== Map Functions ========== */

    /***
     * Refreshes the map and all map entities
     */
    refreshMap = () => {
        if (!!this.props.maps[0]) {
            this.props.dispatchGetMap(this.props.maps[0].guid)
        }
    }

    openLocation = () => {
        return <Route path={["/locations"]} />
    }



    // ---------- Functionality for adding new location ---------- //

    /**
     * Handles Draging new locations onto the map
     * 
     * @param {*} e 
     */
    dragNewEntity = e => {

        if(!this.mouseDown) return

        // Handle Stations
        if (!!this.props.selectedStation && this.props.selectedStation.temp === true) {
            this.props.dispatchSetStationAttributes(this.props.selectedStation._id, {
                x: e.clientX,
                y: e.clientY
            })
        }

        // Handle Positions
        else if (!!this.props.selectedPosition && this.props.selectedPosition.temp === true && this.props.selectedPosition.name !== "TempRightClickMovePosition") {
            this.props.dispatchSetPositionAttributes(this.props.selectedStation._id, {
                x: e.clientX,
                y: e.clientY
            })
        }


        // Else it's a stations child position
        else if (!!this.props.selectedStation && this.props.selectedStation.children.length > 0) {
            const draggingChild = Object.values(this.props.positions).find(position => position.temp == true)
            if (!!draggingChild && this.props.selectedPosition.name !== "TempRightClickMovePosition") {
                this.props.dispatchSetPositionAttributes(draggingChild._id, {
                    x: e.clientX,
                    y: e.clientY
                })
            }

        }

    }

    /**
     * This runs on mouse up
     * Handles adding pos_x and pos_y to new locations
     * pos_x and pos_y are the real x and y relations of the location to the map
     */
    validateNewEntity = () => {

        // Handle Stations
        if (!!this.props.selectedStation && this.props.selectedStation.temp === true) {
            const pos = convertD3ToReal([this.props.selectedStation.x, this.props.selectedStation.y], this.d3)
            this.props.dispatchSetStationAttributes(this.props.selectedStation._id, {
                pos_x: pos[0],
                pos_y: pos[1],
                temp: false
            })
        }

        // Handle Posiitions
        else if (!!this.props.selectedPosition && this.props.selectedPosition.temp === true && this.props.selectedPosition.name !== "TempRightClickMovePosition") {
            const pos = convertD3ToReal([this.props.selectedPosition.x, this.props.selectedPosition.y], this.d3)
            this.props.dispatchSetPositionAttributes(this.props.selectedPosition._id, {
                pos_x: pos[0],
                pos_y: pos[1],
                temp: false
            })
        }

        // Handle child positions of stations
        else {
            const newChildEntity = Object.values(this.props.positions).find(position => position.temp == true)
            if (!!newChildEntity) {
                const pos = convertD3ToReal([newChildEntity.x, newChildEntity.y], this.d3)
                this.props.dispatchSetPositionAttributes(newChildEntity._id, {
                    pos_x: pos[0],
                    pos_y: pos[1],
                    temp: false
                })
            }
        }
    }

    /* ========== D3 Functions ========== */

    /***
     * Binds the d3 listener that listens for zoom events. Conveniently it also listens to
     * drag events, so this will take care of both
     */
    bindZoomListener = () => {
        const { scaleExtent } = this.props
        const { resolution } = this.props.currentMap
        const { translate, scale } = this.d3

        const svg = d3.select(`.${this.rd3tSvgClassName}`)
        const map = d3.selectAll(`.${this.rd3tMapClassName}`)

        let x, y
        svg.call(
            d3.behavior
                .zoom()
                .scaleExtent([-100, 100])
                // .scaleExtent([scaleExtent.min, scaleExtent.max])
                .on('zoom', () => {

                    // Disables the ability to hover over location on mouse drag when a loction is selected that is not new or a right click
                    if ((!!this.props.selectedStation || (!!this.props.selectedPosition && this.props.selectedPosition.name !== 'TempRightClickMovePosition')) && (!this.props.editingStation || !this.props.editingPosition)) {
                        this.props.dispatchHoverStationInfo(null)
                        this.props.dispatchSetSelectedPosition(null)
                        this.props.dispatchSetSelectedPosition(null)
                    }

                    //// Saving the last event is usefull for saving d3 state when draggable is toggled (when moving locations)
                    this.lastEvent = d3.event
                    let { stations, positions, devices } = this.props


                    //// Apply the event translation to image
                    map.attr('transform', `translate(${d3.event.translate}) scale(${d3.event.scale})`)
                    Object.assign(this.d3, {
                        translate: d3.event.translate,
                        scale: d3.event.scale
                    })

                    //// Apply the event translation to each station
                    Object.values(stations).forEach(station => {

                        [x, y] = convertRealToD3([station.pos_x, station.pos_y], this.d3)
                        Object.assign(station, { x, y })
                        stations[station._id] = station

                    })

                    // Apply the event translation to selectedStation if there is one
                    let updatedSelectedStation = null
                    if (!!this.props.selectedStation) {
                        [x, y] = convertRealToD3([this.props.selectedStation.pos_x, this.props.selectedStation.pos_y], this.d3)
                        updatedSelectedStation = this.props.selectedStation
                        Object.assign(updatedSelectedStation, { x, y })
                    }

                    this.props.dispatchUpdateStations(stations, updatedSelectedStation, this.d3) // Bulk Update

                    //// Apply the event translation to each position
                    Object.values(positions).forEach(position => {

                        [x, y] = convertRealToD3([position.pos_x, position.pos_y], this.d3)
                        Object.assign(position, { x, y })
                        positions[position._id] = position

                    })

                    // Apply the event translation to selectedStation if there is one
                    let updatedSelectedPosition = null
                    if (!!this.props.selectedPosition) {
                        [x, y] = convertRealToD3([this.props.selectedPosition.pos_x, this.props.selectedPosition.pos_y], this.d3)
                        updatedSelectedPosition = this.props.selectedPosition
                        Object.assign(updatedSelectedPosition, { x, y })
                    }

                    this.props.dispatchUpdatePositions(positions, updatedSelectedPosition, this.d3) // Bulk Update

                    //// Apply the event translation to each position
                    Object.values(positions).forEach(position => {
                        [x, y] = convertRealToD3([position.pos_x, position.pos_y], this.d3)
                        Object.assign(position, { x, y })
                        positions[position._id] = position
                    })
                    this.props.dispatchUpdatePositions(positions) // Bulk Update

                    //// Apply the event translation to each mobile device
                    Object.values(devices).filter(device => device.device_model == 'MiR100').map(device => {
                        [x, y] = convertRealToD3([device.position.pos_x, device.position.pos_y], this.d3)
                        Object.assign(device.position, { x, y })
                        devices[device._id] = device
                    })
                    this.props.dispatchUpdateDevices(devices, this.d3) // Bulk Update

                    // Once zoomed or dragged, stop initializing locations with transforms, instead now let the listener handle that. Otherwise zoom gets jumpy
                    if (this.initialRender) { this.initialRender = false }
                })
                .on('zoomend', () => {

                })
                // Offset so that first pan and zoom does not jump back to [0,0] coords
                .scale(scale)
                .translate(translate),
        );
    }

    /**
     * Overwrite the listener we described above /\ to be null
     * (basically dont listen to drag/zoom events)
     */
    unbindZoomListener = () => {
        const { rd3tSvgClassName } = this

        const svg = d3.select(`.${rd3tSvgClassName}`);
        svg.call(d3.behavior.zoom().on('zoom', null))
    }

    onDisableDrag = () => {
        if (this.draggable) {
            this.draggable = false
            this.unbindZoomListener()
        }
    }

    onEnableDrag = () => {
        if (!this.draggable) {
            this.draggable = true
            this.bindZoomListener()
        }
    }

    onWidgetDisableDrag = () => {
        if (this.widgetDraggable) {
            this.widgetDraggable = false
            this.unbindZoomListener()
        }
    }

    onWidgetEnableDrag = () => {
        if (!this.widgetDraggable) {
            this.widgetDraggable = true
            this.bindZoomListener()
        }
    }

    /**
     * Should move center map when the sidebar is resized
     * TODO: make this work...
     */
    onResize = () => {

    }

    /**
     * x: 0,
     * y: 0property, instead of going
     * through D3's scaling mechanism, which would have picked up both properties.
     *
     * @return {object} {translate: {x: number, y: number}, zoom: number}
     */
    calculateD3Geometry = () => {
        let { locations } = this.props
        let { resolution } = this.props.currentMap

        let scale
        if (this.props.zoom > this.props.scaleExtent.max) {
            scale = this.props.scaleExtent.max;
        } else if (this.props.zoom < this.props.scaleExtent.min) {
            scale = this.props.scaleExtent.min;
        } else {
            scale = this.props.zoom;
        }

        let translate
        if (!!this.mapContainer && !!this.mapImage) {

            const cHeight = this.mapContainer.getBoundingClientRect().height
            const cWidth = this.mapContainer.getBoundingClientRect().width

            const iHeight = this.mapImage.getBoundingClientRect().height
            const iWidth = this.mapImage.getBoundingClientRect().width

            const iNatHeight = this.naturalImageDimensions.height
            const iNatWidth = this.naturalImageDimensions.width



            // Apply translations to map.
            // The map is translated by half the container dims, and then back by
            // half the image dims. This leaves it in the middle of the screen
            translate = {
                x: this.props.translate.x + cWidth / 2 - iWidth / 2,
                y: this.props.translate.y + cHeight / 2 - iHeight / 2,
            }

            // Save necessary variables
            this.d3 = {
                translate: [translate.x, translate.y],
                scale: scale,
                mapResolution: resolution,
                // imgResolution: iNatWidth / iWidth,
                imgResolution: 1,
                actualDims: {
                    height: iHeight,
                    width: iWidth
                },
                naturalDims: {
                    height: iNatHeight,
                    width: iNatWidth
                },
            }


            let x, y
            let { stations, positions, devices } = this.props
            //// Apply the event translation to each station
            Object.values(stations).forEach(station => {
                [x, y] = convertRealToD3([station.pos_x, station.pos_y], this.d3)
                Object.assign(station, { x, y })
                stations[station._id] = station
            })
            this.props.dispatchUpdateStations(stations) // Bulk Update

            //// Apply the event translation to each position
            Object.values(positions).forEach(position => {
                [x, y] = convertRealToD3([position.pos_x, position.pos_y], this.d3)
                Object.assign(position, { x, y })
                positions[position._id] = position
            })
            this.props.dispatchUpdatePositions(positions) // Bulk Update

            //// Apply the event translation to each mobile device
            Object.values(devices).filter(device => device.device_model == 'MiR100').map(device => {
                [x, y] = convertRealToD3([device.position.pos_x, device.position.pos_y], this.d3)
                Object.assign(device.position, { x, y })
                devices[device._id] = device
            })
            this.props.dispatchUpdateDevices(devices, this.d3) // Bulk Update

        } else {
            translate = this.props.translate
        }

        // Set the initial map translation
        const map = d3.selectAll(`.${this.rd3tMapClassName}`)
        map.attr('transform', `translate(${translate.x},${translate.y}) scale(${scale})`)

    }

    // This handles the event when an onContextMenu is triggered in the svg containing the map
    // It prevents the defaul menu for appearing and sets the state for the custom menu to appear
    // Passes along x and y for the cusotm menu
    // Go to right_click_menu to follow how the click logic works
    handleRightClickMenu = (e) => {
        e.preventDefault()
        this.setState({ showRightClickMenu: { x: e.clientX, y: e.clientY } });
    }


    render() {
        let { stations, positions, devices, selectedStation, selectedPosition } = this.props
        if (this.props.currentMap == null) { return (<></>) }
        const { translate, scale } = this.d3;

        return (
            <div style={{ width: '100%', height: '100%' }} onMouseMove={this.dragNewEntity} onMouseUp={this.validateNewLocation} >
                <styled.MapContainer ref={mc => (this.mapContainer = mc)} style={{ pointerEvents: this.widgetDraggable ? 'default' : 'none' }}>

                    {/* Commented out for now */}
                    {/* <Zones/> */}

                    {/* Right menu */}
                    {Object.keys(this.state.showRightClickMenu).length > 0 &&
                        <RightClickMenu coords={this.state.showRightClickMenu} buttonClicked={() => { this.setState({ showRightClickMenu: {} }) }} d3={this.d3} />
                    }

                    {/* SVG element is the container for the whole view. This allows the view to be moved as one */}
                    <svg
                        className={this.rd3tSvgClassName}
                        width="100%"
                        height="100%"

                        // onClick only registers on left click so this works as a way to hide the menu
                        onClick={() => { this.setState({ showRightClickMenu: {} }) }}
                        onContextMenu={(e) => { this.handleRightClickMenu(e) }}

                        // These 2 mouse events are used to remove the issue when moving the mouse too fast over a location causing a widget to load, but not fast enough for the onmouselave to execute
                        onMouseEnter={() => {
                            if (!!this.props.widgetLoaded) {
                                // If there is a selected location and its not the right click menu location then hide
                                // should always show widget if its the right click menu
                                if ((!!this.props.selectedStation || (!!this.props.selectedPosition && this.props.selectedPosition.name !== 'TempRightClickMovePosition')) && (!this.props.editingStation || !this.props.editingPosition)) {
                                    this.props.dispatchHoverStationInfo(null)
                                    this.props.dispatchSetSelectedStation(null)
                                    this.props.dispatchSetSelectedPosition(null)
                                }
                            }
                        }}
                        onMouseOver={() => {
                            if (!!this.props.widgetLoaded) {
                                // If there is a selected location and its not the right click menu location then hide
                                // should always show widget if its the right click menu
                                if ((!!this.props.selectedStation || (!!this.props.selectedPosition && this.props.selectedPosition.name !== 'TempRightClickMovePosition'))) {
                                    this.props.dispatchHoverStationInfo(null)

                                    if (!this.props.editingStation || !this.props.editingPosition) {
                                        this.props.dispatchSetSelectedStation(null)
                                        this.props.dispatchSetSelectedPosition(null)
                                    }
                                }
                            }
                        }}

                    > {/* Clears any unfinished drag events (ex: moving location) */}
                        <styled.MapGroup
                            className={this.rd3tMapClassName}

                        >
                            {/* Foreign object allows an image to be put in the SVG container */}
                            <foreignObject width='200%' height='200%' >
                                {!!this.props.currentMap &&
                                    <styled.MapImage ref={mi => (this.mapImage = mi)}
                                        tall={!!this.mapContainer && // Fixes the map sizing - cutoff issue
                                            this.mapContainer.getBoundingClientRect().height / this.naturalImageDimensions.height
                                            >
                                            this.mapContainer.getBoundingClientRect().width / this.naturalImageDimensions.width}

                                        src={'data:image/png;base64, ' + this.props.currentMap.map}
                                        onLoad={() => {

                                            this.naturalImageDimensions = {
                                                height: this.mapImage.naturalHeight,
                                                width: this.mapImage.naturalWidth
                                            }
                                            // Geometry changes once the image finishes loading, so the geometry needs to be reclaculated
                                            // and the zoom listener needs to be re-bound to the new translations
                                            this.calculateD3Geometry()
                                            this.setState({
                                                resolution: this.props.currentMap.resolution
                                            }, () => this.bindZoomListener())
                                        }}
                                    >
                                    </styled.MapImage>
                                }
                            </foreignObject>
                        </styled.MapGroup>

                        {!!this.props.selectedTask &&
                            <TaskPaths d3={this.d3} />
                        }

                        {!!this.props.selectedProcess &&
                            <ProcessPaths d3={this.d3} />
                        }

                        <defs>
                            {/* a transparent glow that takes on the colour of the object it's applied to */}
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {!!this.state.resolution && !!this.mapImage &&
                            <>
                                <>{
                                    //// Render Locations
                                    Object.values(stations)
                                        .filter(station => (station.map_id === this.props.currentMap._id))
                                        .map((station, ind) =>

                                            <Station
                                                key={`loc-${ind}`}
                                                // If there is a selected station, then render the selected station vs station in redux
                                                // Selected station could contain local edits that are not on the backend (naked redux) yet 
                                                station={(!!selectedStation && station._id === selectedStation._id) ? selectedStation : station}
                                                // station={station}
                                                rd3tClassName={`${this.rd3tStationClassName}_${ind}`}
                                                d3={this.d3}
                                                handleEnableDrag={this.onEnableDrag}
                                                handleDisableDrag={this.onDisableDrag}
                                            />
                                        )
                                }</>

                                <>{
                                    //// Render children positions if appropriate
                                    Object.values(positions)
                                        .filter(position => (position.map_id === this.props.currentMap._id))
                                        .map((position, ind) =>
                                            <Position
                                                key={`pos-${ind}`}
                                                position={position}
                                                rd3tClassName={`${this.rd3tPosClassName}_${ind}`}
                                                d3={this.d3}
                                                onEnableDrag={this.onEnableDrag}
                                                onDisableDrag={this.onDisableDrag}
                                            />

                                        )
                                }</>

                                <>{
                                    //// Render mobile devices
                                    devices === undefined ?
                                        <></>
                                        :
                                        Object.values(devices).filter(device => device.device_model == 'MiR100').map((device, ind) =>
                                            <MiR100 key={device._id}
                                                device={device}
                                                d3={this.d3}
                                            />
                                        )
                                }</>
                            </>
                        }
                    </svg>

                    {(!!this.props.selectedProcess || !!this.props.selectedTask) &&
                        <TaskStatistics d3={this.d3} />
                    }

                    {/* Widgets are here when not in mobile mode. If mobile mode, then they are in App.js.
                    The reasoning is that the map unmounts when in a widget while in mobile mode (for performance reasons). */}
                    {this.props.hoveringInfo !== null && !this.mobileMode &&
                        <Widgets />
                    }


                </styled.MapContainer>

            </div >
        )
    }
}

MapView.defaultProps = {
    scaleExtent: { min: 0, max: 6 },
    zoomable: true,
    zoom: 1,
    translate: { x: 0, y: 0 },

}

const mapStateToProps = function (state) {
    return {
        maps: state.mapReducer.maps,
        currentMapId: state.localReducer.localSettings.currentMapId,
        currentMap: state.mapReducer.currentMap,

        devices: state.devicesReducer.devices,
        positions: state.positionsReducer.positions,
        stations: state.stationsReducer.stations,
        tasks: state.tasksReducer.tasks,

        selectedStation: state.stationsReducer.selectedStation,
        selectedPosition: state.positionsReducer.selectedPosition,
        editingStation: state.stationsReducer.editingStation,
        editingPosition: state.positionsReducer.editingPosition,

        selectedTask: state.tasksReducer.selectedTask,
        selectedProcess: state.processesReducer.selectedProcess,
        fixingProcess: state.processesReducer.fixingProcess,

        hoveringInfo: state.widgetReducer.hoverStationInfo,
        widgetLoaded: state.widgetReducer.widgetLoaded,

    };
}

const mapDispatchToProps = dispatch => {
    return {
        dispatchGetMap: (map_id) => dispatch(getMap(map_id)),
        dispatchSetCurrentMap: (map) => dispatch(setCurrentMap(map)),

        dispatchUpdateStations: (stations, selectedStation, d3) => dispatch(updateStations(stations, selectedStation, d3)),
        dispatchUpdatePositions: (positions) => dispatch(updatePositions(positions)),
        dispatchUpdateDevices: (devices, d3) => dispatch(deviceActions.updateDevices(devices, d3)),

        dispatchPostPosition: (position) => dispatch(postPosition(position)),
        dispatchSetStationAttributes: (id, attr) => dispatch(setStationAttributes(id, attr)),
        dispatchSetPositionAttributes: (id, attr) => dispatch(setPositionAttributes(id, attr)),
        dispatchSetSelectedStation: (station) => dispatch(setSelectedStation(station)),
        dispatchSetSelectedPosition: (position) => dispatch(setSelectedPosition(position)),

        dispatchHoverStationInfo: (info) => dispatch(hoverStationInfo(info)),
        dispatchWidgetLoaded: (bool) => dispatch(widgetLoaded(bool)),


    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MapView))
