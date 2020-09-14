import styled from 'styled-components'

import {hexToRGBA, RGB_Linear_Shade, LightenDarkenColor} from '../../../../../methods/utils/color_utils';


export const Container = styled.button`
  position: relative;
  user-select: none;
  
  // flex layout
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
	
  background: ${props => `linear-gradient(180deg, 
                            ${LightenDarkenColor(props.background, 20)} 0%, 
                            ${props.background} 50%, 
                            ${LightenDarkenColor(props.background, -20)} 100%)`};
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

  ${props => props.clickable &&
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
  
  ${props => props.css};

`


export const ConditionText = styled.span`

  font: ${props => props.theme.font.primary};
  font-size: ${props => props.theme.fontSize.sz3};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`
