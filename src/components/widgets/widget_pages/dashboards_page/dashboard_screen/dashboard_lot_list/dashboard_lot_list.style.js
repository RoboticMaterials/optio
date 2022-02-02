import styled, { css } from "styled-components";
import * as commonCss from '../../../../../../common_css/common_css'


const scrollCss = css`
::-webkit-scrollbar {
        width: 12px;
        height: 5px;
        margin: 1rem;
        background: transparent;
        border: none;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: ${props => props.theme.bg.tertiary};
    }

    ::-webkit-scrollbar-track:hover {
      background: ${props => props.theme.bg.tertiary};
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: ${props => props.theme.bg.quaternary};
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: ${props => props.theme.bg.quaternary};

    }
`

export const LotListContainer = styled.div`
    ${commonCss.columnContainer}
    justify-content: center;
    padding: 1rem;
    width: 100%;
    overflow: auto;

    ${scrollCss};
`

export const LotCardContainer = styled.div`
    ${commonCss.rowContainer}
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    overflow: auto;
    ${scrollCss};

`

export const Footer = styled.div`
    z-index: 10;
    background: ${props => props.theme.bg.primary};
    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);

    display: flex;
    flex-grow: 1;
    width: 100%;
    height: 6rem;

    position: absolute;
    bottom: 0;
    left: 0;
`
