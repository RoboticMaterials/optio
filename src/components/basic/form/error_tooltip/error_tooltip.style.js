import styled from "styled-components";

export const WarningIcon = styled.i`
    color: ${props => props.theme.bad};
    z-index: 10;
    pointer-events:all;
    
    // position: absolute;
    // top: 50%;
    // right: 1rem;
    // transform: translateY(-50%);
    // margin-left: 1rem;
    opacity: ${props => props.visible ? 1 : 0};
    
    z-index: 2;
`;

export const StyledInput = styled.input`
    width: 0;
    height: 0;
    position: absolute; 
    z-index: 0;
    opacity:0;
    cursor: default;
    
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export const IconContainer = styled.div`
    position: absolute;
    width: auto;
    height: auto;
    
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    margin-left: 1rem;
`;