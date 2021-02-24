import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0.5rem 1rem;
  background: ${(props) => props.theme.bg.quaternary};
  border-bottom: 1px solid ${(props) => props.theme.bg.tertiary};
  z-index: 20;
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

export const Description = styled.span`
  color: white;
  margin-bottom: 0.25rem;
`;
