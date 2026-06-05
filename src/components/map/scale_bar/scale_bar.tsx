import React from 'react'

const AL = 10  // arrowhead length
const AH = 6   // arrowhead half-height
const BAR_DIV_HEIGHT = 40  // approximate pixel height of the rendered div

/**
 * Scale indicator overlaid at the bottom-left corner of the map image.
 *
 * Position is computed from d3 state so it tracks the map as the user pans/zooms.
 *   left  = d3.translate[0]  (left edge of map image in CSS px)
 *   top   = d3.translate[1] + d3.scale * d3.actualDims.height  (bottom edge of map image)
 *
 * Bar length uses actualDims (rendered CSS px) / naturalDims (original PNG px) to
 * convert user-supplied PNG-pixel distances to on-screen CSS pixels.
 *
 * Props:
 *   d3            – d3 state from MapView (translate, scale, actualDims, naturalDims)
 *   pixelsPerFoot – original PNG pixels per foot
 *   scaleUnit     – 'ft' | 'm'
 */
const ScaleBar = ({ d3, pixelsPerFoot, scaleUnit }) => {
    if (!pixelsPerFoot || pixelsPerFoot <= 0) return null
    if (!d3 || !d3.translate || !d3.actualDims || !d3.naturalDims) return null

    const unit = scaleUnit || 'ft'

    // CSS/SVG pixels per one real-world unit at the current zoom level.
    // actualDims.height / naturalDims.height = CSS px per PNG px (display scale).
    // d3.scale = current zoom multiplier.
    const displayScale = d3.actualDims.height / d3.naturalDims.height
    const pxPerUnit = unit === 'm'
        ? d3.scale * pixelsPerFoot * displayScale / 0.3048
        : d3.scale * pixelsPerFoot * displayScale

    if (pxPerUnit <= 0) return null

    // Pick the smallest "nice" count that gives a bar at least 60px wide.
    const niceNumbers = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000]
    let count = niceNumbers[niceNumbers.length - 1]
    for (const n of niceNumbers) {
        if (n * pxPerUnit >= 60) { count = n; break }
    }

    const barLength = count * pxPerUnit
    if (barLength > 600) return null

    const label = `${count} ${unit}`

    // Bottom-left of the map image in CSS coordinates (SVG coords == CSS px since no viewBox).
    const mapLeft   = d3.translate[0]
    const mapBottom = d3.translate[1] + d3.scale * d3.actualDims.height

    return (
        <div style={{
            position: 'absolute',
            left:  mapLeft + 8,
            top:   mapBottom + 8,
            background: 'rgba(255,255,255,0.80)',
            borderRadius: 3,
            padding: '3px 6px 4px',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 10,
        }}>
            <div style={{
                fontSize: 11,
                fontFamily: 'sans-serif',
                color: '#222',
                textAlign: 'center',
                marginBottom: 2,
                lineHeight: 1,
            }}>
                {label}
            </div>
            <svg
                width={barLength + 2}
                height={AH * 2 + 2}
                style={{ display: 'block', overflow: 'visible' }}
            >
                <g transform={`translate(0, ${AH + 1})`}>
                    <polygon points={`0,0 ${AL},${-AH} ${AL},${AH}`} fill="#222" />
                    <line x1={AL} y1={0} x2={barLength - AL} y2={0} stroke="#222" strokeWidth={1.5} />
                    <polygon points={`${barLength},0 ${barLength - AL},${-AH} ${barLength - AL},${AH}`} fill="#222" />
                </g>
            </svg>
        </div>
    )
}

export default ScaleBar
