import styled from "styled-components";
import * as commonCss from '../../../../../../common_css/common_css'


export const LotHeader = styled.div`
    ${commonCss.rowContainer}
    align-items: center;
`

export const LotTitle = styled.p`
    color: ${props => props.theme.bg.octonary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz1};

    margin-bottom: 0;
`

export const LotContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    flex: 1;
    
    padding-bottom: 1rem;

`

export const LotFieldsContainer = styled.div`
    height: fit-content;
    width: 30rem;
    background: orange;
    padding: 1rem;
    border-radius: .5rem;
    align-self: center;
`