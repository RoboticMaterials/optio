import styled from 'styled-components'

export const Container = styled.div`
    /* position: absolute; */
    /* left: 12rem; */
    /* bottom: 3rem; */
    /* right: 12rem; */
    /* border-bottom: 0.02rem solid white; */
    z-index: 1;
    margin-bottom: 1rem;


`;

export const TimespanButton = styled.button`
    background: none;
    border: none;
    position: relative;

    display: inline-block;
    width: 5rem;
    height: 2rem;
    margin: 0rem .25rem;
    
    color: ${props => props.selected ? props.color : "white"};
    line-height: 2rem;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
    font-family: ${props => props.thcolor};

    border-bottom: ${props => props.selected ? '0.14rem' : '0.02rem'} solid ${props => props.selected ? props.color : "white"};
    box-sizing: border-box;

    cursor: pointer;
    z-index: 2;
    &:focus {outline:0;}
    &:hover {
        color: ${props => props.color};
    }
`;