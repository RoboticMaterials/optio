import styled from 'styled-components'

export const WidgetButtonButton = styled.button`
    display:flex;
    align-self:center;
    flex-direction: column;
    border: none;
    border-radius: 1rem;
    text-align: center;
    width: 6rem;
    height: 4rem;
    outline:none;
    margin: 0rem .3rem;
    padding-top:.5rem;

    /* margin-top: 0.5rem; */

    box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1);

    // background-color: ${props => props.pageID === props.currentPage ? props.theme.bg.quaternary : props.theme.bg.septenary};
    background-color: ${props => props.theme.bg.primary};

    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:hover{
        background-color: ${props => props.theme.bg.secondary};
    }

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        width: 6rem;
        height: 4rem;

    }
`;

export const WidgetButtonLabel = styled.label`
    display: inline-block;
    width: 12.5rem;
    height: 6rem;
    text-align: center;
`;

export const WidgetButtonText = styled.h4`
    font-size: ${props => props.theme.fontSize.sz6};
    font-family: ${props => props.theme.font.primary};
    font-weight: bold;

    text-align: center;
    align-self:center;

    color: ${props => props.pageID === props.currentPage ? props.theme.fg.primary : props.theme.bg.quaternary};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){

    }
`;

export const WidgetStationName = styled.h4`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};

    text-align: center;
    align-self:center;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
      font-size: ${props => props.theme.fontSize.sz6};

    }
`;

export const WidgetButtonIcon = styled.i`
    font-size: 2.2rem;
    margin-bottom:0.3rem;
    align-self:center;
    color: ${props => props.pageID === props.currentPage ? props.theme.fg.primary : props.theme.bg.quaternary};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 2rem;


    }
`

export const WidgetButtonBlock = styled.div`
    align-self:center;
    width: 12.5rem;
    height: 4rem;
    display: inline-block;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    padding-right: 3rem;
`;

export const WidgetButtonContainer = styled.div`
    width: 25%;
    display: flex;
    justify-content: space-between;
`

export const ButtonText = styled.p`
    position: absolute;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
`
