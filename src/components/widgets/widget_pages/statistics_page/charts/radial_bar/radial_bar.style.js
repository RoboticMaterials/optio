import styled from 'styled-components';

export const CenterContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    jusify-content: center;
    align-items: center;
`

export const CenterIcon = styled.i`
    height: 26px;
    width: 26px;
    border-radius: 13px;
    margin: 0.7rem;

    line-height: 26px;
    text-align: center;

    font-size: 0.8rem;
    background-color: #DCDFF1;
    color: #56588B;
`

export const CenterLabel = styled.div`
    font-size: 0.6rem;
    color: #56588B;
`

export const CenterValue = styled.div`
    font-size: 2rem;
    line-height: 1.5rem;
    font-weight: 600;
    color: #56588B;
`