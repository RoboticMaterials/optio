import styled from "styled-components";
import * as commonCss from '../../../../../../common_css/common_css'


export const LotHeader = styled.div`
    ${commonCss.rowContainer}
    align-items: center;
    text-align: center;
    justify-content: center;
    
`

export const LotTitle = styled.p`
    color: ${props => props.theme.bg.octonary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz1};

    /* margin-bottom: 0;
    position: absolute;
    text-align: center;
    left: 0; 
    right: 0; 
    margin-left: auto; 
    margin-right: auto;  */

`

export const LotContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    flex: 1;
    
    padding-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;

`

export const LotButtonContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-top: .5rem;

    height: fit-content;
    display: flex;
    justify-content: center;
    background: ${props => props.theme.bg.secondary};
    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);

`

export const LotBodyContainer = styled.div`
    overflow-y: auto;
`

