import styled, { css } from "styled-components";

export const Container = styled.div`
  width: 100%;
  background: transparent;
  border-color: transparent;
  border-width: 0;

  ${(props) => props.css};
`;

export const Button = styled.button`
  width: 100%;

  background: transparent;
  outline: none !important;
  outline-offset: none !important;
  border-color: transparent;
  border-width: 0;

  margin-bottom: 0.5rem;

  ${(props) => props.css};
`;

// export const ButtonViewCss = styled.div`
//   color: ${props => (props.whiteColor ? 'white' : 'black')};
//   flex-grow: 1;

//     @media (max-width: ${props => props.theme.widthBreakpoint.tiny}) {
//         height: 7rem;
//         line-height: 7rem;
//     }

//     background: ${props => props.isSelected ? props.theme.fg.primary : 'transparent'};
//     color: ${props => props.isSelected ? props.theme.bg.primary : props.theme.bg.octonary};

//     outline: none !important;
//     outline-offset: none !important;
//     padding: .75rem;
//     margin-left: -0.2rem;
//     margin-bottom: .5rem;
//     border-radius: .3rem;
//     border-width: .15rem;
//     border-color: ${props => props.theme.fg.primary};
//     border-style: solid;

//     font-size: ${props => props.theme.fontSize.sz4};
//     font-family: ${props => props.theme.font.primary};
//     font-weight: 400;
//     @media ${props => props.theme.widthBreakpoint.mobileL} {
//       padding: .25rem;
//       fontSize: ${props => props.theme.fontSize.sz5};
//     }
// `;

export const buttonViewSelectedCss = css`
  color: ${(props) => props.theme.bg.primary};
  background-color: ${(props) => props.theme.fg.primary};
`;

export const ButtonView = styled.div`
  flex-grow: 1;

  @media (max-width: ${(props) => props.theme.widthBreakpoint.tiny}) {
    height: 7rem;
    line-height: 7rem;
  }

  background-color: transparent;
  color: ${(props) => props.theme.bg.octonary};

  outline: none !important;
  outline-offset: none !important;
  padding: 0.75rem;
  margin-left: -0.2rem;
  margin-bottom: 0.5rem;
  border-radius: 0.3rem;
  border-width: 0.15rem;
  /* border-color: ${(props) => props.theme.fg.primary}; */
  border-color: transparent;
  border-style: solid;

  font-size: ${(props) => props.theme.fontSize.sz4};
  font-family: ${(props) => props.theme.font.primary};
  font-weight: 400;
  @media ${(props) => props.theme.widthBreakpoint.mobileL} {
    padding: 0.25rem;
    fontsize: ${(props) => props.theme.fontSize.sz5};
  }

  ${(props) => props.css};
  ${(props) => props.isSelected && buttonViewSelectedCss};
  ${(props) => props.isSelected && props.selectedCss};
`;
