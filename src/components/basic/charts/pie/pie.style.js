import styled from 'styled-components';

export const LegendContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    overflow-y: auto;
    width: 100%;
    max-height: 5.2rem;
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

export const PieHeader = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
`

export const Label = styled.div`
    font-size: 1.4rem;
    line-height: 1.8rem;
    // font-weight: bold;
    color: #393975;
    text-align: center;
`

export const TooltipIcon = styled.i`
    font-size: 0.6rem;
    color: white;
    background: #ccc;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    line-height: 1rem;
`

export const Tooltip = styled.div`
    width: 14rem;
`