import styled from 'styled-components';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import {css} from 'styled-components'

export const ContentContainer = styled.div`
  display: flex;
`;


export const TimePickerComponent = styled(TimePicker)`
    ${props => props.css};
    
    & .rc-time-picker-panel-select-option-selected {

    }

    & .rc-time-picker-panel-input-wrap {

    }

    & .rc-time-picker-clear,
    & .rc-time-picker-clear-icon:after {

    }
    
    & .rc-time-picker-panel-inner {
        border-color: ${props => props.hasError && "red"};
        box-shadow:  ${props => props.hasError && "0 0 5px red"};
    }

    & .rc-time-picker-panel-select,
    & .rc-time-picker-input,
    & .rc-time-picker-panel-input,
    & .rc-time-picker-panel-input-wrap {
        border-color: ${props => props.hasError && "red"};
        box-shadow:  ${props => props.hasError && "0 0 5px red"};
    }
`;

export const ErrorContainerComponent = styled.div`
    position: relative;
    width: auto;
    height: auto;
    margin-left: 1rem;
`;
