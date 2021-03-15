import React, {useEffect, useRef, useState} from 'react'
import * as styled from './textbox.style'

export default function Textbox(props) {

    let InputComponent;
    if (props.lines) {InputComponent = props.inputAreaComponent}
    else {InputComponent = props.inputComponent}

    const inputRef = useRef(null)
    const containerRef = useRef(null)
    const [inputSize, setInputSize] = useState({
        offsetHeight: undefined,
        offsetWidth: undefined,
        offsetTop: undefined,
        offsetLeft: undefined,
    })
    const {
        current
    } = inputRef || {}
    const {
        offsetWidth
    } = current || {}

    useEffect(() => {
        if (props.focus == true) {
            inputRef.current.focus()
        }
    }, [props.focus])

    useEffect(() => {

        // if inputRef is assigned
        if (inputRef.current) {

            // extract dimensions of inputRef
            let offsetHeight = inputRef.current.offsetHeight;
            let offsetWidth = inputRef.current.offsetWidth;
            let offsetTop = inputRef.current.offsetTop;
            let offsetLeft = inputRef.current.offsetLeft;

            // set zoneSize
            setInputSize({
                offsetHeight,
                offsetWidth,
                offsetTop,
                offsetLeft,
            });
        }

    }, [inputRef, inputRef.current, offsetWidth]);

    useEffect(() => {
        if (props.keepFocus === true) {
            inputRef.current.focus()
        }
    })

    return (
        <React.Fragment>
            {(!props.inline && props.label) && <styled.TextboxLabel style={props.labelStyle}>{props.label}</styled.TextboxLabel>}
            <styled.TextboxContainer
                className="form-group"
                style={{...props.textboxContainerStyle}}
                ref={containerRef}
                onScroll={(e) => {
                    console.log("containerRef.current", containerRef.current)
                    console.log("containerRef.current", containerRef.current.scroll)
                    console.log("containerRef.current", containerRef.current.offsetLeft)
                    console.log("containerRef.current", containerRef.current.scrollX)
                    console.log("containerRef.current", containerRef.current.scrollLeft)
                    console.log("containerRef.current", containerRef.current.scrollRight)
                    console.log("SCROLL e",e)
                    console.log("SCROLL e.scrollLeft",e.scrollLeft)
                    console.log("SCROLL e.scrollRight",e.scrollRight)
                        // paddingRight: $(this).find('p').data('width') - $(this).scrollLeft() - $(this).width(),
                        // width: $(this).scrollLeft() + $(this).width()
                }}
            >
                {props.inline && <styled.TextboxLabel style={props.labelStyle}>{props.label}</styled.TextboxLabel>}
                <InputComponent 
                    ref={inputRef}
                    theme={props.theme}
                    style={props.style}
                    className={"form-control "+props.className}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    onKeyPress={props.onKeyPress}
                    rows={props.lines}
                    type={props.type}
                    defaultValue={props.defaultValue}
                    disabled={props.disabled}
                    schema={props.schema}
                    onBlur={props.onBlur}
                    onFocus={props.onFocus}
                    >
                </InputComponent>
                </styled.TextboxContainer>
        </React.Fragment>
    )
    
}

Textbox.defaultProps = {
    inputAreaComponent : styled.TextboxArea,
    inputComponent : styled.TextboxInput,
    autofocus: false,
    flex: false,
    inline: false,
    labelStyle: null,
    onBlur: () => {},
    onFocus: () => {},
}
