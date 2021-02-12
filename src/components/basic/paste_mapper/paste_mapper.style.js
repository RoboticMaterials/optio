import styled, {css} from "styled-components"

export const Container = styled.div`
	display: flex;
  background: red;
  min-height: 20%;
  min-width: 80%;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5000;
`

export const Table = styled.div`
	display: flex;
  flex: 1;
  overflow: auto;
  //flex-direction: column;
  background: yellow;
  
`

export const Row = styled.div`
  flex-direction: column;
  align-self:stretch;
  flex: 1;
	display: flex;
  	background: green;
`

export const ItemContainer = styled.div`
	background: blue;
  height: 2rem;
  //width: 10rem;
`