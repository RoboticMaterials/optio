import styled from 'styled-components'


export const TaskStatisticsContainer = styled.div`
    position: absolute;
    display: flex;

    flex-direction: column;
    align-items: center;

    top: ${props => props.yPosition};
    left: ${props => props.xPosition};

    height: 4.5rem;
    width: 10rem;
    padding: .5rem;

    background: red;
    border-radius: 1rem;
    box-shadow: 0 0.1rem 0.2rem 0rem #303030;
    background-color: rgba(255, 255, 255, 0.9);

    overflow: hidden;
    white-space: nowrap;


`

export const TaskNameText = styled.p`
    margin-bottom: 0rem;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    font-weight: bold;

    align-self: baseline;

`

export const TaskText = styled.p`
    align-self: auto;
    margin-left: .25rem;
    margin-top: auto;
    margin-bottom: auto;
    font-family: ${props => props.theme.font.primary};

`

export const TaskIcon = styled.i`
    margin-bottom: .2rem;
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`