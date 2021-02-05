import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

// import * as styled from './draggable.style'

// Import Utils
// import { convertD3ToReal } from '../../../../methods/utils/map_utils'

// Import Components
import DragEntityProto from '../../../../../map/locations/drag_entity_proto'
import LotFieldSvg from "../lot_field_svg/lot_field_svg";

function Draggable(props) {


    const {
        rd3tClassName,
        updateItem,
        id,
        d3,
        handleEnableDrag,
        handleDisableDrag,
        disableTranslate,
        disableRotate,
        disableHover,
        x,
        y,
        rotation
    } = props

    // console.log("Draggable props",props)


    const [hovering, setHovering] = useState(false)
    const [rotating, setRotating] = useState(false)
    const [translating, setTranslating] = useState(false)

    const dispatch = useDispatch()

    const highlight = false


    // ======================================== //
    //                                          //
    //            Draggable Functions             //
    //                                          //
    // ======================================== //

    useEffect(() => {
        window.addEventListener("mouseup", () => { setRotating(false); setTranslating(false) })
        return () => {
            window.removeEventListener("mouseup", () => { setRotating(false); setTranslating(false) })
        }

    }, [])

    const onMouseEnter = () => {
        setHovering(true)
    }

    const onMouseDown = () => {
    }

    const onTranslating = (bool) => {
        setTranslating(bool)
    }

    const onRotating = (bool) => {
        setRotating(bool)
    }

    const onMouseLeave = () => {
        setHovering(false)
    }


    return (
        <React.Fragment key={`frag-draggable-${id}`}>
            <LotFieldSvg
                id={id}
                rd3tClassName={rd3tClassName}
                color={"#dddddd"}
                d3={d3}
                isSelected={false}
                hovering={hovering}
                rotating={rotating}
                hoveringInfo={null}
                shouldGlow={false}
                x={x}
                y={y}
                rotation={rotation}
                handleMouseEnter={onMouseEnter}
                handleMouseLeave={onMouseLeave}
                handleMouseDown={onMouseDown}
                handleTranslating={onTranslating}
                handleRotating={onRotating}
            />

            <DragEntityProto
                isSelected={false}
                location={{ x, y, rotation }}
                rd3tClassName={rd3tClassName}
                isSelected={true}
                d3={() => d3()}

                handleRotate={(rotation) => {
                    // dispatchSetStationAttributes(station._id, { rotation })
                }}
                handleTranslate={({ x, y }) => updateItem({ x, y })}
                handleTranslateEnd={({ x, y }) => {
                    // const pos = convertD3ToReal([x, y], props.d3)
                    // dispatchSetStationAttributes(station._id, { pos_x: pos[0], pos_y: pos[1] })
                }}

                handleEnableDrag={() => {
                    handleEnableDrag()

                }}
                handleDisableDrag={() => {
                    handleDisableDrag()
                }}


            />
        </React.Fragment>
    )
}

export default Draggable
