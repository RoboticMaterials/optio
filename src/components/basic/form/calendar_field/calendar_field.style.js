import styled from 'styled-components'
import {Calendar} from "react-calendar";


export const TitleContainer = styled.h1`
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.septenary};
    margin-top: .6rem;
`;

export const DefaultContainer = styled.div`
`;

export const DefaultFieldContentContainer = styled.div`
    width: 100%;
    height: auto;
    position: relative;
`;

export const DefaultFieldDropdownContainer = styled.div`
    flex: 1;
`;

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


