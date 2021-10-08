import styled, { css } from 'styled-components'
import { ModalContainerCSS, BodyContainerCSS } from '../../../../../../common_css/modal_css'

export const Container = styled(ModalContainerCSS)`
    width: 40rem;
	min-width: 15rem;
    max-width: 80%;

    height: auto;
`

export const CloseIcon = styled.i`
    font-size: 1.4rem;
    margin: 1rem;
    color: ${props => props.theme.bg.quaternary};
    cursor: pointer;
`

export const HeaderMainContentContainer = styled.div`
	display: flex;
  	flex-direction: row;
	justify-content: space-between;
    align-items: center;
    flex: 1;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: stretch;
  align-content: center;
  margin: 0;
  padding: .5rem 1rem;
  background: ${props => props.theme.bg.primary};
  box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
`

export const Label = styled.h3`
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.textColor};
    // margin-bottom: 1rem;
    width: 100%;
`

export const Title = styled.h2`
  height: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.fontSize.sz2};
  font-weight: ${props => props.theme.fontWeight.bold};
  // margin-bottom: 1rem;
  flex-grow: 1;
`;

export const ContentContainer = styled.div`
	background: ${props => props.theme.bg.secondary};
    height: 100%;
    padding: 0 3rem;
	border-radius: 0rem;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
    overflow-x: hidden;
	align-items: center;
`