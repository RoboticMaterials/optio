import React from 'react';
import * as style from './minus_button.style'
import {globStyle} from '../../../global_style'

const MinusButton = (props) => (
    <style.MinusButton onClick={props.onClick}>
        <style.MinusSymbol
            style={{...props.style}}
            className={"far fa-minus-square"}
            disabled={props.disabled}
            schema={props.schema}
        >
        </style.MinusSymbol>
    </style.MinusButton>
);

export default MinusButton;
