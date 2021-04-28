import styled from 'styled-components'

export const Container = styled.div`
    width: 40rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-60%);
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.1);
    padding: 4rem 6rem;
`

export const LogoContainer = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 5%;
    margin-top: 5%;
`

export const LogoIcon = styled.i`
    font-size: 10rem;
    margin-top: -.5rem;
    margin-right: .1rem;
    color: ${props => props.theme.fg.secondary};
`

export const LogoSubtitle = styled.h2`
    color: ${props => props.theme.bg.senary};
    font-family: 'Montserrat';
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: -10rem;
    padding: 0;
`;

export const LogoWelcome = styled.h1`
    color: ${props => props.theme.bg.senary};
    font-family: 'Montserrat';
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    padding: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: auto;
    display: flex;
    position: relative;
    margin-bottom: 2%;
    margin-top: 5%;
`;

export const SignInUpContainer = styled.div`
    font-family: 'Montserrat';
    font-size: 1.25rem;
    margin: 0.5rem;
    width: 20rem;

    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.senary};
    text-align: center;
    
`

export const Button = styled.button`
    cursor: 'pointer';
    width: 20rem;
    border-radius: 0.5rem;
    background-color: #FF4B4B;
    color: white;
    display: flex;
    align-self: center;
    justify-content: center;
    padding: 0.5rem;
    border: none;
    box-shadow: 0 0.05rem 0.1rem 0rem #303030
`

export const NoteText = styled.h4`
    display: flex;
    align-self: center;
    justify-content: center;
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.quaternary};
    text-align: center;
    width: 20rem;
`

export const ErrorText = styled.p`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bad};
    width: 20rem;
    margin-top: 0.5rem;
    text-align: center;
`