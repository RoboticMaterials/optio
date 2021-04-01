import React, { useState } from 'react';
import * as style from './back_button.style'
import {globStyle} from '../../../global_style'

const BackButton = (props) => {

    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)


    return (
        <style.BackButton
            hovered={props.hovered}
            active={props.active}
            onClick={props.onClick}
            schema={props.schema}
            style={{...props.containerStyle}}
            type = {props.type}

            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseDown={() => setActive(true)}
            onMouseUp={() => setActive(false)}
        >
            <style.BackSymbol
                hovered={props.hovered}
                active={props.active}
                style={{...props.style}}

                disable={props.disabled}
                schema={props.schema}
                className="fa fa-chevron-left"
            />

        </style.BackButton>
    )
}

BackButton.defaultProps = {
    type: "button"
};

export default BackButton;
