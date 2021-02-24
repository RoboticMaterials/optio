import styled from "styled-components";

export const LocationTypeGraphic = styled.svg`
  height: 4.5rem;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  fill: ${(props) => props.isNotSelected && "gray"};
  stroke: ${(props) => props.isNotSelected && "gray"};
`;

export const LocationTypeButton = styled.div`
  height: 4rem;
  width: 6rem;
  border-radius: 0.5rem;

  background: ${(props) =>
    props.isSelected
      ? `rgba(0,0,0,0.2)`
      : props.isNotSelected
      ? "lightgray"
      : props.theme.bg.octonary};

  margin: 0.5rem;
  position: relative;
  opacity: 0.999;

  box-shadow: ${(props) =>
    props.isSelected
      ? `inset 0 0.1rem 0.2rem rgba(0,0,0,.39), 0 -0.1rem 0.1rem rgba(255,255,255,0.1), 0 0.1rem 0 rgba(255,255,255,0.1)`
      : `0 0.2rem 0.3rem 0rem rgba(0,0,0,0.3)`};
`;

export const LocationTypeLabel = styled.p`
  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.sz3};
  color: ${(props) => props.theme.bg.octonary};
  margin-bottom: auto;
  user-select: none;
  text-align: center;
`;
