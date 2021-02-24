import React from "react";
import styled from "styled-components";
import { LIB_NAME } from "../constants";

import { LightenDarkenColor } from "../../../../methods/utils/color_utils";

const NoData = ({ props, state, methods, NoDataComponent }) =>
  props.noDataRenderer ? (
    props.noDataRenderer({ props, state, methods })
  ) : (
    <NoDataComponent
      id={"bob5"}
      className={`${LIB_NAME}-no-data`}
      color={props.color}
      schema={props.schema}
    >
      {props.noDataLabel}
    </NoDataComponent>
  );

const DefaultNoDataComponent = styled.div`
  text-align: center;
  font-weight: 200;
  color: ${(props) =>
    props.schema
      ? props.theme.schema[props.schema].solid
      : props.theme.fg.primary};
  font-size: ${(props) => props.theme.fontSize.sz5};
  background: ${(props) => LightenDarkenColor(props.theme.bg.quinary, -10)};
  cursor: default;
`;

NoData.defaultProps = {
  NoDataComponent: DefaultNoDataComponent,
};

export default NoData;
