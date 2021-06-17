import styled from 'styled-components'


export const MenuContainer = styled.div`
    position: absolute;
    width: 12rem;
    height: auto;
    z-index: 10000;

    background: white;

    box-shadow: 0 0.1rem 0.2rem 0rem #303030;
    border-radius: 0.3rem;

    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.6);

    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
`

export const MenuButton = styled.button`
    border: none;
    text-align: center;
    width: 100%;
    height: 2rem;
    outline:none;


    background-color: transparent;

    &:hover{
        background-color: ${props => props.theme.bg.tertiary};
    }

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }
`;