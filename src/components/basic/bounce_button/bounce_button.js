import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'

// Import Styles
import * as style from './bounce_button.style'
import DashboardButton from "../../widgets/widget_pages/dashboards_page/dashboard_buttons/dashboard_button/dashboard_button"
import useOnClickOutside from "../../../hooks/useOnClickOutside";

const BounceButton = (props => {

    const {
        color,
        children,
        onClick,
        disabled,
        width,
        height,
        clickable,
        hoverable,
        containerStyle,
        Component,
        backgroundColor,
        active,
        onClickOutside
    } = props

    const ref = useRef() // ref for useOnClickOutside
    useOnClickOutside(ref, onClickOutside) // calls onClickOutside when click outside of element

    return(
        <style.Container
            disabled={disabled}
            width={width}
            height={height}
            onClick={onClick}
            clickable={clickable}
            hoverable={hoverable}
            color={color}
            backgroundColor={backgroundColor}
            style={containerStyle}
            active={active}
            ref={ref}
        >
            { children}
        </style.Container>
    )

})


// Specifies propTypes
BounceButton.propTypes = {
    clickable: PropTypes.bool,
    hoverable: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    onClickOutside: PropTypes.func,
    disabled: PropTypes.bool
}

// Specifies the default values for props:
BounceButton.defaultProps = {
    clickable: true,
    hoverable: true,
    onClick: () => {},
    onClickOutside: () => {},
    disabled: false,
    width: "auto",
    height: "auto",
    backgroundColor: "#FFFFFF",
    active: false,

}

export default BounceButton
