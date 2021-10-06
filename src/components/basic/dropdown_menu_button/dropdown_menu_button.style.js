import styled from 'styled-components';

export const Button = styled.div`
    width: 10rem;
    height: 2.5rem;
    border-radius: 1.25rem;
    display: flex;
    justify-content: center;
    align-items: center;

    background: ${props => props.theme.schema[props.schema].solid};
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    position: relative;
    cursor: pointer;

    z-index: 3;

    

    ${props => props.isActive &&
    `
        background: white;
        color: ${props.theme.schema[props.schema].solid};
        border: 2px solid ${props.theme.schema[props.schema].solid};

        &:active {
            background: ${props.theme.schema[props.schema].solid};
            opacity: 70%;
        }
    `}
`

export const Icon = styled.i`
    color: white;
    font-weight: 600;
    font-size: 1.6rem;
    

    ${props => props.isActive ?
        `
            color: ${props.theme.schema[props.schema].solid};
        `
        :
        `
            margin-right: 0.5rem;
        `
    }
`

export const SubButton = styled.div`
    width: 10rem;
    height: 2.5rem;
    border-radius: 1.25rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    background: ${props => props.theme.schema[props.schema].solid};
    color: white;
    font-weight: 600;
    font-size: 0.9rem;

    position: absolute;
    top: 0;

    z-index: 2;
    transition: top 0.1s ease-in;
`