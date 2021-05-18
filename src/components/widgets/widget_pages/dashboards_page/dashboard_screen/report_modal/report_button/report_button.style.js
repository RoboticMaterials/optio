import styled from "styled-components";

export const ButtonWidthContainer = styled.div`
    display: flex;
    align-items: center;
    align-self: stretch;
    flex: 1;
    justify-content: center;
    height: fit-content;
    min-height: fit-content;
`

export const EditIcon = styled.i`
    color: ${props => props.theme.textColor};
    font-size: ${props => props.theme.fontSize.sz3};
    
    :hover {
        cursor: pointer;
    }
`