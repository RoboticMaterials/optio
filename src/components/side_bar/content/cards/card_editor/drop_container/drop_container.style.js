import styled, {css} from 'styled-components'

export const ColumnContainer = styled.div`
	display: flex;
  	flex-direction: column;
  flex: ${props => props.deleted ? 0 : 1};
  transition: opacity 0.4s ease;
  transition: flex 0.4s ease;
  //transition: height 1s ease;

  opacity: ${props => props.deleted && 0};
  width: ${props => props.deleted ? 0 : "fit-content"};
  min-width: ${props => props.deleted ? 0 : "fit-content"};
  //height: ${props => props.deleted ? 0 : "fit-content"};
  overflow: hidden;
  align-self: stretch;
  //transition: all 3s ease;
`

export const RowContainer = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
  
`

const hoverCss = css`
  background: black;
  padding: 1rem;
`
export const LeftContainer = styled.div`
	background: red;
  	flex: 1;
  	align-self: stretch;
	${props => props.hovering && hoverCss};
`

export const RightContainer = styled.div`
	background: green;
	flex: 1;
	align-self: stretch;
	${props => props.hovering && hoverCss};
`

export const TopContainer = styled.div`
	background: orange; 
	flex: 1;
	align-self: stretch;
	${props => props.hovering && hoverCss};
`


export const BottomContainer = styled.div`
  background: purple;
	flex: 1;
	align-self: stretch;
	// height: ${props => props.hovering ? "1rem" : ".5rem"};
	${props => props.hovering && hoverCss};
`

