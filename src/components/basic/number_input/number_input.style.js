import styled from 'styled-components';
import {css} from 'styled-components'


export const Container = styled.div`
  display: flex;
  flex-direction: row;
`

export const Input = styled.input`
  -webkit-transition: all 0.30s ease-in-out;
  -moz-transition: all 0.30s ease-in-out;
  -ms-transition: all 0.30s ease-in-out;
  -o-transition: all 0.30s ease-in-out;

  transition: all 0.30s ease-in-out;
  transition: all 0.30s ease-in-out;
  
  margin: 1rem 1rem;
  border-radius: .5rem;
  text-align: center;
  width: 10rem;
  font-size: 2rem;
  color: white;
  background: ${props => props.theme.bg.quinary};
  
  //-webkit-appearance: none !important;
  &:focus{
    outline: 0 !important;
    box-shadow: 0 0 5px #56d5f5;
    border: 1px solid #56d5f5;
    filter: brightness(120%);
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

export const Button = styled.button`
  font-size: 5rem;
  text-shadow: 0.05rem 0.05rem 0.2rem #303030;
  transition: text-shadow 0.1s ease, filter 0.1s ease;
  color: ${props => props.color};
  background: transparent;
  border: none;
  outline: none !important;
  
  ${props => props.disabled && disabledCss};
  
  &:hover {
      cursor: pointer;
  }
  
  &:active{
      filter: brightness(85%);
      text-shadow: none;
  }
  
  
`

const disabledCss = css`
  color: ${props => props.theme.disabled};
`
