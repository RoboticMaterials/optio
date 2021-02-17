import styled from 'styled-components'

export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    padding: 5% 5%;
`

export const InputContainer = styled.div`
    display: grid;
    align-items: center;
    padding-left: 20px;
`

export const Input = styled.input`
    width: 90%;
    border-radius: 10px
    font-size: 1.3rem;
    font-weight: 400;
    padding: 10px;
    margin-left: 4%;
    margin: 10px
`

export const Login = styled.h2`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const Button = styled.button`
    width: 40%;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transform: translate(70%);
    background-color: #FF4B4B;
    color: white;
    border-color: white;
`