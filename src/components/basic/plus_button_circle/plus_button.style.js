import styled from 'styled-components'
import {globStyle} from '../../../global_style'

export const PlusSymbol = styled.i`
    display: flex;
    flex-direction: row;
    flex-basis: 5rem;
    flex-shrink: 0;

    color: ${props => props.disabled ? props.theme.bg.tertiary : props.schema ? props.theme.schema[props.schema] : props.theme.fg.primary};
    height: 1.6rem;
    width: 1.6rem;
    margin: none;
    padding: none;
    transform: translate(-0.55rem, -0.16rem);
    font-size: 1.6rem;
    text-align: center;
    vertical-align: middle;
    line-height: 1.6rem;
`;

export const PlusButton = styled.button`
    width: 1.6rem;
    height: 1.6rem;
    margin: 0.25rem;
    margin-top: 0.5rem;
    border-radius: 0.75rem;
    background-color: transparent;
    border: none;
    text-align: center;
    box-sizing: border-box;

    :focus {
      outline: 0;
    }
`;
