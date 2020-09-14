import styled from 'styled-components'

import { LightenDarkenColor } from '../../../../../../methods/utils/color_utils'

export const Container = styled.div`

    
    width: 100%;
    display: flex;
    justify-content: center;
    
    margin-bottom: 0.4rem;
    
    &:focus {
        outline: none;
    }
    
    border: 0;
`

export const Button = styled.button`
    border-radius: .5rem;
    
    height: 5rem;
    
    &:focus {
        outline: none;
    }
    width: 80%;
    max-width: 80%;
    
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const Title = styled.span`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    font-weight: bold;
    
    // white-space: nowrap;
    // overflow: hidden;
    //   max-width: 10%;
    //   width: 20%;
    // word-break: break-word;
    //
    // text-overflow: ellipsis;
    

`