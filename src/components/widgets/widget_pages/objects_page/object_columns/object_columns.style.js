import styled from 'styled-components'
import  * as styleO from '../objects_page.style'

export const LeftColumn = styled.div`
    position: absolute;
    height: 100%;
    width: 15rem;
    left: 0;
    /* background: lightcoral; */

    display: flex;
    flex-direction: column;
    align-items: center;
`

export const RightColumn = styled.div`
    position: absolute;
    height: 100%;
    width: 15rem;
    right: 0;
    /* background: lightskyblue; */

    display: flex;
    flex-direction: column;
    align-items: center;
`

export const ColumnLabel = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 2rem;
`

export const ObjectContainer = styled.div`
    width: 13rem;
    height: 3rem;
    
    border-radius: 1rem;

    border: .2rem solid red;

    display: flex;
    justify-content: center;

    margin: .5rem;
`

export const ObjectName = styled.p`
    margin: auto;
`

export const PageContinaer = styled(styleO.PageContainer)`

`