import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import * as d3ns from 'd3'
const d3 = d3ns.default || d3ns

// Import Utils
import { convertD3ToReal, convertRealToD3, getRelativeD3, getRelativeOffset } from '../../../methods/utils/map_utils'

const Zones = () => {

    /**
     * Tracking where the mouse is over the screen
     * @param {*} event 
     */
    const handleMouseMove = (event) => {
    }

    document.onmousemove = handleMouseMove;


    useEffect(() => {

    })
    return(
        <>
        </>
    )
}

export default Zones