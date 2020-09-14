import styled from 'styled-components'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export const Header = styled.div`
    display: flex; 
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
    user-select: none;
`

export const ClearIcon = styled(DeleteForeverIcon)`

`