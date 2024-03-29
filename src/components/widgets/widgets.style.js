import styled from 'styled-components'

export const EmptyDiv = styled.div``

export const WidgetLocationContainer = styled.section`
    position: absolute;

    top: ${props => !!props.widgetPage ? '0' : props => props.yPosition};
    left: ${props => !!props.widgetPage ? '0' : props => props.xPosition};
    right: ${props => !!props.widgetPage && '0'};
    transform: translate(-50%, -50%);

    border-radius: 50%;

    margin: ${props => !!props.widgetPage && 'auto'};
    margin-top: ${props => !!props.widgetPage && '.2rem'};

    pointer-events: auto;

    z-index: 10;

    // @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
    //     width: ${props => !!props.widgetPage && '25rem'};
    //     height: ${props => !!props.widgetPage && '25rem'};
    //     margin-top: ${props => !!props.widgetPage && '.205rem'};
    // }

`

export const WidgetContainer = styled.div`
    justify-content:center;
    margin: ${props => !!props.widgetPage ? '.25rem auto' : 'auto'};
    // padding-top:.3rem;
    // padding-bottom:.3rem;

    display: ${props => !!props.widgetPage ? 'flex' : ''};

    /* width: ${props => !!props.widgetPage ? '32rem' : '30rem'}; */
    width: ${props => !!props.widgetPage ? '20rem' : 'fit-content'};
    max-width: ${props => props.type == 'cart_position' || props.type == 'shelf_position' ? '13rem' : '30rem'};

    height: ${props => !!props.widgetPage ? 'auto' : '6rem'};

    // box-shadow: ${props => !!props.widgetPage ? 'none' : '0 0.1rem 0.2rem 0rem #303030'};

    border-radius: 1rem;

    z-index: 1000;

    // backdrop-filter: ${props => !!props.widgetPage ? '' : 'blur(10px)'};
    // background-color: ${props => !!props.widgetPage ? 'none' : 'rgba(255, 255, 255, 0.6)'};

    /* transition: transform 0.25s ease, margin-left 0.25s ease, margin-right 0.25s ease, height 0.25s ease; */
    /* transition: all 0.25s ease; */

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        /* width: ${props => !!props.widgetPage ? '22rem' : '20rem'}; */
        width: ${props => !!props.widgetPage ? '15rem' : 'fit-content'};

        height: ${props => !!props.widgetPage ? 'auto' : '6rem'};

        /* padding: .5rem .5rem .5rem .5rem; */
        margin-top: ${props => !!props.widgetPage && '0rem'};
        /*padding: ${props => !!props.widgetPage ? '' : '1rem'};*/

    }

    &:hover{
        cursor:pointer;
    }

    pointer-events: auto;

`

export const WidgetStationName = styled.h4`
    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;
    width: 100%;

    background: ${props => props.theme.bg.secondary};
    box-shadow: ${props => props.theme.cardShadow};
    transform: translateY(-10%);
    height: 1.5rem;
    line-height: 1.5rem;
    border-radius: 0.75rem;
    padding: 0 0.75rem;

    text-align: center;

    // flex:10;
    // justify-content: center;
    // text-align: center;
    // padding-left: 2rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

`

export const WidgetPositionName = styled.h4`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;
    justify-content: center;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const WidgetHoverArea = styled.div`
    margin-top: -12.7rem;
    width: 3rem;
    height:1.5rem;
    /* z-index: -1; */
    /* background: red; */
    /* stroke: 1rem solid red; */

    margin: 0rem auto;

    transform: scale(${props => props.hoverScale});

    &:hover{
        cursor:pointer;
    }

`

export const WidgetPageButtonContainer = styled.div`
    width: 30rem;
    border-radius: 1rem;
    /* z-index: 1; */
    margin-top: .5rem;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        width: 20rem;
    }

`

export const WidgetButtonContainer = styled.div`
    height: 100%;
    width: 100%;
    border-radius: 50%;

    border: 2px solid ${props => props.theme.bg.secondary};

    &.expand-appear {
        transform: scale(0.01);
    }

    &.expand-appear-active {
        transform: scale(1);
        transition: transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
`

export const WidgetButtonRow = styled.div`
    height: 4rem;
    display: flex;
    flex-direction: row;
    z-index: 4;

    position: absolute;
    top: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
`

const getTransformAroundCircle = (idx, numItems, radius) => {
    const start = 110;
    const end = 250;

    const range = end - start;
    const slice = range/(numItems - 1);

    const theta = start + slice*idx;

    return `rotate(${theta}deg) translateY(-${radius}) rotate(${-theta}deg)`
}

export const WidgetButtonWrapper = styled.div`

    position: absolute;
    top: 50%;
    left: 50%;
    transform: ${props => getTransformAroundCircle(props.idx, props.numItems, props.radius)}

`

export const WidgetBlurContainer = styled.div`
    position: absolute;
    top: 0rem;
    width: 100%;
    height: 100%;
    /* z-index: -1; */
    backdrop-filter: blur(10px);

    /* opacity: ${props => !!props.showWidgetPage ? '100%' : '0%'};

    transition: all 0.25s ease; */
`


export const WidgetStatisticsBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2rem;
`;

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding-right: .7rem;
    justify-content: center;

`;

export const EditIcon = styled.i`
    font-size: 1rem;
    text-align: right;
    flex:1;
    margin-left:0.5rem;
    &:hover {
      color: #798fd9;
    }

`;

export const WidgetStatisticsContainer = styled.div`
    display: flex;

    width: 100%;
    height: 3rem;

    /* padding: 0rem 3rem; */
    padding: 0rem 1rem;
    margin-top: .5rem;

    justify-content: space-between;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        padding: 0rem 1rem;

    }
`;

export const WidgetStatisticsGraphic = styled.svg`
    overflow: visible;
    text-align: center;
    width: 2rem;
    height: 2rem;
    background-color: blue;
    /* transform: translateY(-0.3rem); */
`;

export const WidgetStatisticsIcon = styled.i`
    /* font-size: 1.5rem; */
`

export const WidgetStatisticsText = styled.p`
    align-self: auto;
    margin-left: .5rem;
    margin-top: auto;
    margin-bottom: auto;
`

// export const CloseButton = styled.span`
//     border: none;
//     background: none;
//     color: ${props => props.theme.fg.primary};
//     font-size: 8rem;
//     font-weight: 200;
//     text-align: center;
//     position: absolute;
//     z-index: 4;
//     line-height: 4rem;

//     font-family: ${props => props.theme.font.primary};

//     cursor: pointer;
//     top: 1rem;
//     right: 1rem;
//     &:focus {outline:0;}

//     @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
//         font-size: 3rem;
//         right: 1rem;
//         top: .5rem;
//     }

// `;

export const CloseButton = styled.i`
    border: none;
    background: none;
    color: ${props => props.theme.fg.red};
    text-align: center;

    font-size: 4rem;
    z-index: 4;
    margin-left: 1rem;

    position: absolute;
    cursor: pointer;
    left: .5rem;
    &:focus {outline:0;}

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 3rem;
    }

    z-index: 10000;

`;


export const LocationOverlay = styled.div`
    cursor: pointer;
    z-index: 100;

    ${props => `
        height: ${17*props.scale}px;
        width: ${17*props.scale}px;
        border-radius: ${2*props.scale}px;
    `}

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`