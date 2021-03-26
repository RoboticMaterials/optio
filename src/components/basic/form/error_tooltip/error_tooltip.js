// import external dependencies
import React, { useState, useEffect, useRef } from 'react';
import ReactTooltip from "react-tooltip";

import Portal from "../../../../higher_order_components/portal";

import { uuidv4 } from '../../../../methods/utils/utils'

// import styles
import * as styled from './error_tooltip.style';
import DropDownSearchField from "../drop_down_search_field/drop_down_search_field";
import theme from '../../../../theme'

const ErrorTooltip = (props) => {

    const {
        ContainerComponent,
        text,
        visible,
        onClick,
        className,
        color,
        containerStyle,
        tooltip,
        type
    } = props

    // target input for initial display of tooltip
    const inputRef = useRef(null);

    // required for initial display of tooltip
    const [autoFocus, setAutoFocus] = useState(false);

    // unique id for tooltip
    const [id, setId] = useState(uuidv4());

    // input is initially focused to show tooltip, then blurred after timeout to hide it
    useEffect(
        () => {
            if (autoFocus) {
                let timer1 = setTimeout(() => setAutoFocus(false), 3000)

                // this will clear Timeout when component unmount like in willComponentUnmount
                return () => {
                    clearTimeout(timer1)
                }
            }

        },
        [] //useEffect will run only one time
        //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
    )

    // useEffect(() => {console.log('rebuild'); ReactTooltip.rebuild()}, [tooltip])


    // useEffect(() => {
    //     if (autoFocus) {
    //         inputRef.current.focus();
    //     } else {
    //         inputRef.current.blur();
    //     }
    // }, [autoFocus]);

    return (

        <ContainerComponent
            style={containerStyle}
        >
            {/*initial display on load*/}
            {autoFocus && visible &&
                //wrap in portal to avoid clipping issues
                <Portal>
                    <ReactTooltip style={{ zIndex: 20 }} delayShow={250} event={'focus'} eventOff={'blur'} id={id} effect='solid' type={type}>
                        <span>{text}</span>
                    </ReactTooltip>
                </Portal>

            }

            {/* only show on hover after initial display */}
            {!autoFocus && visible &&
                //wrap in portal to avoid clipping issues
                // <Portal>
                //     <ReactTooltip eventOff={'mouseout'} id={id} effect='solid' type={type} getContent={[() => {return <div>'hello'</div>}]}>
                //         {/* {text &&
                //             <span>{text}</span>
                //         } */}
                //     </ReactTooltip>
                // </Portal>

                // NOTE: portal does not allow dynamic content
                <div>
                    <ReactTooltip eventOff={'mouseout'} id={id} effect='solid' type={type}>
                        {text &&
                            <span>{text}</span>
                        }
                        {tooltip && tooltip}
                    </ReactTooltip>
                </div>
            }

            {autoFocus &&
                <styled.StyledInput
                    visible={visible}
                    ref={inputRef}
                    readOnly={true}
                    // hidden={true}
                    // autoFocus={autoFocus}
                    event={'focus'}
                    data-tip
                    data-for={id}
                />
            }

            <styled.WarningIcon
                visible={visible}
                color={color}
                className={className}
                data-tip
                data-for={id}
                onClick={onClick}
            />
        </ContainerComponent>

    );

}

// Specifies the default values for props:
ErrorTooltip.defaultProps = {
    ContainerComponent: styled.IconContainer,
    className: "fas fa-exclamation-triangle",
    color: theme.main.error,
    type: 'error'
};

export default React.memo(ErrorTooltip);