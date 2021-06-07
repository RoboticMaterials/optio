import styled, { css } from "styled-components"

export const Container = styled.div`
    flex: 1;
    align-self: stretch;
    background: ${props => props.theme.bg.primary};
    display: flex;
    flex-direction: column;
`

export const StationName = styled.span`
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: ${props => props.theme.fontWeight.bold};
    
`

export const Header = styled.div`
    display: flex;
    align-self: stretch;
    align-items: center;
    justify-content: center;
    padding: .5rem 1rem
`

export const FieldsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: stretch;
    flex: 1;
    padding: 0 1rem 1rem 1rem;
    
    div:not(:first-child) {
      margin-top: .5rem;
	}
`
export const FieldContainer = styled.div`
    display: flex;
    align-items: center;
   
`

export const FieldName = styled.span`
    font-size: ${props => props.theme.fontSize.sz3};
    margin-right: 1rem;
`