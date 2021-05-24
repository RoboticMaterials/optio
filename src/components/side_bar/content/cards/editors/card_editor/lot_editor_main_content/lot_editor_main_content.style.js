import styled, {css} from "styled-components";

export const buttonViewCss = css`
	// border-right: ${props => !props.isLast && `solid ${props.theme.bg.quaternary} thin`}; // dont show border on last item
	color: ${props => props.theme.bg.quinary};
	padding: 0;
	margin: 0;
	padding-left: .5rem;
	padding-right: .5rem;
	font-size: ${props => props.theme.fontSize.sz3};
	font-family: ${props => props.theme.font.primary};
`

export const ObjectLabel = styled.span`
	display: inline-flex;
	margin-right: 1rem;
	font-family: ${props => props.theme.font.primary};
	font-weight: bold;
  align-items: center;
  text-align: center;
`

export const buttonGroupContainerCss = css`
	display: flex;
	flex-direction: row;
	align-self: center;
	padding: 0;
	//margin: 0 0 1rem 0;
  width: fit-content;
  
	
`

export const buttonViewSelectedCss = css`
	background: transparent;
	color: ${props => props.theme.schema["lots"].solid};
`

export const buttonCss = css`
	margin: 0;
	padding: 0;
  
	
	&:focus{
	}
	
	&:active{
	}
	
	&:hover{
		cursor: default;
	}
	
`

export const FieldTitle = styled.span`
  font-size: ${props => props.theme.fontSize.sz3};
  font-weight: ${props => props.theme.fontWeight.bold};
  font-family: ${props => props.theme.font.primary};
  align-self: center;
`

