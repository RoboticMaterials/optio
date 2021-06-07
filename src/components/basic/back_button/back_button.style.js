import styled from 'styled-components'

export const BackSymbol = styled.i`

    font-size: 1.2rem;
    font-weight: 800;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    color: ${props => {
      if (props.active) {
        return props.theme.bg.secondary
      } else if (props.hovered) {
        return !!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary
      } else {
        return !!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary
      }
    }}
`;

export const BackButton = styled.button`
    width: 2rem;
    height: 2rem;
    
    margin: 0.3rem 0.5rem 0.3rem 0.5rem;
    padding: 0;
    border-radius: 0.35rem;
    background-color: transparent;

    position: relative;

    border: 0.1rem solid ${props => props.theme.bg.octonary};
    box-sizing: content-box;

    :focus {
      outline: 0;
    }

    border: 0.1rem solid ${props => props.hovered ? (!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary) : props.theme.bg.octonary};
    &:active {
      background: ${props => !!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
    }

    ${props => {
      if (props.active) {
        return `
          border: 0.1rem solid transparent;
          background: ${!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
        `
      } else if (props.hovered) {
        return `
          border: 0.1rem solid ${!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
          background: transparent;
        `
      } else {
        return `
          border: 0.1rem solid ${!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
          background: transparent;
        `
      }
    }}
`;
