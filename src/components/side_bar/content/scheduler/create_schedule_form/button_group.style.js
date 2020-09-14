import styled, {css} from 'styled-components';

export const Container = styled.div`
    width: 100%;
    max-width: 100%;
    background: transparent;
    border-color: transparent;
    border-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    
    word-break: break-all;
    
`

export const Button = styled.button`
    // width: 7rem;

    background: transparent;
    outline: none !important;
    outline-offset: none !important;
    border-color: transparent;
    border-width: 0;

    margin-bottom: 0.5rem;
    word-break: break-all;
    
`

export const buttonViewCss = css`
	word-break: break-all;
`

export const ButtonView = styled.div`

    flex-grow: 1;

    @media (max-width: ${props => props.theme.widthBreakpoint.tiny}) {
        height: 7rem;
        line-height: 7rem;
    }

    background: ${props => props.isSelected ? props.theme.schema['scheduler'].solid : 'transparent'};
    color: ${props => props.isSelected ? props.theme.bg.primary : props.theme.bg.octonary};

    outline: none !important;
    outline-offset: none !important;
    padding: .75rem;
    margin-left: -0.2rem;
    margin-bottom: .5rem;
    border-radius: .3rem;
    border-width: .15rem;
    border-color: ${props => props.theme.schema['scheduler'].solid};

    border-style: solid;


    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    font-weight: 400;
    @media ${props => props.theme.widthBreakpoint.mobileL} {
      padding: .25rem;
      fontSize: ${props => props.theme.fontSize.sz5};
    }
    
    border-color: ${props => props.hasError && "red"};
    box-shadow:  ${props => props.hasError && "0 0 5px red"};
    word-break: break-all;
`
