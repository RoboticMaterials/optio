import styled, { css } from 'styled-components'

export const Container = styled.div`
  position: relative;
  overflow: hidden;
  align-self: stretch;
  display: flex;
  flex-direction: ${props => props.axis === 'y' ? 'column' : 'row'};
`

export const ScrollContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.axis === 'y' ? 'column' : 'row'};
  position: relative;
  overflow-y: auto;
  overflow-x: auto;
  align-self: stretch;
  align-items: center;
  flex: 1;
`

export const ContentContainer = styled.div`
	height: fit-content;
	min-height: fit-content;
  display: flex;
  flex-direction: ${props => props.axis === 'y' ? 'column' : 'row'};
  padding: 0 1rem;
	//max-height: fit-content;
  //background: pink;
  align-items: center;
  
  
  align-self: stretch;
`

export const Divider = styled.div`
    border: 0;
    position: absolute;
    height: ${props => props.axis === 'y' ? '1px' : '100%'};
    top: 0;
    left: 0;
    background: transparent;
    box-shadow: ${props => props.axis === 'y' ?  'inset 0 12px 12px -12px rgba(0, 0, 0, 0.75)': 'inset 12px 0 12px -10px  rgba(0, 0, 0, 0.75)'};
    width: ${props => props.axis === 'y' ?  '100%': '1px'};
    padding-bottom: ${props => props.axis === 'y' ?  '12px': '0'};
    padding-right: ${props => props.axis === 'x' ?  '12px': '0'};
    z-index: 10000;
  
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity ${props => props.transition} ease;
`

