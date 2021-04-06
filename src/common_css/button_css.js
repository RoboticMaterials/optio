import styled, {css} from 'styled-components'


export const button = () => css`
    border-radius: .4rem;
    box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.2);
    border: none;

    &:active {
        box-shadow: none;
        transform: translateY(1px);
    }
`