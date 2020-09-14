import styled from 'styled-components';
import TimePicker from 'rc-time-picker';
import {css} from 'styled-components'

export const DefaultLabelComponent = styled.label`
`;

export const DefaultFieldContainer = styled.div`
`;

export const DefaultContentContainer = styled.div`
    flex-direction: row;
    align-items: center;
    width: 100%;
    position: relative;
    display: flex;
    
`;

export const DefaultInputContainer = styled.div`
    // width: 90%;
    flex: 1;
    align-items: center;
    margin: 0;
    padding: 0;
    position: relative;
   
`;

export const DefaultInputComponent = styled.input`
     // background: ${props =>  props.hasError && props.theme.bad};
`;

export const IconContainerComponent = styled.div`
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    margin: 0;
    padding: 0;
    // background: magenta;
    
`;

