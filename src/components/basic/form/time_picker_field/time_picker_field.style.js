import styled from 'styled-components';
import TimePicker from 'rc-time-picker';
import {css} from 'styled-components'


export const DefaultContainer = styled.div`
	position: relative;
`;

export const DefaultErrorContainerComponent = styled.div`
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);
    margin: 0;
    padding: 0;
    z-index: 500;
`;


const someCss = css`
    // ${props => props.css};
    //
    // & .rc-time-picker-panel-select-option-selected {
    //
    // }
    //
    // & .rc-time-picker-panel-input-wrap {
    //
    // }
    //
    // & .rc-time-picker-clear,
    // & .rc-time-picker-clear-icon:after {
    //
    // }
    //
    // & .rc-time-picker-panel-inner {
    //     border-color: ${props => props.hasError && "red"};
    //     box-shadow:  ${props => props.hasError && "0 0 5px red"};
    // }
    //
    // & .rc-time-picker-panel-select,
    // & .rc-time-picker-input,
    // & .rc-time-picker-panel-input,
    // & .rc-time-picker-panel-input-wrap {
    //     border-color: ${props => props.hasError && "red"};
    //     box-shadow:  ${props => props.hasError && "0 0 5px red"};
    // }
`
export const TimePickerComponent = styled(TimePicker)`
    
`;
