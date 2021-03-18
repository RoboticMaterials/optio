import styled, { css } from "styled-components"

export const Container = styled.div`
  align-self: stretch;
  margin: .5rem 1rem;
  display: flex;
  color: ${props => props.theme.bg.octonary};
`

const scrollCss = css`
::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        margin: 1rem;
        background: transparent;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: rgba(175,175,175,0.75);
    }

    ::-webkit-scrollbar-track:hover {
        background: rgba(175,175,175,0.6);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #27272b;
        border-radius: .5rem;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;

    }
`

export const Value = styled.span`
  ${scrollCss};
  color: ${props => props.theme.bg.octonary};
  flex: 1;
  flex-wrap: nowrap;
  overflow: hidden;
  display: flex;
  flex: 1;
  margin: 0 .5rem;
  white-space: nowrap;
  overflow: auto;
  text-overflow:clip;
`

