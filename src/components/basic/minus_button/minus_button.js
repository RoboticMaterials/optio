import React from 'react';
import * as style from './minus_button.style'
import {globStyle} from '../../../global_style'

const MinusButton = (props) => {

    const {
      onClick,
      type,
      disabled,
      schema,
    } = props

    return (
      <style.MinusButton onClick={onClick} type = {type}>
          <style.MinusSymbol
              style={{...props.style}}
              className={"far fa-minus-square"}
              disabled={disabled}
              schema={schema}
          >
          </style.MinusSymbol>
      </style.MinusButton>
    )
};

MinusButton.defaultProps = {
    disabled : false,
    type: 'button'
};

export default MinusButton;
