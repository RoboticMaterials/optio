import styled, {css} from 'styled-components'

export const glow = (color) => css`
	box-shadow: 0 0 5px ${color} ;
	border: 1px solid ${color};
`

export const errorGlow = css`
  ${props => glow(props.theme.bad)};
`;

export const newGlow = css`
  ${props => glow(props.theme.warn)};
`;

export const goodGlow = css`
  ${props => glow(props.theme.good)};
`;

export const commonIcon = css`
  //border: none;
  //font-size: 2rem;
  transition: all 0.25s ease;
  color: ${props => props.color};


  filter: brightness(${props => props.filter});

  &:focus{
    //outline: 0 !important
  }
  
  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active{
    //box-shadow: none;
    filter: brightness(85%);
  }

`