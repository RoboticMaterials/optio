import styled from 'styled-components'

export const Container = styled.div`
    height: 40%;
    width: 35%;
    position: absolute;
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
    position: relative;
    margin-bottom: 2%;
    margin-top: 5%;
`;

export const SignInUpContainer = styled.div`
    
`

export const CheckBoxWrapper = styled.div`
    position: relative;
    display: grid;
    align-items: center;
    justify-content: center;
`;

export const CheckBoxLabel = styled.label`
    top: 0;
    left: 0;
    width: 42px;
    height: 26px;
    border-radius: 15px;
    background: #bebebe;
    cursor: pointer;
    &::after {
        content: "";
        display: block;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        margin: 3px;
        background: #ffffff;
        box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
        transition: 0.2s;
    }
`;
export const CheckBox = styled.input`
    opacity: 0;
    z-index: 1;
    border-radius: 15px;
    width: 42px;
    height: 26px;
    &:checked + ${CheckBoxLabel} {
        background: #FF4B4B;
        &::after {
        content: "";
        display: block;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        margin-left: 21px;
        transition: 0.2s;
        }
    }
`;