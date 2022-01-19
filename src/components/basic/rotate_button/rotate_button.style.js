import styled, {css} from 'styled-components'

export const Container = styled.button`
  transition: all 0.2s ease;

  align-self: stretch;
  padding: 0 1rem;
  background: ${props => props.theme.bg.secondary};
  width: 2.5rem;
  border: none;
  justify-content: center;
  border-left: 1px solid ${props => props.theme.bg.quaternary};
  //border-bottom: 1px solid ${props => props.theme.bg.quinary};
  outline: none !important;

  color: ${props => props.theme.textColor};

  &:active {
    border-bottom: 1px solid ${props => props.theme.schema[props.schema].solid};
    color: ${props => props.theme.schema[props.schema].solid};
  }

  ${props => props.css && props.css};
`

export const Icon = styled.i`
  transition: all 0.2s ease;
  transition: ${props => `transform ${props.rotationTime}ms ease`};
  ${props => props.rotate && `transform: rotate(180deg)`};

  ${props => props.css && props.css};
`
