import styled from 'styled-components';
import {css} from 'styled-components'


export const IconContainerComponent = styled.div`
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);
    margin: 0;
    padding: 0;
`;

export const errorCss = css`
    box-shadow: 0 0 5px red;
    border: 1px solid red;
    
    &:focus{
        outline: 0 !important;
        box-shadow: 0 0 5px red;
        border: 1px solid red;
    }
`
