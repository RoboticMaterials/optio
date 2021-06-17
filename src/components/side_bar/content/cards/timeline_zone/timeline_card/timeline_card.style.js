import styled from "styled-components";
import {rowCss} from "../../editors/card_editor/lot_editor.style";

export const Container = styled.div`
    background: ${props => props.theme.bg.quaternary};
    
    width: 100%;
    
    
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    
    
    border: 1px solid ${props => props.theme.bg.senary};
    border-radius: 1rem;
    margin-bottom: 1rem;
    overflow: hidden;
`

export const Header = styled.div`
	display: flex;
	width: 100%;
	background: ${props => props.theme.bg.senary};
	padding: 0 2rem 0 2rem;
`

export const ColumnContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

export const RowContainer = styled.div`
	display: flex;
	padding: 1rem;
	width: 100%;
	align-items: center;
`

export const CardName = styled.span`
	display: flex;
  	align-items: center;
  	justify-content: flex-start;
	
`

export const ProcessName = styled.span`
	display: flex;
  	align-items: center;
  	justify-content: flex-start;
  	margin-right: 1rem;
  	font-size: ${props => props.theme.fontSize.sz4};
`

export const BasicInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

export const ProcessInfo = styled.div`
	display: flex;
	// background: ${props => props.theme.bg.senary};
	width: 100%;
`

export const DatesContainer = styled.span`
	display: inline-flex;
	align-items: center;
	background: ${props => props.theme.bg.quinary};
	justify-content: center;
	padding: .75rem;
	border-radius: 1rem;
	
	
	
	${rowCss};
`

export const DateItem = styled.div`
	display: flex;
	flex-direction: column;
	background: ${props => props.theme.bg.senary};
	border-radius: 1rem;
	
	padding: .5rem;
	align-items: center;
	justify-content: center;
	
	&:hover {
		cursor: pointer;
	}
	
`

export const DateArrow = styled.i`
	margin-left: 1rem;
	margin-right: 1rem;
	color: ${props => props.theme.bg.senary};
`

export const DateTitle = styled.span``

export const DateText = styled.span`
	display: inline-flex;
`