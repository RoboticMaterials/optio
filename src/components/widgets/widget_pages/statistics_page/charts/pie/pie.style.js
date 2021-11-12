import styled from 'styled-components';

export const LegendContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    max-height: 6rem;
`

export const LegendItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

export const Dot = styled.div`
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: none;
    border: 3px solid ${props => props.color};
    margin-right: 0.4rem;
`

export const LegendLabel = styled.div`
    font-size: 1rem;
    color: #393975;
`