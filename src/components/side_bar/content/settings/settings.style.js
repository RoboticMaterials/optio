import styled from 'styled-components'

export const SettingsContainer = styled.div`
    padding: 1rem;
    padding-top: 1.5rem;
    padding-bottom: 0;

    display: flex;
    flex-direction: column;

    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }
`

export const SettingContainer = styled.div`
    width: 100%;
    margin-bottom: 2rem;
`

export const SwitchContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: 1rem;

    flex-grow: 1;
    width: 100%;
    // border: 2px solid #f5f5f5;
    padding: 0 0.5rem;
    border-radius: 0.3rem;
    margin-bottom: 0.8rem;
`
export const SwitchLabel = styled.span`
    padding: 0;
    margin: 0;
    text-align:left;
    font-family: ${props => props.theme.font.primary};
    font-size: 1rem;
    color: ${props => props.theme.textColor};

    display: flex;
    align-self: center;
`

export const DropdownContainer = styled.div`

    display: grid;
    padding: 0 0.5rem;
    grid-template-columns: 1.4fr 2fr;
    gap: 0.5rem;
    width: 100%;

    margin-bottom: 1rem;

`
export const DropdownLabel = styled.span`
    padding: 0;
    margin: 0;
    text-align: right;
    font-family: ${props => props.theme.font.primary};
    font-size: 1rem;
    color: ${props => props.theme.textColor};

    display: flex;
    align-self: center;
`

export const Label = styled.span`
    padding: 0;
    margin: 0;
    padding-top: 0.5rem;
    margin-top:2rem;
    border-top: 2px solid #f5f5f5;

    width: 100%;

    font-family: ${props => props.theme.font.primary};
    font-size: 1.4rem;
    color: ${props => props.theme.textColor};
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 0.5rem;
`

// SPECIAL STYLES

export const EmailContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 3rem;
    background: ${props=>props.theme.bg.secondary};
`


export const ChevronIcon = styled.i`
    font-size: 1.3rem;
    color: white;
    margin-left: 1rem;

    &:hover{
        cursor: pointer;
    }
`

export const ShiftSettingsContainer = styled.div`
    width: 100%;
    min-width: 22rem;
    margin-bottom: 1rem;
`