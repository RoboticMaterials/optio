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

const fieldValueCss = css`
 /* background-color: ${props => props.theme.bg.secondary}; */
  border: none;
  font-size: ${props => props.theme.fontSize.sz4};
  font-family: ${props => props.theme.font.primary};
  font-weight: bold;
  white-space: nowrap;
  
  flex-grow: 1;
  color: ${props => props.theme.textColor};

  /* box-shadow: 0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1) !important; */
  /* border-bottom: 2px solid ${props => props.theme.bg.secondary}; */
  
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
`

const rowCss2 = css`
  display: flex;
  align-items: center;
`

export const RowContainer = styled.div`
	${rowCss2};
`

export const LotNumber = styled.div`
	${fieldValueCss};
	
	padding: 0 2rem;
`

export const NameContainer = styled.div`
  align-self: stretch;
  padding: 1rem 1rem 1rem 0;
	background: ${props => props.theme.bg.primary};
  flex-direction: column;
	flex: 1;
  //align-self: center;
  display: flex;
  align-items: flex-start;
  margin: 0.5rem 2rem;
`

export const FieldsHeader = styled.div`
  align-self: stretch;
	display: flex;
  //padding: 1rem;
  flex-direction: column;
	//justify-content: space-between;
	width: 100%;
  	//margin-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.bg.secondary};
	//padding: 1rem;
`

export const FieldLabel = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
	font-weight: ${props => props.theme.fontWeight.bold};
	font-family: ${props => props.theme.font.primary};
	white-space: nowrap ;
	margin-right: 2rem;
	margin-bottom: .5rem;
`

export const FieldTitle = styled.span`
  font-size: ${props => props.theme.fontSize.sz3};
  font-weight: ${props => props.theme.fontWeight.bold};
  font-family: ${props => props.theme.font.primary};
  align-self: center;
`

