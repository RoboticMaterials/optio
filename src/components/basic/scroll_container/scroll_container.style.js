import styled, { css } from 'styled-components'

export const Container = styled.div`
  position: relative;
  overflow: hidden;
  align-self: stretch;
  display: flex;
  flex-direction: column;
`

export const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  align-self: stretch;
  align-items: center;
  flex: 1;
`

export const ContentContainer = styled.div`
	height: fit-content;
	min-height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
	//max-height: fit-content;
  //background: pink;
  align-items: center;
  
  
  align-self: stretch;
`

export const Divider = styled.div`
    border: 0;
    position: absolute;
  height: 1px;
    top: 0;
  left: 0;
    background: transparent;
    box-shadow: inset 0 12px 12px -12px rgba(0, 0, 0, 0.75);
    width: 100%;
    padding-bottom: 12px;
    z-index: 10000;
`

