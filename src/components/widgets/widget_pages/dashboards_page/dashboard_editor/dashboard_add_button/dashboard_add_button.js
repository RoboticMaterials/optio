import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AddBoxIcon from "@material-ui/icons/AddBox";

import * as style from "./dashboard_add_button.style";

import log from "../../../../../../logger";
import { useDrag, useDrop } from "react-dnd";

const logger = log.getLogger("Dashboards");

const DashboardAddButton = (props) => {
  const { onDrop } = props;

  const [{ opacity }, drop] = useDrop({
    accept: "DashboardSidebarButton",
    drop: (item, monitor) => {
      // console.log("drop item",item)
      onDrop(item);
      return item;
    },
    hover: (item, monitor) => {
      const isOver = monitor.isOver({ shallow: true });
      // logger.log("isOver",isOver)
    },
    // collect: (monitor) => ({
    //     opacity: monitor.isOver({ shallow: true }) ? 0.5 : 1
    // })
  });

  // logger.log("DashboardAddButton: opacity", opacity)

  return (
    <style.Container
      ref={drop}
      // opacity={opacity}
    >
      <AddBoxIcon />
    </style.Container>
  );
};

export default DashboardAddButton;
