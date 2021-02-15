import styled, {css} from "styled-components"

export const Container = styled.div`
	display: flex;
  //background: red;
  min-height: 20%;
  min-width: 80%;
  flex-direction: column;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5000;
  padding: 1rem;
  overflow: hidden;
  max-height: 80%;
  
  background: ${props => props.theme.bg.quinary};
`

export const Header = styled.div`

`




export const Table = styled.div`
	display: flex;
  flex: 1;
  overflow: auto;
  //flex-direction: column;
  //background: yellow;
  
`

export const Column = styled.div`
  flex-direction: column;
  align-self:stretch;
  flex: 1;
	display: flex;
  border: 1px solid ${props => props.theme.bg.secondary};
  	//background: green;
`

export const Row = styled.div`
  align-self:stretch;
  flex: 1;
	display: flex;
  border: 1px solid ${props => props.theme.bg.secondary};
  	//background: green;
`

export const ItemContainer = styled.div`
	//background: blue;
  overflow: hidden;
  border-top: 1px solid ${props => props.theme.bg.secondary};
  border-bottom: 1px solid ${props => props.theme.bg.secondary};
  border-radius: .5rem;
  text-align: center;
  
  height: 2rem;
  max-height: 2rem;
  background: ${props => props.theme.bg.quaternary};
  
  //width: 10rem;
`



export const buttonViewCss = css`
	//border-right: ${props => !props.isLast && `solid ${props.theme.bg.quaternary} thin`}; // dont show border on last item
	color: ${props => props.theme.bg.quinary};
	padding: 0;
	margin: 0;
  margin: 0 .25rem;
	padding-left: .5rem;
	padding-right: .5rem;
  background: ${props => props.theme.bg.senary};
  
  &:hover {
	cursor: pointer;
  }
`


export const buttonViewSelectedCss = css`
	//background: transparent;
  background: ${props => props.theme.bg.secondary};
	color: white;
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

export const buttonGroupContainerCss = css`
	display: flex;
	flex-direction: row;
	align-self: center;
	padding: 0;
	margin: 0;
	
`