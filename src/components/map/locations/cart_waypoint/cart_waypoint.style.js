import styled from 'styled-components'


export const Container = styled.div`
    position: absolute;
    display: flex;

    flex-direction: column;
    align-items: center;

    top: ${props => props.yPosition};
    left: ${props => props.xPosition};

    padding: .1rem;
    background-color: transparent;
    opacity: 100%;

`

export const WaypointIcon = styled.i`

    font-size: 1.3rem;
    color: lightgreen;

`
