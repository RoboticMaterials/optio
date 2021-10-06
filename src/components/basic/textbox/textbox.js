import React, { useEffect, useRef } from 'react'
import * as styled from './textbox.style'

export default function Textbox(props) {

    let InputComponent;
    if (props.lines) { InputComponent = props.inputAreaComponent }
    else { InputComponent = props.inputComponent }

    const inputRef = useRef(null)

    useEffect(() => {
        if (props.focus == true) {
            inputRef.current.focus()
        }
    }, [props.focus])

    useEffect(() => {
        if (props.keepFocus === true) {
            inputRef.current.focus()
        }
    })

    return (
        <React.Fragment>
            {(!props.inline && props.label) && <styled.TextboxLabel style={props.labelStyle}>{props.label}</styled.TextboxLabel>}
            <styled.TextboxContainer className="form-group" style={{ ...props.style }}>
                {props.inline && <styled.TextboxLabel style={props.labelStyle}>{props.label}</styled.TextboxLabel>}
                <InputComponent
                    ref={inputRef}
                    className={"form-control " + props.className}
                    placeholder={props.placeholder}
                    style={{...props.inputStyle}}
                    value={props.value}
                    onChange={props.onChange}
                    onKeyPress={props.onKeyPress}
                    rows={props.lines}
                    type={props.type}
                    defaultValue={props.defaultValue}
                    disabled={props.disabled || !props.usable}
                    readOnly={props.readOnly || !props.usable}
                    schema={props.schema}
                    onBlur={props.onBlur}
                    onFocus={props.onFocus}
                    style={props.inputStyle}
                    autoFocus={props.autoFocus}
                />
                {props.tooltip}
            </styled.TextboxContainer>
        </React.Fragment>
    )

}

Textbox.defaultProps = {
    inputAreaComponent: styled.TextboxArea,
    inputComponent: styled.TextboxInput,
    autofocus: false,
    flex: false,
    usable: true,
    inline: false,
    labelStyle: null,
    onBlur: () => { },
    onFocus: () => { },
}
