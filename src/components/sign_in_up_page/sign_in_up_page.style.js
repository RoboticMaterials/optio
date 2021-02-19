import styled from 'styled-components'

export const Container = styled.div`
display:flex;
flex-direction:column;
grid-template-columns: 1fr;
grid-gap: 0.1rem;
align-content: center;
`


export const Input = styled.input`
    width: 20rem;
    border-radius: 15px;
    font-size: 1.3rem;
    font-weight: 400;
    padding: 1rem;
    margin: 1rem;
    align-self: center;
`

export const Button = styled.button`
    cursor: 'pointer';
    width: 10rem;
    border-radius: 1rem;
    display: flex;
    background-color: #FF4B4B;
    color: white;
    border-color: white;
    align-self: center;
    justify-content: center;
`