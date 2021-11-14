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

export const Label = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-size: 1.4rem;
    line-height: 1.8rem;
    // font-weight: bold;
    color: #393975;
    text-align: center;
`