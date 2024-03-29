import styled from 'styled-components';
import {css} from 'styled-components'


export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

`

const inputCss = css`
  -webkit-transition: all 0.30s ease-in-out;
  -moz-transition: all 0.30s ease-in-out;
  -ms-transition: all 0.30s ease-in-out;
  -o-transition: all 0.30s ease-in-out;

  transition: all 0.30s ease-in-out;
  transition: all 0.30s ease-in-out;
  height: 3.5rem;

  border-radius: 0rem;
  text-align: center;
  width: 10rem;
  font-size: 2rem;
  color: white;
  background: ${props => props.theme.bg.quinary};

  color: ${props => props.theme.bg.octonary};
  background: ${props => props.theme.bg.tertiary};
  border: none;

  //-webkit-appearance: none !important;
  &:focus{
    outline: 0 !important;
    box-shadow: 0 0 5px 2px ${props => props.theme.fg.primary};
    background: ${props => props.theme.bg.secondary};
  }

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  & input[type=number] {
    -moz-appearance: textfield;
  }

  ${props => props.inputCss && props.inputCss};
`

export const Input = styled.input`
  ${inputCss};

  read-only: true;
`

export const FakeInput = styled.div`
  // background: ${props => props.theme.bg.secondary};

  ${inputCss};
`

const buttonCss = css`
  font-size: 3.5rem;
  transition: text-shadow 0.1s ease, filter 0.1s ease;
  color: ${props => props.color};
  background: transparent;
  border: none;
  outline: none !important;


`
const usableCss = css`
  &:hover {
    cursor: pointer;
  }

  &:active{
    filter: brightness(85%);
    text-shadow: none;
  }
`

const notUsableCss = css`
  &:hover {
    cursor: default;
  }

`

export const Button = styled.button`
  ${buttonCss};
  ${props => props.disabled && disabledCss};
  ${props => props.usable ? usableCss : notUsableCss}
`


const disabledCss = css`
  color: ${props => props.theme.disabled};
  &:hover {
    cursor: default !important;
  }
`
