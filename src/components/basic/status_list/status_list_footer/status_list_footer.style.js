import styled, {css} from "styled-components"
import {columnRowLayout, footerStyle} from "../../../../common_css/layout";

export const Container = styled.div`
  ${columnRowLayout};
  ${footerStyle};
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 5rem;
`