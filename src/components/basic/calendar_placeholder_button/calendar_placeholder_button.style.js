import styled, {css} from "styled-components";

const usableCss = css`
  &:hover {
    cursor: pointer !important;
    filter: brightness(105%);
  }
`

const notUsableCss = css`
  &:hover {
    cursor: default;
  }
`

export const DateItem = styled.div`
	display: flex;
	flex-direction: column;
	background: ${props => props.theme.bg.primary};
	border-radius: 0.2rem;
  width: fit-content;
  position: relative;
  min-width: 10rem;

  padding: .5rem 1rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${props => props.usable ? usableCss : notUsableCss};
`

export const DateText = styled.span`

`
