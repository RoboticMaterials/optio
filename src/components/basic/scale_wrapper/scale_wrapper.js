import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from "./scale_wrapper.style"

const ScaleWrapper = (props) => {

    const {
        children,
        scaleFactor
    } = props

    const [size, setSize] = useState({
        offsetWidth: undefined,
        offsetHeight: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })
    const {
        offsetHeight,
        offsetWidth,
        offsetTop,
        offsetLeft
    } = size || {}

    const sizeRef = useRef(null)
    const {
        offsetHeight: refOffsetHeight,
        offsetWidth: refOffsetWidth,
        offsetTop: refOffsetTop,
        offsetLeft: refOffsetLeft
    } = sizeRef.current || {}

    useEffect(() => {

        // if sizeRef is assigned
        if (sizeRef.current) {

            const {
                offsetHeight,
                offsetWidth,
                offsetTop,
                offsetLeft
            } = sizeRef.current || {}

            // set zoneSize
            setSize({
                offsetHeight,
                offsetWidth,
                offsetTop,
                offsetLeft
            });
        }

    }, [sizeRef, refOffsetWidth, refOffsetHeight])

    console.log("offsetHeight",offsetHeight)
    console.log("size",size)
    console.log("Math.round(offsetHeight * scaleFactor)",Math.round(offsetHeight * scaleFactor))
    console.log("Math.round(offsetWidth * scaleFactor)",Math.round(offsetWidth * scaleFactor))

    return (
        <styled.Container
            width={`${Math.round(offsetWidth * scaleFactor)}px`}
            height={`${Math.round(offsetHeight * scaleFactor)}px`}
        >
            <styled.ScaleContainer
                ref={sizeRef}
                scaleFactor={scaleFactor}
            >
                {children}

            </styled.ScaleContainer>

        </styled.Container>
    );
};

ScaleWrapper.propTypes = {
    scaleFactor: PropTypes.number,
};

ScaleWrapper.defaultProps = {
    scaleFactor: 0.5,
};

export default ScaleWrapper;
