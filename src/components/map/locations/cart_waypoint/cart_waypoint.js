import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from "react-router-dom";

// Import Styles
import * as styled from './cart_waypoint.style'

const CartWaypoint = (props) => {

    const {
        d3,
        x,
        y,
    } = props
    const dispatch = useDispatch()

    const handleRenderWaypoints = () => {

        const xPosition = (x-10) + 'px'
        const yPosition = (y-20) + 'px'

          return (
              <styled.Container xPosition={xPosition} yPosition={yPosition}>
                <styled.WaypointIcon
                    className='fas fa-map-marker-alt'
                    style={{ color: '#ffb62e' }}
                />
              </styled.Container>
          )
  }

    return (
      handleRenderWaypoints()
    )
}

export default CartWaypoint
