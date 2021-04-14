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

export const activeButtonCss = css`
  box-shadow: none;
  transform: translateY(0px);
  filter: brightness(90%);
  
  //border: 1px solid ${props => props.theme.schema[props.schema].solid};
`

export const onButtonCss = css`
  box-shadow: 2px 2px 1px rgba(0,0,0,0.2);
  transform: translateY(-2px);
  filter: brightness(115%);
`

export const hoverButtonCss = css`
  //border: 1px solid ${props => props.theme.schema[props.schema].solid};
  box-shadow: 2px 2px 1px rgba(0,0,0,0.2);
  transform: translateY(-1px);
  filter: brightness(110%);
`

export const basicButtonCss = css`
  border-radius: .4rem;
  box-shadow: 1px 1px 1px rgba(0,0,0,0.2);
  border: 1px solid rgba(0,0,0,0);
`

export const buttonCss = css`
  transition: all 0.2s ease-in;
  ${basicButtonCss};
  
  &:hover {
    ${hoverButtonCss};
  }

  &:active {
    ${activeButtonCss};
  }
  
  ${props => props.on && onButtonCss}
`

