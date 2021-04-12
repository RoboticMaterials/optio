import styled from 'styled-components'

export const Container = styled.div`
    /* position: absolute; */
    /* left: 12rem; */
    /* bottom: 3rem; */
    /* right: 12rem; */
    /* border-bottom: 0.02rem solid white; */
    z-index: 1;
    margin-bottom: 1rem;
    display: flex;
    justify-content:center;


`;

export const TimespanButton = styled.button`
    background: none;
    border: none;
    position: relative;

    display: inline-block;
    width: 5rem;
    height: 2rem;
    // margin: 0rem .25rem;
    
    color: ${props => props.selected ? props.theme.schema.locations : props.theme.bg.quaternary};
    line-height: 2rem;
    text-align: center;
    font-size: 1rem;
    font-weight: ${props => props.selected ? 600 : 400};
    font-family: ${props => props.theme.font.primary};

    border-bottom: ${props => props.selected ? '0.14rem' : '0.02rem'} solid ${props => props.selected ? props.color : props.theme.quaternary};
    box-sizing: border-box;

    transition: color 0.5s;

    cursor: pointer;
    z-index: 2;
    &:focus {outline:0;}
    &:hover {
        color: ${props => props.color};
    }
`;