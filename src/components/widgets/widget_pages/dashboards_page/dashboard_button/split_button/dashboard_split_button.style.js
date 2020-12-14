import styled, { css } from 'styled-components'

import { hexToRGBA, RGB_Linear_Shade, LightenDarkenColor } from '../../../../../../methods/utils/color_utils';

const borderGlowCss = css`
    --border-width: .1rem;
    background: none;

    @keyframes moveGradient {
        50% {
          background-position: 100% 50%;
        }
      }

    border-radius: var(--border-width);

    &::after {
    position: absolute;
    content: "";
    top: calc(-1 * var(--border-width));
    left: calc(-1 * var(--border-width));
    z-index: -1;
    width: calc(100% + var(--border-width) * 2);
    height: calc(100% + var(--border-width) * 2);
    background: linear-gradient(
        60deg,
        /* hsl(224, 85%, 66%), */
        /* hsl(269, 85%, 66%), */
        /* hsl(314, 85%, 66%), */
        /* hsl(359, 85%, 66%), */
        hsl(44, 85%, 66%),
        hsl(89, 85%, 66%),
        hsl(134, 85%, 66%),
        hsl(179, 85%, 66%)
    );
    background-size: 300% 300%;
    background-position: 0 50%;
    border-radius: calc(2 * var(--border-width));
    animation: moveGradient 4s alternate infinite;
}
`

const ButtonStyle = css`
    height: 100%;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    &:focus {
        outline: none;
    }
    padding: 0;
    margin: 0;
    letter-spacing: 1.5px;
  border: none;
  box-shadow: ${props => props.clickable ? 'none' : `2px 2px 2px rgba(0, 0, 0, 0.5)`};
  transition: all 0.1s ease 0s;
  cursor: pointer;
  outline: none;
    
  &:hover {
    ${props => props.hoverable && !props.clickable &&
    {
        boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
        transform: "translateY(-1px)",
    }
}
  }

  ${props => props.clickable && !props.disabled &&
    `&:active {
      background: ${`linear-gradient(180deg, 
          ${LightenDarkenColor(props.background, -20)} 0%, 
          ${props.background} 50%, 
          ${LightenDarkenColor(props.background, 20)} 100%)`
    }
    }`
}
  
  ${props => props.disabled &&
    {
        color: props.theme.bg.quaternary,
        background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%), ${LightenDarkenColor(props.background, -60)}`,
        pointerEvents: "none",
    }
}

    // --border-width: 3px;
    ${props => props.borderGlow &&
    borderGlowCss
}

${props => props.css};
`

export const Header = styled.div`
    // background: red;
    // background: ${props => props.theme.bg.senary};
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.5rem;
`

export const ContentContainer = styled.div`
    display: flex;
    flex: 2;
    width: 100%;
    overflow: hidden;
`

export const SubButton = styled.div`
    flex: 3;
    ${ButtonStyle};
    justify-content: space-around;
    align-items: center;
    background: rgba(0,0,0,0);
    display: flex;
    flex-direction: column;

`



export const SubButton2 = styled.button`
    ${ButtonStyle};
    flex: 1;
    height: 100%;
    border-left: 1px solid ${props => props.theme.bg.tertiary};
    background: ${props => `linear-gradient(180deg, 
                            ${LightenDarkenColor(props.background, -40)} 0%, 
                            ${LightenDarkenColor(props.background, -50)} 50%, 
                            ${LightenDarkenColor(props.background, -60)} 100%)`};
`

export const Container = styled.button`
  position: relative;
  user-select: none;
  
  // flex layout
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
	
  background: ${props => `linear-gradient(180deg, 
                            ${LightenDarkenColor(props.background, 20)} 0%, 
                            ${props.background} 50%, 
                            ${LightenDarkenColor(props.background, -20)} 100%)`};
                            
                            
  border-radius: 0.6rem;
	
	
  // margins
  margin: 0 0 0.1rem 0;
	
  // padding
  padding: 0;
  
  outline: none;
  &:focus {
    outline: none;
  }

  letter-spacing: 1.5px;
  border: none;
  box-shadow: ${props => props.clickable ? 'none' : `2px 2px 2px rgba(0, 0, 0, 0.5)`};
  transition: all 0.1s ease 0s;
  cursor: pointer;
  outline: none;
    
  &:hover {
    ${props => props.hoverable && !props.clickable &&
    {
        boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
        transform: "translateY(-1px)",
    }
    }
  }

  ${props => props.clickable && !props.disabled &&
        `&:active {
      background: ${`linear-gradient(180deg, 
          ${LightenDarkenColor(props.background, -20)} 0%, 
          ${props.background} 50%, 
          ${LightenDarkenColor(props.background, 20)} 100%)`
        }
    }`
    }
  
  ${props => props.disabled &&
    {
        color: props.theme.bg.quaternary,
        background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%), ${LightenDarkenColor(props.background, -60)}`,
        pointerEvents: "none",
    }
    }

    // --border-width: 3px;
    ${props => props.borderGlow &&
        borderGlowCss
    }

${props => props.css};

`

export const ErrorContainerComponent = styled.div`
width: auto;
height: auto;
position: absolute;
top: 50 %;
right: 1rem;
transform: translateY(-50 %);
margin: 0;
padding: 0;
`;

export const ConditionText = styled.span`

    font: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    max-width: 100%;
    height: fit-content;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-flex;

    align-items:center;
    padding: 0;
    margin: 0;
    height: 1.25rem;
    
    // background: green;
`

export const IconContainer = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.bg.senary};
    right: 0;
    top: 0;
    bottom: 0;
    width: 4rem;
    border-left: 1px solid ${props => props.theme.bg.tertiary};
`

export const GlowBorder = styled.div`

    `