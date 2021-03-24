import React from 'react';
import * as styled from './button.style'


const Button = (props) => {

    const {
      disabled,
      onClick,
      schema,
      style,
      secondary,
      tertiary,
      children,
      label,
      type,
    } = props


    return (
        <styled.SmallButton
            onClick={!disabled ? onClick : () => {return}}
            disabled={disabled}
            schema={schema}
            style={style}
            secondary={secondary}
            tertiary={tertiary}
            type = {type}
            {...props} >

        {children ?
            children
            :
            label
        }

        </styled.SmallButton>
    )
};

Button.defaultProps = {
    secondary : false,
    disabled: false,
    type: "button"
};

export default Button;
