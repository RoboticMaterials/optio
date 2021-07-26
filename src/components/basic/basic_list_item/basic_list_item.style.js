import styled, { css } from 'styled-components'
import { getDebugStyle } from "../../../methods/utils/style_utils";
import * as commonCss from "../../../common_css/common_css";


// shared styles
// ******************************
export const textStyle = css`
	font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.warning ? props.theme.okay : props.theme.fg.primary};
`
// ******************************

export const Container = styled.div`
    width: 100%;


    padding-left: .5rem;
    padding-right: .5rem;
    padding-top: .5rem;
    padding-bottom: .5rem;

    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    border-radius: 0.5rem;
    border: thin solid ${props => props.theme.bg.primary};
    background-color: transparent;
    /* // optional overwrite styles passed as css in props */
    ${props => props.css};

    /* // uncomment to show debug styles */
    /* // ${getDebugStyle()}; */

    ${props => props.selectable && (props.isSelected ? selectedCss : notSelectedCss)};



`

const selectedCss = css`

`

const notSelectedCss = css`
  filter: contrast(70%);
    &:hover {
        filter: contrast(100%);
    }
`


export const Title = styled.span`
    // align-self: flex-start;
    // ${textStyle};
		overflow-wrap: break-word;

    display: inline-flex;
  	align-items: center;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 500;
    color: ${props => props.theme.bg.primary};

    /* // optional overwrite styles passed as css in props */
    ${props => props.css};

    /* // uncomment to show debug styles */
    // ${getDebugStyle()};
`

export const Status = styled.span`

    display: inline-flex;
  	align-items: center;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 500;
		color: ${props => props.theme.bg.quaternary};
`

export const LeftContentContainer = styled.div`
	/* // overwrite styles passed as css in props */
    ${props => props.css};
		overflow-wrap: break-word;
`

export const ContentContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;


	// optional overwrite styles passed as css in props
    ${props => props.css};

    // uncomment to show debug styles
    // ${getDebugStyle()};

`

export const RightContentContainer = styled.div`
	// overwrite styles passed as css in props
    ${props => props.css};
`


export const Description = styled.span`
    align-self: flex-start;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    color: ${props => props.theme.bg.senary};
    cursor: pointer;
    white-space: pre-line;

    // optional overwrite styles passed as css in props
    ${props => props.css};

`
