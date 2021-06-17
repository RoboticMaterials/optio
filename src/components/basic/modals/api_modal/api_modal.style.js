import styled from 'styled-components'


import { css } from "@emotion/react";

export const AccountContainer = styled.div`
    background: ${props => props.theme.bg.primary};
    box-shadow: ${props => props.theme.cardShadow};
    border-radius: 0.6rem;

    height: 6rem;
    min-width: 14rem;

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 1rem;
    margin: 0.5rem;

    ${props => props.enabled ? `cursor: pointer;` : `cursor: default; opacity: 0.6;`}
`

export const AccountLogoContainer = styled.div`
    width: 5rem;
    display: flex;
    align-items: flex-start;
`

export const AccountLogo = styled.img`
    height: 4rem; 
    width: 4rem;
`

export const AccountDesc = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
`

export const AccountName = styled.h2`
    font: ${props => props.theme.font.primary};
	font-size: ${props => props.theme.fontSize.sz2};
    font-weight: bold;
    color: ${props => props.theme.bg.septenary};
    width: 100%;
    text-align: left;
`

export const AccountType = styled.h3`
    font: ${props => props.theme.font.primary};
	font-size: ${props => props.theme.fontSize.sz4};
    color: ${props => props.theme.bg.quaternary};
    width: 100%;
    text-align: left;
`

export const LinkIcon = styled.i`
	width: 2rem;

	color: black;
	font-size: 1.5rem;
    background-color: transparent;
    border: none;
    text-align: center;
    box-sizing: border-box;

    :focus {
      outline: 0;
    }

    cursor: pointer;
`

// LOGIN STYLING


export const Container = styled.div`
    display:flex;
    flex-direction:column;
    grid-template-columns: 1fr;
    grid-gap: 0.1rem;
    align-content: center;
`


export const Input = styled.input`
    width: 40rem;
    border-radius: 15px;
    font-size: 1.3rem;
    font-weight: 400;
    padding: 1rem;
    margin: 1rem;
    align-self: center;
`

export const ErrorText = styled.p`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bad};
    width: 25rem;
    margin-top: 0.5rem;
    text-align: center;
`

export const CapsIconContainer = styled.div`
    transform: translate(-2rem, 0.3rem);
    margin-right: -1.7rem;
    border: 4px solid ${props => props.theme.bg.tertiary};
    border-radius: 0.4rem;
    height: 1.7rem;
    width: 1.7rem;
    position: relative;
    box-sizing: border-box;
`

export const CapsIcon = styled.i`
    font-size: 1.6rem;
    color: ${props => props.theme.bg.tertiary};
    padding: 0;
    transform: translate(-3px, -3px);
`

export const Button = styled.button`
    cursor: 'pointer';
    width: 10rem;
    border-radius: 0.3rem;
    background-color: #FF4B4B;
    color: white;
    display: flex;
    align-self: center;
    justify-content: center;
    padding: 0.5rem;
    margin: 0.5rem;
    border: none;
    width: 100%;
    margin-top: ${props => props.isSignIn ? '1rem' : '2rem'};
    // box-shadow: 0 0.05rem 0.1rem 0rem #303030
`
export const NoteText = styled.h4`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.quaternary};
    text-align: center;
    width: 25rem;
`

export const loaderCSS = css`
margin: 1rem;
display: flex;
align-self: center;
justify-content: center;
`;