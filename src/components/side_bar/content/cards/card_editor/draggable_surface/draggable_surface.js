import React, {Component, useEffect, useRef, useState} from 'react'
import { ReactDOM, Route } from 'react-dom'
import { connect } from 'react-redux';
import moduleName from 'react'
import { withRouter } from "react-router-dom";

import * as styled from './draggable_surface.style'

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
import MiR100 from '../../components/map/amrs/mir100/mir100.js'
import RightClickMenu from '../../components/map/right_click_menu/right_click_menu'

// logging
import log from "../../logger"
import { setCurrentMap } from "../../redux/actions/map_actions";
import { getPreviousRoute } from "../../methods/utils/processes_utils";
import { isObject } from "../../methods/utils/object_utils";
import {EDITOR_SIDEBAR_TYPES} from "../editor_sidebar/editor_sidebar";
import Draggable from "../draggable/draggable";

const logger = log.getLogger("MapView")

const rd3tSvgClassName = `__SVG`     // Gives uniqe className to map components to reference for d3 events
const rd3tMapClassName = `__MAP`
const rd3tLocClassName = '__LOC'
const rd3tStationClassName = `__STATION`
const rd3tLotFieldClassName = `__LOT_FIELD`
const rd3tPosClassName = '__POS'

const DraggableSurface = (props) => {
    const {
        mobileMode,
        onClick,
        zoom,
        scaleExtent,
        zoomable,
        translate,
        surface,
        draggables,
        onZoom,
        onZoomEnd,
        updateFunc,
    } = props


    const surfaceRef = useRef(null)
    const imageRef = useRef(null)

    const [showRightClickMenu, setShowRightClickMenu] = useState({})
    const [lastEvent, setLastEvent] = useState(null)
    const [initialRender, setInitialRender] = useState(true)
    const [draggable, setDraggable] = useState(true)
    const [widgetDraggable, setWidgetDraggable] = useState(true)
    const [mouseDown, setMouseDown] = useState(false)
    const [resolution, setResolution] = useState(null)

    const [naturalImageDimensions, setNaturalImageDimensions] = useState({
        width: 100,
        heigh: 100
    })
    const [d3, setD3] = useState({
        translate: [0, 0],
        scale: 1,
        naturalScale: 1,
        boundingClientHeight: 0
    })

    useEffect(() => {
        // mount
        window.addEventListener('mousedown', () => setMouseDown(true), { passive: false })
        window.addEventListener('mouseup', () => { setMouseDown(false); validateNewEntity() }, { passive: false })
        window.addEventListener("click", () => setShowRightClickMenu({}))

        // Event listener that will recalculate the map geometry when the screen size changes
        window.addEventListener('resize', () => {
            //this.calculateD3Geometry()
            bindZoomListener()
        }, { passive: false })

        // dismount
        return () => {
        }

    }, [])

    useEffect(() => {
        // !isEquivalent(surface, prevSurface)
        bindZoomListener()

        // dismount
        return () => {
        }

    }, [surface, resolution])


    // ---------- Functionality for adding new location ---------- //

    /**
     * Handles Draging new locations onto the map
     *
     * @param {*} e
     */
    const dragNewEntity = e => {

        if (!mouseDown) return

        // Handle Stations
        if (!!this.props.selectedStation && this.props.selectedStation.temp === true) {
            this.props.dispatchSetStationAttributes(this.props.selectedStation._id, {
                x: e.clientX,
                y: e.clientY
            })
        }

        // Handle Positions
        else if (!!this.props.selectedPosition && this.props.selectedPosition.temp === true && this.props.selectedPosition.schema !== "temporary_position") {
            this.props.dispatchSetPositionAttributes(this.props.selectedPosition._id, {
                x: e.clientX,
                y: e.clientY
            })
        }

        // Else it's a stations child position
        else if (!!this.props.selectedStationChildrenCopy) {
            const draggingChild = Object.values(this.props.selectedStationChildrenCopy).find(position => position.temp === true)
            if (!!draggingChild && !this.props.selectedPosition) {
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
    const validateNewEntity = () => {

        // Handle Stations
        // if (!!selectedStation && selectedStation.temp === true) {
        //     const pos = convertD3ToReal([selectedStation.x, selectedStation.y], this.d3)
        //     this.props.dispatchSetStationAttributes(selectedStation._id, {
        //         pos_x: pos[0],
        //         pos_y: pos[1],
        //         temp: false
        //     })
        // }

    }

    /* ========== D3 Functions ========== */

    /***
     * Binds the d3 listener that listens for zoom events. Conveniently it also listens to
     * drag events, so this will take care of both
     */
    const bindZoomListener = () => {
        const {
            translate,
            scale
        } = d3

        const svg = d3.select(`.${rd3tSvgClassName}`)
        const map = d3.selectAll(`.${rd3tMapClassName}`)

        let x, y
        svg.call(
            d3.behavior
                .zoom()
                .scaleExtent([-100, 100])
                // .scaleExtent([scaleExtent.min, scaleExtent.max])
                .on('zoom', onZoom)
                .on('zoomend', onZoomEnd)
                // Offset so that first pan and zoom does not jump back to [0,0] coords
                .scale(scale)
                .translate(translate),
        );
    }

    /**
     * Overwrite the listener we described above /\ to be null
     * (basically dont listen to drag/zoom events)
     */
    const unbindZoomListener = () => {
        const { rd3tSvgClassName } = this
        const svg = d3.select(`.${rd3tSvgClassName}`);
        svg.call(d3.behavior.zoom().on('zoom', null))
    }

    const onDisableDrag = () => {
        if (draggable) {
            setDraggable(false)
            unbindZoomListener()
        }
    }

    const onEnableDrag = () => {
        if (!draggable) {
            setDraggable(true)
            bindZoomListener()
        }
    }

    const onWidgetDisableDrag = () => {
        if (widgetDraggable) {
            setWidgetDraggable(false)
            unbindZoomListener()
        }
    }

    const onWidgetEnableDrag = () => {
        if (widgetDraggable) {
            setWidgetDraggable(true)
            bindZoomListener()
        }
    }

    /**
     * x: 0,
     * y: 0property, instead of going
     * through D3's scaling mechanism, which would have picked up both properties.
     *
     * @return {object} {translate: {x: number, y: number}, zoom: number}
     */
    const calculateD3Geometry = () => {
        let { locations } = this.props
        let { resolution } = surface

        let scale
        if (zoom > scaleExtent.max) {
            scale = scaleExtent.max;
        } else if (zoom < scaleExtent.min) {
            scale = scaleExtent.min;
        } else {
            scale = zoom;
        }

        let translate
        if (!!surfaceRef && !!imageRef) {

            const cHeight = surfaceRef.getBoundingClientRect().height
            const cWidth = surfaceRef.getBoundingClientRect().width

            const iHeight = imageRef.getBoundingClientRect().height
            const iWidth = imageRef.getBoundingClientRect().width

            const iNatHeight = naturalImageDimensions.height
            const iNatWidth = naturalImageDimensions.width



            // Apply translations to map.
            // The map is translated by half the container dims, and then back by
            // half the image dims. This leaves it in the middle of the screen
            translate = {
                x: props.translate.x + cWidth / 2 - iWidth / 2,
                y: props.translate.y + cHeight / 2 - iHeight / 2,
            }

            // Save necessary variables
            setD3({
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
            })

            let x, y
            //// Apply the event translation to each station
            const morphedDraggables = Object.values(draggables).map(currDraggable => {

                [x, y] = convertRealToD3([currDraggable.pos_x, currDraggable.pos_y], d3)

                return {
                    ...currDraggable,
                    x: x,
                    y: y,
                }
            })

            updateFunc(morphedDraggables) // Bulk Update

        } else {
            translate = props.translate
        }

        // Set the initial map translation
        const map = d3.selectAll(`.${rd3tMapClassName}`)
        map.attr('transform', `translate(${translate.x},${translate.y}) scale(${scale})`)

    }

    // This handles the event when an onContextMenu is triggered in the svg containing the map
    // It prevents the defaul menu for appearing and sets the state for the custom menu to appear
    // Passes along x and y for the cusotm menu
    // Go to right_click_menu to follow how the click logic works
    const handleRightClickMenu = (e) => {
        e.preventDefault()
        setShowRightClickMenu({ x: e.clientX, y: e.clientY })
    }


    if (surface == null) { return (<></>) }

    return (
        <div style={{ width: '100%', height: '100%' }} onMouseMove={dragNewEntity} onMouseUp={validateNewLocation} >
            <styled.MapContainer ref={mc => (surfaceRef = mc)} style={{ pointerEvents: widgetDraggable ? 'default' : 'none' }}>

                {/* Commented out for now */}
                {/* <Zones/> */}

                {/* Right menu */}
                {Object.keys(this.state.showRightClickMenu).length > 0 &&
                    <RightClickMenu coords={this.state.showRightClickMenu} buttonClicked={() => { setShowRightClickMenu({}) }} d3={d3} />
                }

                {/* SVG element is the container for the whole view. This allows the view to be moved as one */}
                <svg
                    className={rd3tSvgClassName}
                    width="100%"
                    height="100%"

                    // onClick only registers on left click so this works as a way to hide the menu
                    onClick={() => { setShowRightClickMenu({}) }}
                    onContextMenu={handleRightClickMenu}

                    // These 2 mouse events are used to remove the issue when moving the mouse too fast over a location causing a widget to load, but not fast enough for the onmouselave to execute
                    onMouseEnter={() => {
                        if (!!widgetLoaded) {
                            // If there is a selected location and its not the right click menu location then hide
                            // should always show widget if its the right click menu
                            if ((!!this.props.selectedStation || (!!this.props.selectedPosition && this.props.selectedPosition.schema !== 'temporary_position')) && (!this.props.editingStation || !this.props.editingPosition)) {
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
                            if ((!!this.props.selectedStation || (!!this.props.selectedPosition && this.props.selectedPosition.schema !== 'temporary_position'))) {
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
                                <styled.MapImage ref={imageRef}
                                    tall={!!surfaceRef && // Fixes the map sizing - cutoff issue
                                        surfaceRef.getBoundingClientRect().height / naturalImageDimensions.height
                                        >
                                        surfaceRef.getBoundingClientRect().width / naturalImageDimensions.width}

                                    src={'data:image/png;base64, ' + surface.map}
                                    onLoad={() => {

                                        setNaturalImageDimensions({
                                            height: imageRef.naturalHeight,
                                            width: imageRef.naturalWidth
                                        })

                                        // Geometry changes once the image finishes loading, so the geometry needs to be reclaculated
                                        // and the zoom listener needs to be re-bound to the new translations
                                        calculateD3Geometry()
                                        setResolution(surface.resolution)
                                    }}
                                >
                                </styled.MapImage>
                            }
                        </foreignObject>
                    </styled.MapGroup>

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

                    {!!resolution && !!imageRef &&
                        <>
                            <>{
                                //// Render draggables
                                Object.values(draggables)
                                    .map((currDraggable, currIndex) =>
                                        <Draggable
                                            key={`draggable-${currIndex}`}
                                            rd3tClassName={`${rd3tLotFieldClassName}_${currIndex}`}
                                            d3={d3}
                                            handleEnableDrag={onEnableDrag}
                                            handleDisableDrag={onDisableDrag}
                                        />
                                    )
                            }</>
                        </>
                    }
                </svg>
            </styled.MapContainer>
        </div >
    )
}

DraggableSurface.defaultProps = {
    scaleExtent: { min: 0, max: 6 },
    zoomable: true,
    zoom: 1,
    translate: { x: 0, y: 0 },

}


export default DraggableSurface
