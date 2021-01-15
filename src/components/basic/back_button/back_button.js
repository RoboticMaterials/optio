import React, { useState } from 'react';
import * as style from './back_button.style'
import {globStyle} from '../../../global_style'

const BackButton = (props) => {

    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)

    const {
      onClick,
      schema,
      containerStyle,
      style,
      disabled,
    } = props

    return (
        <style.BackButton
            hovered={hovered}
            active={active}
            onClick={onClick}
            schema={schema}
            style={{...containerStyle}}

            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseDown={() => setActive(true)}
            onMouseUp={() => setActive(false)}
        >
            <style.BackSymbol
                hovered={hovered}
                active={active}
                style={{...style}}

                disable={disabled}
                schema={schema}
                className="fa fa-chevron-left"
            />

        </style.BackButton>
    )
}

export default BackButton;
