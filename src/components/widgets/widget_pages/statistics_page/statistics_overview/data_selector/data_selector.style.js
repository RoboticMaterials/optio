import styled from 'styled-components'

import { LightenDarkenColor } from '../../../../../../methods/utils/color_utils'

export const ButtonGroupContainer = styled.div`
    width: 60rem;
    max-width: 60rem;
    height: 2.5rem;

    display: flex;
    flex-directin: row;
`

export const SelectorButton = styled.button`
    flex-grow: 1;
    border: none;

    color: ${props => props.selected ? props.theme.fg.primary : props.theme.bg.senary};
    background: ${props => LightenDarkenColor(props.theme.bg.quaternary, props.selected ? -10 : -15)};

    &:focus {
        outline: none;
    }
`