import styled from 'styled-components';
import TimePicker from './time_picker_field';
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