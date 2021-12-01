import styled from 'styled-components'

export const Page = styled.div`
    height: 100%;
    width: 100%;
    background: ${props => props.theme.bg.secondary};

    display: flex;
    flex-direction: column;
    padding: 0.5rem;
`

export const Header = styled.div`
    margin: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    color: #a1a1b5;
`

export const Container = styled.div`
    display: flex;
    align-items: center;
`

export const ProcessCard = styled.div`
    height: 5rem;
    cursor: pointer;

    background: white;
    box-shadow: 0px 4px 8px 4px rgba(200, 206, 222, 0.25);
    border-radius: 0.5rem;

    margin: 0.4rem 0.5rem;
    display: flex;
    align-items: center;

    &:hover {
        transform: scale(1.0025);
        box-shadow: 0px 6px 10px 6px rgba(200, 206, 222, 0.25);
    }

    transition: all 200ms;
`

export const IconContainer = styled.div`
    width: 3rem;
    height: 3rem;
    margin: 1rem 2rem;
    font-size: 1rem;
    background: #f5f5ff;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
`

export const LabelContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
`

export const Label = styled.div`
    font-size: 1.1rem;
    color: ${props => props.theme.textColor.primary};
    font-weight: bold;
`

export const SubLabel = styled.div`
    font-size: 0.9rem;
    color: #a1a1b5;
`

export const Dot = styled.div`
    height: 0.65rem;
    width: 0.65rem;
    border-radius: 50%;
    margin: 0.5rem;
`

export const Chevron = styled.i`
    font-size: 1.5rem;
    color: #a1a1b5;
    margin: 0 1rem;
`