import React from 'react';
import * as styled from './button.style'

const Button = (props) => {

    return (
        <styled.SmallButton 
            onClick={!props.disabled ? props.onClick : () => {return}} 
            disabled={props.disabled} 
            schema={props.schema}
            style={props.style} 
            secondary={props.secondary}             
            {...props} >

        {props.children ?
            props.children
            :
            props.label
        }

        </styled.SmallButton>
    )
};

Button.defaultProps = {
    secondary : false,
    disabled: false
};

export default Button;
