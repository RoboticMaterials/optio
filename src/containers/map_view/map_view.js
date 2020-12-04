import React, { Component, useState } from 'react'
import {ReactDOM, Route} from 'react-dom'
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
import * as mapActions from '../../redux/actions/map_actions'
import * as stationActions from '../../redux/actions/stations_actions'
import * as positionActions from '../../redux/actions/positions_actions'
import * as locationActions from '../../redux/actions/locations_actions'
import * as deviceActions from '../../redux/actions/devices_actions'

import { hoverStationInfo } from '../../redux/actions/stations_actions'
import { deselectLocation, widgetLoaded } from '../../redux/actions/locations_actions'


// Import Components
import TaskPaths from '../../components/map/task_paths/task_paths.js'
import ProcessPaths from '../../components/map/process_paths/process_paths'
import Location from '../../components/map/locations/location.js'
import MiR100 from '../../components/map/amrs/mir100/mir100.js'
import Zones from '../../components/map/zones/zones'
import RightClickMenu from '../../components/map/right_click_menu/right_click_menu'
import TaskStatistics from '../../components/map/task_statistics/task_statistics'
import Widgets from '../../components/widgets/widgets'
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
        const defaultMap = this.props.maps.find((map) => map._id === this.props.currentMapId)
        if (this.props.currentMapId && this.props.currentMap._id) {
            if (this.props.currentMapId !== this.props.currentMap._id) {
                this.props.onSetCurrentMap(defaultMap)
            }

        } else if (this.props.currentMapId) {
            this.props.onSetCurrentMap(defaultMap)

        } else if (this.props.currentMap && this.props.currentMap._id) {
            // do nothing
        } else {
            this.props.onSetCurrentMap(this.props.maps[0])
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
            this.props.onGetMap(this.props.maps[0].guid)
        }
    }

    openLocation = () => {
      return  <Route path={["/locations"]}/>
    }



    // ---------- Functionality for adding new location ---------- //

    dragNewEntity = e => {
        if (this.mouseDown == false || !this.props.selectedLocation) { return }

        // TempRightClick... should not be moved here, this creates a weird rotation bug
        if (this.props.selectedLocation.temp == true && this.props.selectedLocation.name !== "TempRightClickMoveLocation") { //  Dragging current location onto the map
            this.props.onSetLocationAttributes(this.props.selectedLocation._id, {
                x: e.clientX,
                y: e.clientY
            })
        } else {
            const draggingChild = Object.values(this.props.positions).find(position => position.temp == true)
            if (!!draggingChild && this.props.selectedLocation.name !== "TempRightClickMoveLocation") {
                this.props.onSetPositionAttributes(draggingChild._id, {
                    x: e.clientX,
                    y: e.clientY
                })
            }
        }
    }

    validateNewEntity = () => {
        if (!this.props.selectedLocation) { return }

        if (this.props.selectedLocation.temp == true && this.props.selectedLocation.name !== "TempRightClickMoveLocation") {
            const pos = convertD3ToReal([this.props.selectedLocation.x, this.props.selectedLocation.y], this.d3)
            this.props.onSetLocationAttributes(this.props.selectedLocation._id, {
                pos_x: pos[0],
                pos_y: pos[1],
                temp: false
            })
        } else {
            const newChildEntity = Object.values(this.props.positions).find(position => position.temp == true)
            if (!!newChildEntity) {
                const pos = convertD3ToReal([newChildEntity.x, newChildEntity.y], this.d3)
                this.props.onSetPositionAttributes(newChildEntity._id, {
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
                    if (!!this.props.selectedLocation && this.props.selectedLocation.name !== 'TempRightClickMoveLocation' && this.props.selectedLocation.type !== null && !this.props.editing) {
                        this.props.onHoverStationInfo(null)
                        this.props.onDeselectLocation()
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
                    this.props.onUpdateStations(stations) // Bulk Update

                    //// Apply the event translation to each position
                    Object.values(positions).forEach(position => {
                        [x, y] = convertRealToD3([position.pos_x, position.pos_y], this.d3)
                        Object.assign(position, { x, y })
                        positions[position._id] = position
                    })
                    this.props.onUpdatePositions(positions) // Bulk Update

                    //// Apply the event translation to each mobile device
                    Object.values(devices).filter(device => device.device_model == 'MiR100').map(device => {
                        [x, y] = convertRealToD3([device.position.pos_x, device.position.pos_y], this.d3)
                        Object.assign(device.position, { x, y })
                        devices[device._id] = device
                    })
                    this.props.onUpdateDevices(devices, this.d3) // Bulk Update

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
            this.props.onUpdateStations(stations) // Bulk Update

            //// Apply the event translation to each position
            Object.values(positions).forEach(position => {
                [x, y] = convertRealToD3([position.pos_x, position.pos_y], this.d3)
                Object.assign(position, { x, y })
                positions[position._id] = position
            })
            this.props.onUpdatePositions(positions) // Bulk Update

            //// Apply the event translation to each mobile device
            Object.values(devices).filter(device => device.device_model == 'MiR100').map(device => {
                [x, y] = convertRealToD3([device.position.pos_x, device.position.pos_y], this.d3)
                Object.assign(device.position, { x, y })
                devices[device._id] = device
            })
            this.props.onUpdateDevices(devices, this.d3) // Bulk Update

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
        let { locations, positions, devices } = this.props
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
                                if (!!this.props.selectedLocation && this.props.selectedLocation.name !== 'TempRightClickMoveLocation' && !this.props.editing) {
                                    this.props.onHoverStationInfo(null)
                                    this.props.onDeselectLocation()
                                }
                            }
                        }}
                        onMouseOver={() => {
                            if (!!this.props.widgetLoaded) {
                                // If there is a selected location and its not the right click menu location then hide
                                // should always show widget if its the right click menu
                                if (!!this.props.selectedLocation && this.props.selectedLocation.name !== 'TempRightClickMoveLocation') {
                                    this.props.onHoverStationInfo(null)

                                if(!this.props.editing){
                                    this.props.onDeselectLocation()
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
                                    Object.values(this.props.stations).filter(location => (location.map_id === this.props.currentMap._id)).map((location, ind) =>
                                        <Location key={`loc-${ind}`}
                                            location={location}
                                            rd3tClassName={`${this.rd3tLocClassName}_${ind}`}
                                            d3={this.d3}
                                            onEnableDrag={this.onEnableDrag}
                                            onDisableDrag={this.onDisableDrag}
                                        />
                                    )
                                }</>

                                <>{
                                    //// Render children positions if appropriate
                                    Object.values(positions)
                                        // .filter(position => !!this.props.selectedTask || (!!this.props.selectedLocation && position.parent == this.props.selectedLocation._id))
                                        // This filter turns on when there's a selected task that has a load position but no unload position
                                        // If that's the case (happens when a new task exist and the load location has been selected) then filter out the other type of positions
                                        // IE, if the load positions type is a cart position, then only cart positions should be selectable
                                        // .filter(position => {
                                        //     if (!!this.props.selectedTask && !!this.props.selectedTask.load.position && !this.props.selectedTask.unload.position) {
                                        //         const positionType = this.props.positions[this.props.selectedTask.load.position].type
                                        //         return position.type === positionType
                                        //     }
                                        //     else {
                                        //         return true
                                        //     }
                                        // })


                                        .filter(position => {
                                            // remove positions not associated with current map
                                            if (position.map_id !== this.props.currentMap._id) return false

                                            // This filters positions when making a process
                                            // If the process has routes, and you're adding a new route, you should only be able to add a route starting at the last station
                                            // This eliminates process with gaps between stations
                                            if (!!this.props.selectedTask && !!this.props.selectedProcess && this.props.selectedProcess.routes.length > 0 && this.props.selectedTask.load.position === null) {
                                                // Gets the last route in the routes array
                                                const previousRoute = this.props.selectedProcess.routes[this.props.selectedProcess.routes.length - 1]

                                                const previousTask = this.props.tasks[previousRoute]

                                                if (!!previousTask.unload) {

                                                    const unloadStationID = previousTask.unload.station
                                                    const unloadStation = this.props.locations[unloadStationID]

                                                    if (unloadStation.children.includes(position._id)) {
                                                        return true

                                                    }
                                                }

                                                // return true
                                            }

                                            // This filters out positions that aren't apart of a station when making a task
                                            // Should not be able to make a task for a random position
                                            else if (!!this.props.selectedTask) {
                                                return !!position.parent
                                            }

                                            else {
                                                return true
                                            }
                                        })
                                        .map((position, ind) =>
                                            <>
                                                <Location key={`pos-${ind}`}
                                                    location={position}
                                                    rd3tClassName={`${this.rd3tPosClassName}_${ind}`}
                                                    d3={this.d3}
                                                    onEnableDrag={this.onEnableDrag}
                                                    onDisableDrag={this.onDisableDrag}
                                                />
                                            </>
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
        locations: state.locationsReducer.locations,
        positions: state.locationsReducer.positions,
        stations: state.locationsReducer.stations,
        tasks: state.tasksReducer.tasks,

        selectedLocation: state.locationsReducer.selectedLocation,
        selectedTask: state.tasksReducer.selectedTask,
        selectedProcess: state.processesReducer.selectedProcess,

        hoveringInfo: state.locationsReducer.hoverStationInfo,
        editing: state.locationsReducer.editingLocation,
        widgetLoaded: state.locationsReducer.widgetLoaded,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onGetMap: (map_id) => dispatch(mapActions.getMap(map_id)),
        onSetCurrentMap: (map) => dispatch(setCurrentMap(map)),

        onUpdateStations: (stations) => dispatch(stationActions.updateStations(stations)),
        onUpdatePositions: (positions) => dispatch(positionActions.updatePositions(positions)),
        onUpdateDevices: (devices, d3) => dispatch(deviceActions.updateDevices(devices, d3)),

        onPostPosition: (position) => dispatch(positionActions.postPosition(position)),
        onSetLocationAttributes: (id, attr) => dispatch(locationActions.setLocationAttributes(id, attr)),
        onSetPositionAttributes: (id, attr) => dispatch(positionActions.setPositionAttributes(id, attr)),
        onRemovePosition: (id) => dispatch(positionActions.removePosition(id)),

        onDeselectLocation: () => dispatch(deselectLocation()),
        onHoverStationInfo: (info) => dispatch(hoverStationInfo(info)),
        onWidgetLoaded: (bool) => dispatch(widgetLoaded(bool)),


    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MapView))
