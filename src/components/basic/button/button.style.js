import { propSatisfies } from 'ramda';
import styled from 'styled-components'
import { hexToRGBA, LightenDarkenColor, RGB_Linear_Shade } from '../../../methods/utils/color_utils';


const buttonTheme = (props) => {

    if (!props.schema) {
        props.schema = 'default'
    }

    if (props.disabled) { // Disabled
        return (`
            background-color: ${props.theme.bg.secondary};
            color: ${props.theme.bg.senary};
            border: none;`
        )
    } else if (props.secondary) { // Secondary
        return (`
            background-color: transparent;
            border: 0.15rem solid ${props.theme.bg.octonary};
            color: ${!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
            border-color: ${!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
            box-sizing: content-box;
            
            &:hover {
                background-color: ${hexToRGBA(props.theme.bg.octonary, 0.03)}
            }

            ${props.active ? `
                background: ${!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};

                &:active {
                    color: ${props.theme.bg.tertiary};
                }
                `
                : `
                &:active {
                    color: ${props.theme.bg.tertiary};
                    background: ${!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
                    border-color: transparent;
                }`
            }`
        )
        
    } else if (props.tertiary) { // tertiary (Gradient)

        return (`
            background: ${!!props.schema ? props.theme.schema[props.schema].gradient : props.theme.fg.primary};
            color: ${props.theme.bg.octonary};
            border: none;

            &:hover {
                background-color: ${!!props.schema ? LightenDarkenColor(props.theme.schema[props.schema].solid, 10) : LightenDarkenColor(props.theme.fg.primary, 10)}
            }
             `
        )

    } else if (props.quaternary) { // quaternary
        return (`
            background: #26ab76;
            color: ${props.theme.bg.octonary};
            border: none;

            &:hover {
                background-color: ${LightenDarkenColor('#26ab76', -10)}
            }
             `
        )
    } else { // Primary
        return (`
            background: ${!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
            color: ${props.theme.bg.octonary};
            border: none;

            &:hover {
                background-color: ${!!props.schema ? LightenDarkenColor(props.theme.schema[props.schema].solid, 10) : LightenDarkenColor(props.theme.fg.primary, 10)}
            }
            `)
        
    }
}

export const SmallButton = styled.button`
    display: inline-block;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    margin: 0.3rem 0.5rem 0.3rem 0.5rem;
    user-select: none;

    padding: 0 1rem 0 1rem;

    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;

    border-radius: 0.35rem;
    border: none;

    ${props => buttonTheme(props)}

    &:focus {
        outline: none;
    }
`;
