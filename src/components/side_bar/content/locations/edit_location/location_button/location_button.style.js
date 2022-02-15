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

export const LocationTypeButton = styled.div`
    height: ${props => props.schema == 'position' ? '4.5rem' : '6rem'};
    width: 7.5rem;
    border-radius: 0.5rem;

    background: ${props => props.isSelected ? `#ebecf0` : props.isNotSelected ? 'lightgray' : '#f5f5f7'};

    margin: 0.5rem;
    position: relative;
    opacity: 0.999;
    z-index:  ${props => props.isSelected && 10};

    box-shadow: ${props => props.isSelected ? `inset 0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1)` : `0 0.2rem 0.3rem 0rem rgba(0,0,0,0.3)`};

    ${props => !props.isSelected &&
    `    cursor: url(https://ssl.gstatic.com/ui/v1/icons/mail/images/2/openhand.cur), grab;

        &:active {
            cursor: grabbing;
            cursor: -moz-grabbing;
            cursor: -webkit-grabbing;
        }
    `
    }

`

export const LocationTypeLabel = styled.p`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    color: ${props => props.theme.bg.quaternary};
    margin-bottom: auto;
    user-select: none;
    text-align: center;
`
