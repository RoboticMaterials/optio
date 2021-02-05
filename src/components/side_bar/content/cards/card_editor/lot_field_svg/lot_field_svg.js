import React from 'react'

import * as styled from './lot_field_svg_svg.style'
import {StationTypes} from "../../../../../../constants/station_constants";
import {PositionTypes} from "../../../../../../constants/position_constants";

const LotFieldSvg = (props) => {

    const {
        rd3tClassName,
        color,
        d3,
        isSelected,
        hovering,
        rotating,
        hoveringInfo,
        shouldGlow,
        id,
        x,
        y,
        handleMouseEnter,
        handleMouseLeave,
        handleMouseDown,
        handleTranslating,
        handleRotating,
        rotation,
    } = props

    const locationTypes = {
        ...StationTypes,
        ...PositionTypes
    }
    const schema="human"


    return (
        <styled.WorkstationGroup
            id={rd3tClassName}
            className={rd3tClassName}
            style={{ fill: color, stroke: color }}
            onMouseEnter={() => {
                handleMouseEnter()
            }}
            onMouseDown={() => {
                handleMouseDown()
            }}
            onMouseLeave={() => {
                handleMouseLeave()
            }}
            transform={`translate(${x},${y}) rotate(${rotation}) scale(${d3.scale / d3.imgResolution})`}
        >
            <div>hi</div>
            <defs>

                {/* a transparent glow that takes on the colour of the object it's applied to */}
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="glow2" height="300%" width="300%" x="-75%" y="-75%">
                    <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken" />
                    <feGaussianBlur in="thicken" stdDeviation="2" result="blurred" />
                    <feFlood floodColor={color} result="glowColor" />
                    <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
                    <feMerge>
                        <feMergeNode in="softGlow_colored" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

            </defs>

            <g
                className={`${rd3tClassName}-rot`}
                onMouseLeave={() => {
                    handleMouseLeave()
                }}

            >
                <circle x="-20" y="-20" r="20" strokeWidth="0" fill="transparent" style={{ cursor: rotating ? "pointer" : "grab" }}
                />
                {isSelected && (hovering || rotating) && hoveringInfo === null &&
                    <>
                        <circle x="-20" y="-20" r="18" fill="none" strokeWidth="4" stroke="transparent" style={{ cursor: "pointer" }}
                            onMouseDown={() => handleRotating(true)}
                            onMouseUp={() => handleRotating(false)}

                        />
                        <circle x="-18" y="-18" r="18" fill="none" strokeWidth="0.8" style={{ filter: "url(#glow)", cursor: "pointer" }}
                        />
                    </>
                }
            </g>

            <g
                className={`${rd3tClassName}-trans`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => {
                    handleMouseEnter()
                }}
                onMouseDown={() => handleTranslating(true)}
                onMouseUp={() => handleTranslating(false)}

                transform={null}
            >
                <svg id={`${rd3tClassName}-${"station"}`} x="-10" y="-10" width="20" height="20" viewBox="0 0 400 400" style={{ filter: shouldGlow ? 'url(#glow2)' : 'none' }}>
                    {locationTypes["human"].svgPath}
                    <div>ayo</div>
                </svg>


            </g>


        </styled.WorkstationGroup>
    )
}

export default LotFieldSvg