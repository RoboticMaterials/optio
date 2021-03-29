import styled from 'styled-components'

export const SettingsContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;
    padding-top: 1.5rem;
    padding-bottom: 0;

    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }
`

export const SettingContainer = styled.div`

    width: 100%;
    margin-bottom: 2rem;
`
export const ChevronIcon = styled.i`
    font-size: 1.3rem;
    color: white;
    margin-left: 1rem;

    &:hover{
        cursor: pointer;
    }
`
export const RowContainer = styled.div`

    display: flex;
    flex-direction: row;
    align-items: center;

    justify-content: space-between;
    padding-bottom: .5rem;
    margin-top: .5rem;
    border-bottom: 1px solid white;
`

export const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const Header = styled.p`
    color: ${props => props.theme.bg.octonary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};

    margin-bottom: 1rem;
`

export const ConnectionIcon = styled.i`

    margin-left: 1rem;
    font-size: 1.2rem;
    color: ${props => props.className === 'fas fa-check' ? 'green' :
        props.className === 'fas fa-circle-notch fa-spin' ? 'yellow' :
        props.className === 'fas fa-times' ? 'red' : 'gray'
    };
`

export const ConnectionButton = styled.button`

    margin-bottom: 1rem;
    border: none;
    border-radius: .5rem;
    background-color: ${props => props.theme.bg.octonary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    outline: 0 !important;
    width: 10rem;

    box-shadow: 0 0.1rem 0.2rem 0rem #303030;

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    &:hover{
        background-color: ${props => !props.disabled && props.theme.bg.senary};
    }

`

export const SwitchContainerLabel = styled.span`
    padding: 0;
    margin: 0;
    align-self: center;
    font-family: ${props => props.theme.font.primary};
    font-size: 1rem;
    color: ${props => props.theme.bg.octonary};
`
