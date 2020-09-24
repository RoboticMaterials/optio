import styled from 'styled-components';

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    max-width: 100%;
    width: 100%;
    align-items: center;
    
    background: ${props => props.theme.bg.octonary};
    
    flex: 1;
    
`

export const ConnectContainer = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const ConnectText = styled.p`
    font: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
`