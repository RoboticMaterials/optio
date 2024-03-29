import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import * as styled from './location_svg.style'

// Import Constants
import { StationTypes } from '../../../../constants/station_constants'
import { PositionTypes } from '../../../../constants/position_constants'
import PropTypes from "prop-types";
import { LightenDarkenColor } from '../../../../methods/utils/color_utils'

const LocationSvg = (props) => {

    const {
        location,
        rd3tClassName,
        color,
        d3,
        isSelected,
        hovering,
        rotating,
        hoveringInfo,
        shouldGlow,

        handleMouseEnter,
        handleMouseLeave,
        handleMouseDown,
        handleTranslating,
        handleRotating,


    } = props

    const schema = location.schema
    const locationTypes = {
        ...StationTypes,
        ...PositionTypes
    }

    const settings = useSelector(state => state.settingsReducer.settings)
    const [colour, setColour] = useState(color)
    const ellipsis = (text) => {

    }
    useEffect(() => {
      setColour(color)

    }, [color])
    return (
        <styled.WorkstationGroup
            id={rd3tClassName}
            className={rd3tClassName}
            style={{ fill: colour, stroke: colour }}
            onMouseOver={e => e.stopPropagation()}
            onMouseEnter={() => {
                handleMouseEnter()
                if(!!isSelected) setColour(LightenDarkenColor('#5c6fff', -50))
            }}
            onMouseDown={() => {
                handleMouseDown()
            }}
            onMouseLeave={() => {
                handleMouseLeave()
                setColour(color)
            }}
            transform={`translate(${location.x},${location.y}) rotate(${-location.rotation}) scale(${d3.scale / d3.imgResolution})`}
        >
            {((settings.mapApps.labels || isSelected) && hoveringInfo?.id !== location?._id) && 
                <text y={-16} fontSize="0.7em" dominantBaseline="middle" textAnchor="middle">{location.name}</text>

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

        {/*   <g
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
            */}

            <styled.TranslateGroup
                className={`${rd3tClassName}-trans`}
                onMouseEnter={() => {
                    handleMouseEnter()
                }}
                onMouseDown={() => handleTranslating(true)}
                onMouseUp={() => handleTranslating(false)}
                // Devices and shelf positions require their own transforms
                transform={location.type === 'device' ? 'scale(.07) translate(-180,-140)' : location.type === 'shelf_position' ? 'rotate(90)' : ''}
            >

                <svg id={`${rd3tClassName}-${schema}`} x="-10" y="-10" width="20" height="20" viewBox="0 0 400 400" style={{ filter: shouldGlow ? 'url(#glow2)' : 'none' }}>
                    {locationTypes[location.type].svgPath}
                </svg>


            </styled.TranslateGroup>


        </styled.WorkstationGroup>
    )
}

LocationSvg.propTypes = {
    handleMouseEnter: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    handleMouseDown: PropTypes.func,
    handleTranslating: PropTypes.func,
    handleRotating: PropTypes.func,
}

LocationSvg.defaultProps = {
    handleMouseEnter: () => {},
    handleMouseLeave: () => {},
    handleMouseDown: () => {},
    handleTranslating: () => {},
    handleRotating: () => {},
}

export default LocationSvg
