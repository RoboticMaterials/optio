import styled from 'styled-components'
import * as styleC from '../dashboard/dashboard.style'


export const InternalContainer = styled(styleC.InternalContainer)`

`
export const AddDashboardButton = styled(styleC.AddDashboardButton)`
    border: 0.25rem solid ${props => props.theme.bg.senary};
    background: none;
    justify-content: center;
`

export const AddDashboardButtonText = styled.p`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.theme.bg.senary};
`

export const PlusButton = styled.i`
    color: ${props => props.theme.bg.quaternary};
    font-size: 2rem;
`

export const MenuButton = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: center;
    background-color: none;

    &:hover {
        cursor: pointer;
    }
`
export const Container = styled.div`
    display: flex;
    flex-direction: column;
`
