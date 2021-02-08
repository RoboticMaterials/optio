import styled, {css} from 'styled-components'

export const Container = styled.div`
	display: flex;
	align-items: center;
`

export const Label = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
	margin-right: 1rem;
`