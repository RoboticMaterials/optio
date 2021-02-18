import styled from 'styled-components'

export const Container = styled.div`
    height: 40%;
    width: 35%;
    position: absolute;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    top: 50%;
    left: 50%;
    transform: translate(-50%,-60%);
    border-radius: 10px;
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
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 2%;
    margin-top: 10%;
`;

export const SignInUpToggleContainer = styled.div`
    height: 2.5rem;
    width: 20rem;

    margin-bottom: 3rem;
`

export const SignInToggleButton = styled.button`
    height: 100%;
    width: 50%;
`

export const SignUpToggleButton = styled.button`
    height: 100%;
    width: 50%;
`

export const SignInUpContainer = styled.div`
    
`