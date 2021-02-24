import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: fit-content;
  background: ${(props) => props.theme.bg.quaternary};
  flex-direction: column;
  // flex: 1;
  padding: 1rem;
  color: ${(props) => props.theme.bg.octonary};
  border-right: 1px solid ${(props) => props.theme.bg.tertiary};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Title = styled.span`
  font-size: ${(props) => props.theme.fontSize.sz2};
  font-weight: ${(props) => props.theme.fontWeight.bold};
`;

export const CloseButton = styled.i`
  font-size: 1.5rem;
`;
