import styled from "styled-components";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import {
  RGB_Linear_Shade,
  hexToRGBA,
} from "../../../../methods/utils/color_utils";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  max-width: 100%;
  width: 100%;

  background: ${(props) => props.theme.bg.octonary};

  flex: 1;
`;

export const Container = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;

  width: 100%;
  max-width: 100%;
  overflow: hidden;
  height: 100%;
  max-height: 100%;
`;
