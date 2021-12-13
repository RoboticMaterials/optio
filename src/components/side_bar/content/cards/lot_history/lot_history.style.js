import styled from 'styled-components'

export const HistoryContainer = styled.div`
    height: 100%;
    width: 100%;
    flex-grow: 1;

    padding: 2rem;
    background: ${props => props.theme.bg.secondary};
`

export const HistoryTable = styled.table`
    // border-left: 1px solid grey;
    // border-top: 1px solid grey;

    width: 100%;
    background: ${props => props.theme.bg.primary};
    border-radius: 0.3rem;
    box-shadow: 0 0 6px 0px rgba(0,0,0,0.1);
`

export const HeaderRow = styled.tr`
    // display: flex;
    // flex-direction: row;
    height: 2.5rem;
    // width: 100%;

    border-bottom: 1px solid lightgrey;
`

export const EventRow = styled.tr`
    // display: flex;
    // flex-direction: row;
    height: 2rem;
    // width: 100%;

    &:nth-child(odd) {
        background: #F0F8FF;
    }
`

export const Label = styled.th`
    font-weight: 600;
    padding 0 0.5rem;
`

export const Data = styled.td`
    // border-right: 1px solid grey;
    // border-bottom: 1px solid grey;

    padding 0 0.5rem;

    // flex-grow: 1;
    // display: block;

    // font-family: Arial;

    
`

export const Flag = styled.div`
    height: 1.5rem;
    border-radius: 0.75rem;
    font-size: 0.8rem;
    max-width: 6rem;
    justify-content: center;
    text-align: center;
    align-content: center;
    align-items: center;
    display: flex;
    font-weight: bold;

    background: ${props => props.speedStatus===1 ? '#D3FDDA' : '#FEE2E8'};
    color: ${props => props.speedStatus===1 ? '#6ab076' : '#ff6363'};
`

export const Info = styled.h1`

`

export const BigFlag = styled.div`
    height: 3rem;
    border-radius: 1.5rem;
    font-size: 1.6rem;
    font-weight: 600;
    width: fit-content;
    padding: 0 1.5rem;

    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;

    margin-left: 0.8rem;

    ${props => {
        if (props.status === 'In Progress') return `background: #bfdaff; color: #6885ad`
        if (props.status === 'Finished') return `background: #D3FDDA; color: #5d9c68`
        return `background: lightgrey; color: grey`
    }}
`