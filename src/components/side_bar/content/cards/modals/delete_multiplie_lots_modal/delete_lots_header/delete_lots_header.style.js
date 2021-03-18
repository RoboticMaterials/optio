import styled from "styled-components"

export const Container = styled.div`
  align-self: stretch;
  margin: .5rem 1rem;
  display: flex;
  border-bottom: 1px solid ${props => props.theme.bg.octonary};
  color: ${props => props.theme.bg.octonary};
`

export const Item = styled.span`
  color: ${props => props.theme.bg.octonary};
  flex: 1;
  flex-wrap: nowrap;
  overflow: hidden;
  display: flex;
  flex: 1;
  margin: 0 .5rem;
  white-space: nowrap;
  overflow: auto;
  text-overflow:clip;
`