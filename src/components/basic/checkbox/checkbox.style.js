import styled from 'styled-components'
import { LightenDarkenColor } from '../../../methods/utils/utils';


export const Checkbox = styled.input`
  ${props => !!props.schema ? 
    `
    --active: ${props.theme.schema[props.schema].solid};
    --border-hover: ${props.theme.schema[props.schema].solid};
    --border: ${LightenDarkenColor(props.theme.schema[props.schema].solid, 0.7)};
    --disabled-inner: ${LightenDarkenColor(props.theme.schema[props.schema].solid, 0.9)};
    `
  :
    `
    --active: #275EFE;
    --border-hover: #275EFE;
    --border: #BBC1E1;
    --disabled-inner: #E1E6F9;
    `
  }
  --active-inner: #fff;
  --background: #fff;
  
  -webkit-appearance: none;
  -moz-appearance: none;
  height: 21px;
  outline: none;
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin: 0;
  cursor: pointer;
  border: 1px solid var(--bc, var(--border));
  background: var(--b, var(--background));
  &:after {
    content: '';
    display: block;
    left: 0;
    top: 0;
    position: absolute;
  }
  &:checked {
    --b: var(--active);
    --bc: var(--active);
    --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
  }
  &:disabled {
    --b: var(--disabled);
    cursor: not-allowed;
    opacity: .9;
    &:checked {
      --b: var(--disabled-inner);
      --bc: var(--border);
    }
    & + label {
      cursor: not-allowed;
    }
  }
  &:hover {
    &:not(:checked) {
      &:not(:disabled) {
        --bc: var(--border-hover);
      }
    }
  }
  &:focus {
    box-shadow: 0 0 0 var(--focus);
  }
  &:not(.switch) {
    width: 21px;
    &:after {
      opacity: var(--o, 0);
    }
    &:checked {
      --o: 1;
    }
  }
  & + label {
    font-size: 14px;
    line-height: 21px;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    margin-left: 4px;
  }

  &:not(.switch) {
    border-radius: 7px;
    &:after {
      width: 5px;
      height: 9px;
      border: 2px solid var(--active-inner);
      border-top: 0;
      border-left: 0;
      left: 7px;
      top: 4px;
      transform: rotate(var(--r, 20deg));
    }
    &:checked {
      --r: 43deg;
    }
  }
  &.switch {
    width: 38px;
    border-radius: 11px;
    &:after {
      left: 2px;
      top: 2px;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      background: var(--ab, var(--border));
      transform: translateX(var(--x, 0));
    }
    &:checked {
      --ab: var(--active-inner);
      --x: 17px;
    }
    &:disabled {
      &:not(:checked) {
        &:after {
          opacity: .6;
        }
      }
    }
  }


  * {
    box-sizing: inherit;
    &:before,
    &:after {
      box-sizing: inherit;
    }
  }

  ${props => props.css && props.css};
`

export const Label = styled.label`
    margin-right: 1.5rem;
`
