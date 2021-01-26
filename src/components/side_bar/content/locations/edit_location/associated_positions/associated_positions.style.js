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
    /* color: ${props => props.theme.schema.locations.solid}; */
    color: ${props => props.theme.bg.octonary};
    text-align: center;
    user-select: none;
`

export const LocationTypeGraphic = styled.svg`
    height: 2.5rem;

    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
`

export const LocationTypeLabel = styled.p`
    margin-bottom: 0rem;
`

export const Card = styled.div`
    height: 5rem;
    width: 100%;
    position:relative;
    margin: 0rem .5rem;

`

export const CardContainer = styled.div`
    display: flex;
    margin-top: 1rem;
    
`

export const NewPositionCard = styled.div`

    max-height: 4rem;
    max-width: 6rem;
    
    display: flex;

    height: 100%;
    width: 100%;

    border-radius: 0.5rem;

    background: ${props => props.theme.bg.octonary};
    opacity: 0.999;

    position: absolute;
    left: calc(50% - 3rem);

    box-shadow: 0 0.2rem 0.3rem 0rem rgba(0,0,0,0.3);

    text-align: center;
    justify-content: center;
    align-items: flex-end;

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
    border: .25rem solid ${props => props.background};
    border-radius: 1rem;

    padding: .25rem;
    padding-top: .35rem;

    margin: .5rem 0rem;

    display: flex;
    flex-direction: row;
    flex-grow: 1;
    padding-bottom: 0.4rem;
    align-items:center;

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


export const CartIcon = styled.i`
    font-size: .8rem;
    color: ${props => props.theme.bg.octonary};

    margin: 0.4rem;
    margin-left: 0.6rem;
    padding: 0;
    background-color: transparent;
    border: none;
    text-align: center;
    box-sizing: border-box;

`