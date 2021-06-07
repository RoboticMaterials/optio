import styled, { css } from "styled-components"

export const Container = styled.div`
    background: ${props => props.theme.bg.primary};
    display: flex;
    align-self: stretch;
    margin: 0 1rem;
    display: flex;
    flex-direction: column;
    box-shadow: 7px 5px 10px rgba(0,0,0,0.2);
    // border: thin solid rgba(0,0,0,0.3);
    color: ${props => props.theme.textColor};
    border-radius: .3rem;
    width: fit-content;
`

export const ValidityIcon = styled.i`
    color: ${props => props.valid ? props.theme.good : props.theme.bad};
    margin-right: 1rem;
`

export const FieldLabel = styled.span`
    white-space: nowrap;
`

export const InstructionContainer = styled.button`
    display: flex;
    align-items: center;
    border: none;
    background: transparent;
    
    transition: all .2s ease;
    padding: .25rem .5rem;
    border-radius: .2rem;
    :hover {
        background-color: rgba(0,0,0,0.2);
    }
    :active {
        background-color: rgba(0,0,0,0.4);
    }
`

export const Name = styled.span`
    margin: 0;
    padding: 0;
    font-weight: ${props => props.theme.fontWeight.bold};
    font-size: ${props => props.theme.fontSize.sz3};
    // background: red;
`

export const Header = styled.div`
    display: flex;
    align-self: stretch;
    justify-content: center;
    position: relative;
    margin: .25rem .5rem;
    align-items: center;
`


export const Body = styled.div`
    display: flex;
    flex-direction: column;
    align-self: stretch;
    flex: 1;
    padding: .5rem;
    
    div:not(:first-child) {
      margin-top: .25rem;
	}
`