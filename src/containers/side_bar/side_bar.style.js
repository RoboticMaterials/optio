import styled from 'styled-components'


export const SideBarOpenCloseButton = styled.button`
    position: absolute;
    top: 0rem;
    z-index: 101;
    height: 3.2rem;
    width: 3.2rem;
    margin-top: 0.4rem;
    margin-left: 1rem;

    border-radius: .5rem;

    box-shadow: 0 0.1rem 0.2rem 0rem #303030;
    /* background-color: ${props => props.showSideBar ? 'rgba(255,255,255,0.2)' : props.theme.bg.secondary} ; */
    background: rgba(97, 98, 109, 0.97);
    
    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:focus{
        outline: 0 !important;
    }

    &:active{
        box-shadow: none;
    }

    &:hover{
    }

    // @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
    //     width: 3.5rem;
    //     height: 3.5rem;
    //     margin-left: .5rem;
        
    // }
`

// export const HamburgerInner = styled.span`
//     &:before
// `

export const SidebarWrapper = styled.div`
    position: absolute;
    top: 4rem;
    bottom: 0rem;
    
    display: flex;
    align-items: stretch;
    flex-flow: row nowrap;
    flex-direction: row;
    flex: 1;
    // width: auto;
    // flex-grow: 0;

    background: rgba(46, 47, 58, 0.97);
    overflow: hidden;
`

export const SidebarContent = styled.div`
    display: flex;
    align-self: stretch;
    flex: 1;

    // background: ${props => props.theme.bg.primary};
    z-index: 1;
    backdrop-filter: blur(3px);

    border-radius: 0 0 8px 0;
    // border-right: 8px solid ${props => props.theme.bg.quinary};

    background-color: rgba(255, 255, 255, 0.1);
    
    overflow: hidden;
   
`

export const ResizeBar = styled.div`
	background-color: rgba(97, 98, 109, 0.97);
    cursor: ew-resize;
    width: 8px;
    min-width: 8px;
    display: flex;
    z-index: 10;
    align-items: center ;
    align-content: center ;
    justify-content: center;
    
`

export const ResizeHandle = styled.div`
    cursor: ew-resize;
    width: 4px;
    height: 30px;
    background: ${props => props.theme.schema[props.content].solid};
    border-radius: 8px;
    text-align: center;
    z-index: 10;
    overflow: hidden;
    display: flex;
    align-items: center ;

`