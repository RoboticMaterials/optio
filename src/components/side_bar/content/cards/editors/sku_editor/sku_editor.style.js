import styled, { css } from "styled-components"
import Modal from "react-modal";
import {containerLayout} from "../../../../../../common_css/layout";


export const TemplateNameContainer = styled.div`
  margin: 0 auto;
  padding: 1rem 0;
  align-self: center;
  display: flex;
  align-items: center;
`

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 0.5rem;
	margin: 0;
	background: ${props => props.theme.bg.secondary};
	z-index: 10;
	box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
	align-self: stretch;
`

export const TemplateLabel = styled.span`
	margin-right: 1rem;
  white-space: nowrap ;
  width: fit-content;
  font-size: ${props => props.theme.fontSize.sz2};
  font-family: ${props => props.theme.font.primary};
`

export const Container2 = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background: ${props => props.theme.bg.primary};
`;

export const WorkInstructionsContainer = styled.div`
    margin-left: 2rem;
    margin-right: 2rem;
`

export const ContentContainer = styled.div`
    align-self: stretch;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`

export const Label = styled.span`
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: ${props => props.theme.fontWeight};
`

export const TheBody = styled.div`
  position: relative;
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;  

`
