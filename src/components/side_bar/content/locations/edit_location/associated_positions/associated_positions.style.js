import styled from 'styled-components'

export const PositionsContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;

    user-select: none;
    justify-content: flex-start;
    align-content: flex-start;
    flex-grow: 1;
`

export const Label = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 1.5rem;
    font-weight: 500;
    color: ${props => props.theme.bg.septenary};
    text-align: center;
    user-select: none;
`

export const LocationTypeGraphic = styled.svg`
    height: 4.5rem;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 0.3rem));

    fill: ${props => props.isNotSelected && 'gray'};
    stroke: ${props => props.isNotSelected && 'gray'};
`

export const LocationTypeLabel = styled.p`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    color: ${props => props.theme.bg.quaternary};
    margin-bottom: auto;
    user-select: none;
    text-align: center;
`

export const Card = styled.div`
    height: 4.5rem;
    width: 6rem;
    position: relative;
    margin: 0rem 1rem;
`

export const CardContainer = styled.div`
    margin-top: 1.5rem;
    margin-bottom: 2rem;

    display: flex;
    flex-grow: 1;
    flex-direction: row;

    justify-content: center;
    align-content: center;
    align-items: center;

`

export const NewPositionCard = styled.div`

    max-height: 4.5rem;
    max-width: 6rem;

    height: 100%;
    width: 100%;

    border-radius: 0.5rem;

    background: ${props => props.theme.bg.secondary};
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
        background: transparent;
    }

    cursor: url(https://ssl.gstatic.com/ui/v1/icons/mail/images/2/openhand.cur), grab;
`

export const ListContainer = styled.div`
    flex: 1;
`

export const PositionList = styled.div`
    width: 100%;
`

export const PositionListItem = styled.div`
    border-radius: 0.5rem;
    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.1);

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
    // color: ${props => props.theme.bg.octonary};

    margin: 0.4rem;
    margin-left: 0.6rem;
    padding: 0;
    background-color: transparent;
    border: none;
    text-align: center;
    box-sizing: border-box;

    &:hover{
        cursor: pointer;
    }

`
