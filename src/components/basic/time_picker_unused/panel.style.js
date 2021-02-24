import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: blue;
  background: ${(props) => props.theme.bg.primary};
  //flex: .8;
  width: 50%;
  height: 10rem;
  overflow: hidden;
  max-height: 10rem;
  background: yellow;
`;
