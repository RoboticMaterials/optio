import styled from "styled-components";

export const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 1rem;
  padding-top: 1.5rem;

  display: flex;
  flex-direction: column;
`;

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Header = styled.h1`
  font-size: ${(props) => props.theme.fontSize.sz2};
  font-family: ${(props) => props.theme.font.primary};
  color: white;
  margin-top: 1rem;
`;

export const Label = styled.h2`
  font-size: ${(props) => props.theme.fontSize.sz3};
  font-family: ${(props) => props.theme.font.primary};
  color: white;
  margin-right: 1rem;
  line-height: 2rem;
`;

export const LabelHighlight = styled.span`
  font-size: ${(props) => props.theme.fontSize.sz3};
  font-family: ${(props) => props.theme.font.primary};
  color: ${(props) => props.theme.schema.tasks.solid};
  line-height: 2rem;
  font-weight: bold;
`;

export const HelpText = styled.h3`
  font-size: ${(props) => props.theme.fontSize.sz4};
  font-family: ${(props) => props.theme.font.primary};
  color: white;
  text-align: center;
`;

export const DirectionText = styled.h3`
  font-size: ${(props) => props.theme.fontSize.sz4};
  font-family: ${(props) => props.theme.font.primary};
  color: ${(props) => props.theme.schema.tasks.solid};
  text-align: center;
`;

export const DualSelectionButton = styled.button`
  font-size: 1rem;
  width: 8rem;
  border: none;
  font-family: ${(props) => props.theme.font.primary};

  color: ${(props) =>
    !props.selected ? props.theme.bg.tertiary : props.theme.bg.octonary};

  background-color: ${(props) =>
    props.selected ? props.theme.schema.tasks.solid : props.theme.bg.octonary};

  transition: background-color 0.25s ease, box-shadow 0.1s ease;

  &:focus {
    outline: 0 !important;
  }

  &:active {
    box-shadow: none;
  }

  &:hover {
    //background-color: ${(props) => props.theme.bg.quaternary};
  }
`;
