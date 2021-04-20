import styled, { css } from 'styled-components';
import * as commonCss from "../../common_css/common_css"

export const Container = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    align-self: stretch;

    
    flex-direction: column;
`

export const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
`

export const spinnerCss = css`
    // margin: auto;
`

export const LoaderContainer = styled.div`
    // position: absolute:

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    // background: rgba(0,0,0,0.2);

`

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: stretch;
    flex: 1;
`

export const SettingSection = styled.div`
    display: flex;
    align-self: stretch;
    flex-direction: column;
`

export const SettingRow = styled.div`
    display: flex;
`



export const SettingLabel = styled.span`
    color: ${props => props.theme.schema.account.solid};
    font-size: ${props => props.theme.fontSize.sz3};
    font-weight: 800;
    margin-left: 1rem;
`

export const SettingValue = styled.span`
    color: ${props => props.theme.textColor};
    font-size: ${props => props.theme.fontSize.sz3};
    margin-left: 2rem;
`

export const Username = styled.span`
    color: ${props => props.theme.schema.account.solid};
    font-size: ${props => props.theme.fontSize.sz3};
    font-weight: 800;
`

export const ProfileIcon = styled.i`
    // align-self: center;
    margin: .5rem 0;
    font-size: 5rem;
`

export const ButtonForm = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	min-height: fit-content;
    margin-top: 2rem;
`;

export const Button = styled.button`
    display: inline-block;
    min-height: 2rem;
    line-height: 1.8rem;
    text-align: center;
    margin: 0.3rem 0.5rem 0.3rem 0.5rem;
    user-select: none;

    padding: 0 1rem 0 1rem;

    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;

    border-radius: 0.35rem;
    border: none;


    &:focus {
        outline: none;
    }
`;