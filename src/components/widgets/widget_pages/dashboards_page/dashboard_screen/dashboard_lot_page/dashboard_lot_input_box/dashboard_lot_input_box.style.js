import styled from "styled-components";
import { FieldArray, Form, Formik } from 'formik'


export const Container = styled.div`
    width: 100%;
    max-width: 50rem;

    height: fit-content;
    min-height: 10rem;

    background: ${props => props.theme.bg.primary};
    box-shadow: ${props => props.theme.cardShadow};

    padding: 1rem;
    border-radius: .5rem;

    align-self: center;

    margin-bottom: 1rem;

`

export const Title = styled.h3`

`

export const InputForm = styled(Form)`
    display: flex;
    justify-content:center;
    flex-direction: column;
`