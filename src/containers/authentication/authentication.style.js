import styled from 'styled-components'

export const Container = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const LogoContainer = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    margin-bottom: 3rem;
    margin-top: 20%;
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