import styled from "styled-components";

export const LotName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    font-size: 1.3rem;
    font-family: ${props => props.theme.font.primary};
    flex-grow: 1;
`

export const LotNumber = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${props => props.theme.fontSize.sz4};
  color: ${props => props.theme.bg.octonary};
  font-weight: 300;
  height: 100%;

  background: ${props => props.theme.bg.secondary};
  border-radius: 1rem;
  width: fit-content;
  padding: 0.1rem 0.7rem;
  align-content: center;
  justify-content: center;
`

export const LotFieldsContainer = styled.div`
    height: fit-content;
    width: 100%;
    max-width: 50rem;
    background: ${props => props.theme.bg.tertiary};
    opacity: 0.8;

    padding: 1rem;
    border-radius: .5rem;
    align-self: center;

    margin-bottom: 2rem;
`