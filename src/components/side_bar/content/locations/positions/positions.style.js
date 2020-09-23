import styled from 'styled-components'

export const PositionsContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;

    user-select: none;
`

export const Label = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 1.5rem;
    font-weight: 500;
    color: ${props => props.theme.schema.locations.solid};
    text-align: center;
    user-select: none;
`

export const LocationTypeGraphic = styled.svg`
    height: 2.5rem;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

export const Cards = styled.div`
    height: 5rem;
`

export const NewPositionCard = styled.div`

    height: 3rem;
    width: 6rem;
    border-radius: 0.5rem;

    background: ${props => props.theme.bg.octonary};
    opacity: 0.999;

    position: absolute;
    left: calc(50% - 3rem);

    box-shadow: 0 0.2rem 0.3rem 0rem rgba(0,0,0,0.3);

    cursor: grab;
    &:active {
        cursor: grabbing;
    }
`

export const ListContainer = styled.div`
    flex: 1;
`

export const PositionList = styled.div`
    width: 100%;
`

export const PositionListItem = styled.div`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    padding-bottom: 0.4rem;

`

export const SortIcon = styled.i`
    font-size: 1.2rem;
    color: ${props => props.theme.bg.octonary};

    margin: 0.4rem;
    margin-left: 0.6rem;
    padding: 0;
    background-color: transparent;
    border: none;
    text-align: center;
    box-sizing: border-box;

    &:hover{
        cursor: ns-resize;
    }
    &:active{
        cursor: grabbing;
    }

`
