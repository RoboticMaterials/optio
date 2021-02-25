import styled, { css } from 'styled-components'

export const glow = (color) => css`
	box-shadow: 0 0 5px ${color} ;
	border: 1px solid ${color};
`

export const errorGlow = css`
  ${props => glow(props.theme.bad)};
`;

export const newGlow = css`
  ${props => glow(props.theme.warn)};
`;

export const goodGlow = css`
  ${props => glow(props.theme.good)};
`;

export const rowContainer = css`
    display: flex;
    flex-direction: row;
`

export const columnContainer = css`
    display: flex;
    flex-direction: column;
`
export const commonIcon = css`
    //border: none;
    //font-size: 2rem;
    transition: all 0.25s ease;
    color: ${props => props.color};


    filter: brightness(${props => props.filter});

    &: focus{
        //outline: 0 !important
    }
    
    &: hover {
        cursor: pointer;
        filter: brightness(110 %);
    }

    &: active{
        //box-shadow: none;
        filter: brightness(85 %);
    }
`
export const iconButtonCss = css`
  border: none;
  background: transparent;
  outline: none !important;
`

export const disabledButtonCss = css`
  cursor: not-allowed;
  background: ${props => props.theme.disabled}
`

export const commonClickableIcon = css`
  ${commonIcon};
  
  &:focus{
    //outline: 0 !important
  }
  
  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active{
    //box-shadow: none;
    filter: brightness(85%);
  }

  

`

export const trapezoidCss = `
  
  border-bottom: 50px solid #555;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  height: 0;
  width: 125px;
  
  
  // width: 200px;
  // height: 150px;
  // background: red;
  transform: perspective(10px) rotateX(1deg);
  // margin: 50px;
`