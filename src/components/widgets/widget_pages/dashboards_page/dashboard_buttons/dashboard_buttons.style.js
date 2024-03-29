import styled, {css} from "styled-components";
import {LightenDarkenColor} from "../../../../../methods/utils/color_utils";

export const borderGlowCss = css`
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

export const ContainerCss = css`
  position: relative;
  user-select: none;

  // flex layout
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;

  background: ${props => !props.invert && `linear-gradient(180deg, 
                            ${LightenDarkenColor(props.background, 20)} 0%, 
                            ${props.background} 60%, 
                            ${LightenDarkenColor(props.background, -15)} 100%)`};
  border-radius: 0.6rem;

  // margins
  margin: 0 0 0.1rem 0;

  // padding
  padding: 0.5rem 1rem 0.5rem 1rem;

  outline: none;
  &:focus {
    outline: none;
  }

  letter-spacing: 1.5px;
  border: ${props => props.invert ? `1px solid ${props.background}` : 'none'};
  box-shadow: ${props => props.clickable ? 'none' : `2px 2px 2px rgba(0, 0, 0, 0.5)`};
  transition: all 0.1s ease 0s;
  cursor: pointer;
  outline: none;
    
  &:hover {
    filter: brightness(110%);
    ${props => props.hoverable && !props.clickable &&
            {
              boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
              transform: "translateY(-1px)",
            }
    }
  }

  ${props => props.clickable && !props.disabled && !props.invert && 
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
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    margin: 0;
    padding: 0;
`;

export const conditionTextCss = css`
    font: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${props => props.theme.bg.octonary}
`