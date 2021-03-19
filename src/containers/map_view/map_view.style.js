import styled from 'styled-components'

export const MapContainer = styled.div`
    height: 100%;
    width: 100%;
    flex: 1;
    background: ${props => props.theme.bg.quaternary};
    user-select: none;

    // cursor: move; /* fallback if grab cursor is unsupported */
    // cursor: -webkit-move;
    // cursor: -moz-move;

    cursor: url(https://ssl.gstatic.com/ui/v1/icons/mail/images/2/openhand.cur), grab;

    &:active {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
    }

    background-size: cover;
    overflow: visible;
`

export const MapGroup = styled.g`
`

export const MapImage = styled.img`
    height: 100%;
    width: auto;

    ccursor: move; /* fallback if grab cursor is unsupported */
    cursor: -webkit-move;
    cursor: -moz-move;

    // ${props => props.tall && `
    //     height: auto;
    //     width: 100%;
    // `}
    
`