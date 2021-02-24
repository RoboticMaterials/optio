import styled from "styled-components";

export const WidgetForeignObject = styled.foreignObject`
  transition: ${(props) =>
    props.width === "100%" ? "all 0.25s ease" : "none"};
  overflow: visible;
  z-index: 1;
`;

export const WidgetHoverArea = styled.div`
  margin-top: -12.7rem;
  width: 30rem;
  height: 10rem;
  z-index: 5000;
`;

export const WorkstationGroup = styled.g`
  stroke-width: 0;
  opacity: 0.8;
`;
