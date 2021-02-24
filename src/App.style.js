import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;

  overscroll-behavior: contain;
`;

export const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;

  overscroll-behavior: contain;
`;

export const HeaderContainer = styled.div``;

export const BodyContainer = styled.div`
  position: relative;

  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;
