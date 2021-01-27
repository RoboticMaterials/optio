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