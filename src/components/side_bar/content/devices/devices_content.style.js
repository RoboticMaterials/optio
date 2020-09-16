import styled, { css } from 'styled-components'

export const ContentContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;
    padding-top: 1.5rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
    overflow-x: hidden;

    ::-webkit-scrollbar{
        display: none;
    }

`

export const DevicesSpan = styled.span`
    /* line-height: 2rem; */
`

export const Circle = styled.div`
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
    border: solid .1rem red;
    position: absolute;
`

export const SettingsIcon = styled.i`
    font-size: 3rem;
    display: flex;
    position: absolute;
    left: 17rem;
    margin-top: -1rem;
`

export const AddDeviceIcon = styled.i`
    font-size: 5rem;
    margin-top: 1rem;
    &:hover{
        cursor: pointer;
    }

`

export const SettingsContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
`

export const SettingsSectionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 25rem;
    margin: .75rem 0rem;
`

export const SettingsLabel = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    color: ${props => props.theme.schema[props.schema].solid};
    line-height: 1rem;
`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
`

export const Header = styled.div`
    display: flex; 
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`