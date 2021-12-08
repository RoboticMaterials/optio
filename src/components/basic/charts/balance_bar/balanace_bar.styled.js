import styled from 'styled-components';

export const Row = styled.div`
    display: flex;
    flex-direction: row;
`

export const Col = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
    min-width: 14rem;
`

export const Label = styled.div`
    font-size: 0.8rem;
    font-weight: bold;
    color: #9494b5;
`

export const Value = styled.div`
    font-size: 2rem;
    font-weight: bold;
`