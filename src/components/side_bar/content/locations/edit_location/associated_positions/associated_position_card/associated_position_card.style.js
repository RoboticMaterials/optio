import styled from 'styled-components'

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
    }

    // ${props => props.isDragging && 'background: transparent; box-shadow: none;'}

    cursor: url(https://ssl.gstatic.com/ui/v1/icons/mail/images/2/openhand.cur), grab;
`