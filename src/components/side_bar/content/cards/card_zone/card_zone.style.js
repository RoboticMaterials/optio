import styled from "styled-components";

export const Container = styled.div`
   
    // width: 100%;
    
    display: flex;
    flex-direction: row;
    padding: 1rem;
    // flex: 1;
    justify-content: flex-start;
    height: ${props => props.height ? props.height + "px" : "auto"};
    min-height: ${props => props.height ? props.height + "px" : "auto"};
    // min-height: ${props => props.height + "px"};
    
    // overflow: auto;
`