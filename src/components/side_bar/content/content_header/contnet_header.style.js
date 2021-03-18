import styled from 'styled-components'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export const Header = styled.div`
    display: flex; 
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 1rem;

    font-family: ${props => props.theme.font.primary};
    /* font-size: ${props => props.theme.fontSize.sz3}; */
    font-size: 1.2rem;
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};

    align-items: center;
`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
    user-select: none;
`

export const EditTitle = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 1.4rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
    user-select: none;

    text-align: center;
    flex-grow: 1;

    transform: translateX(-1.5rem);
`

export const ClearIcon = styled(DeleteForeverIcon)`

`