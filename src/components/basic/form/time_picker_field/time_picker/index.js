import styled from "styled-components";
import TimePicker from "./time_picker";
import { hexToRGBA } from '../../../../../methods/utils/color_utils'

const StyledTimePicker = styled(TimePicker)`

  & .rc-time-picker-panel-select-option-selected {
    background-color: ${props => props.schema ? hexToRGBA(props.theme.schema[props.schema].solid, 0.5) : hexToRGBA(props.theme.fg.red, 0.5)};
    font-weight: normal;
  }

  & .rc-time-picker-clear,
  & .rc-time-picker-clear-icon:after {
    font-size: ${props => props.theme.fontSize.sz4};
  }

  & .rc-time-picker-panel-select {
    font-family: ${props => props.theme.font.primary};
    font-size: 16px;
    cursor: pointer;

    li:hover {
        background-color: ${props => props.schema ? hexToRGBA(props.theme.schema[props.schema].solid, 0.1) : hexToRGBA(props.theme.fg.red, 0.1)};
    }
  }

  & .rc-time-picker-panel-input {
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    cursor: pointer;
  }

  & .rc-time-picker-input {
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    cursor: pointer;
    
    background: ${props => props.theme.bg.secondary};

    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    transition: none;
  }

`;

export default StyledTimePicker;
