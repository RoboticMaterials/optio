import styled, { css } from "styled-components";
import Modal from "react-modal";

export const Container = styled(Modal)`
  outline: none !important;
  outline-offset: none !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  right: auto;
  bottom: auto;
  position: absolute;
  z-index: 50;
  min-width: 95%;
  max-width: 95%;
  max-height: 95%;
  color: ${(props) => props.theme.bg.octonary};
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.bg.octonary};
  border-radius: 1rem;
  overflow: hidden;
`;

export const HeaderMainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0;
  //height: 5rem;
  padding: 0.5rem 1rem;
  background: ${(props) => props.theme.bg.quinary};
`;

export const Title = styled.h2`
  height: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => props.theme.fontSize.sz2};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  margin-bottom: 1rem;
`;

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  flex: 1;
  justify-content: space-between;
  overflow: hidden;
  background: ${(props) => props.theme.bg.quaternary};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-height: fit-content;
`;

export const ContentContainer = styled.div`
  background: ${(props) => props.theme.bg.quinary};
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 1rem;
  align-items: center;
  justify-content: center;
`;

export const NoButtonsText = styled.span`
  font: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.sz3};
`;

export const FadeLoaderCSS = css``;

export const ReportButtonsContainer = styled.div`
  align-items: center;
  overflow: auto;
  min-height: 5rem;
  width: 100%;

  ${(props) => (props.isButtons ? buttonsCss : noButtonsCss)}
`;

const buttonsCss = css``;

const noButtonsCss = css`
  overflow: auto;
  display: flex;
  flex-drection: column;
  justify-content: center;
`;
