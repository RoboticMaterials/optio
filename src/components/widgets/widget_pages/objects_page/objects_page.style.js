import styled from 'styled-components'

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    max-width: 100%;
    width: 100%;
    align-items: center;
    position: relative;

    background: ${props => props.theme.bg.octonary};
    
    flex: 1;
    
`