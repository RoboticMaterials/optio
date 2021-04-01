import styled from 'styled-components'

export const WorkstationGroup = styled.g`
    stroke-width: 0;
    opacity: 0.8;
    
`

export const TranslateGroup = styled.g`
    cursor: url(https://ssl.gstatic.com/ui/v1/icons/mail/images/2/openhand.cur), grab;

    &:active {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
    }
`