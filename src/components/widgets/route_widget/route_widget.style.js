import styled from 'styled-components'


// export const Container = styled.div`
//     display: flex;
//     justify-content: ${props => !!props.widgetPage ? 'center' : ''};
//     transition: all 0.3s ease;
// `

export const WidgetLocationContainer = styled.div`
    position: absolute;

    top: ${props => props.yPosition};
    left: ${props => props.xPosition};
    width: 6rem;
    max-width:8rem;
    transition: ${props => !!props.widgetPage ? 'top 0.25s ease, margin 0.25s ease' : 'none'};

    pointer-events: auto;
    z-index: 10;

`

export const WidgetContainer = styled.div`
    justify-content:center;
    padding-top:.3rem;
    padding-bottom:.3rem;
    width: 6rem;
    max-width: 8rem;
    height: 4rem;

    box-shadow: ${props => !!props.widgetPage ? 'none' :'0 0.1rem 0.2rem 0rem #303030'};

    border-radius: 1rem;

    z-index: 1000;

    backdrop-filter: ${props => !!props.widgetPage ? '' : 'blur(10px)'};
    background-color: ${props => !!props.widgetPage ? 'none' : 'rgba(255, 255, 255, 0.6)'};

`

export const WidgetStationName = styled.h4`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;
    flex:10;
    justify-content: center;
    text-align: center;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

`
