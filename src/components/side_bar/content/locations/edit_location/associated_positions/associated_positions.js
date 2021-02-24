import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as styled from "./associated_positions.style";

import { sortableElement, sortableHandle } from "react-sortable-hoc";

// Import Components
import MinusButton from "../../../../../basic/minus_button/minus_button";
import Textbox from "../../../../../basic/textbox/textbox";
import ConfirmDeleteModal from "../../../../../basic/modals/confirm_delete_modal/confirm_delete_modal";

import arrayMove from "array-move";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

// Import Actions
import { setStationAttributes } from "../../../../../../redux/actions/stations_actions";
import {
  setPositionAttributes,
  deletePosition,
  addPosition,
  postPosition,
  setSelectedStationChildrenCopy,
} from "../../../../../../redux/actions/positions_actions";
import * as positionActions from "../../../../../../redux/actions/positions_actions";
import { deleteTask } from "../../../../../../redux/actions/tasks_actions";
import { deepCopy } from "../../../../../../methods/utils/utils";

// Import Constants
import {
  PositionTypes,
  newPositionTemplate,
} from "../../../../../../constants/position_constants";
import { setSelectedStation } from "../../../../../../redux/actions/stations_actions";

export default function Positions(props) {
  const { handleSetChildPositionToCartCoords } = props;

  const dispatch = useDispatch();
  const dispatchSetPositionAttributes = (id, attr) =>
    dispatch(setPositionAttributes(id, attr));
  const dispatchDeletePosition = (id) => dispatch(deletePosition(id));
  const dispatchAddPosition = (position) => dispatch(addPosition(position));
  const disptachPostPosition = (position) => dispatch(postPosition(position));
  const dispatchSetSelectedStationChildrenCopy = (positions) =>
    dispatch(setSelectedStationChildrenCopy(positions));

  const dispatchSetStationAttributes = (id, attr) =>
    dispatch(setStationAttributes(id, attr));

  const positions = useSelector((state) => state.positionsReducer.positions);
  const selectedStation = useSelector(
    (state) => state.stationsReducer.selectedStation
  );
  const selectedPosition = useSelector(
    (state) => state.positionsReducer.selectedPosition
  );
  const tasks = useSelector((state) => state.tasksReducer.tasks);
  const currentMap = useSelector((state) => state.mapReducer.currentMap);
  const MiRMapEnabled = useSelector(
    (state) => state.localReducer.localSettings.MiRMapEnabled
  );
  const selectedStationChildrenCopy = useSelector(
    (state) => state.positionsReducer.selectedStationChildrenCopy
  );

  const [editingIndex, setEditingIndex] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState();
  const [deletingPosition, setDeletingPosition] = useState();

  const positionTypes = MiRMapEnabled
    ? ["cart_position", "shelf_position"]
    : [];

  /**
   * Handles deleting positions
   * Does some different things based on if the position is new or not (see comments bellow)
   * TODO: FIX THIS SHIT!
   * @param {*} position
   */
  const onDelete = (position) => {
    dispatchDeletePosition(position._id);
  };

  const renderAssociatedPositions = () => {
    return positionTypes.map((positionType) => {
      return Object.values(selectedStationChildrenCopy).map((position, i) => {
        if (position.type === positionType) {
          return (
            <styled.PositionListItem
              background={PositionTypes[positionType].color}
              key={`associatecd_pos_${i}`}
            >
              <MinusButton
                onClick={() => {
                  setConfirmDeleteModal(true);
                  setDeletingIndex(i);
                  setDeletingPosition(position);
                }}
              />
              <Textbox
                style={{ flex: "1" }}
                schema="locations"
                focus={i == editingIndex}
                // defaultValue={position.name}
                value={position.name}
                onChange={(e) => {
                  setEditingIndex(i);
                  dispatch(
                    positionActions.setPositionAttributes(position._id, {
                      name: e.target.value,
                    })
                  );
                }}
              />

              {/* If not a human position, then add ability to use cart location */}
              {position.type !== "human_position" && (
                <styled.CartIcon
                  className="icon-cart"
                  onClick={() => handleSetChildPositionToCartCoords(position)}
                />
              )}

              {/* Commenting out for now, not working with constent updating */}
              {/* <DragHandle></DragHandle> */}
            </styled.PositionListItem>
          );
        }
      });
    });
  };

  // TODO: Comment
  const onAddAssociatedPosition = async (type) => {
    // const newPositionName = selectedStation.name + ' ' + (selectedStation.children.filter((position) => positions[position].type === type).length + 1)
    const newPositionName =
      `${type === "cart_position" ? "Cart Position" : "Shelf Position"}` +
      " " +
      (selectedStation.children.filter(
        (position) => positions[position].type === type
      ).length +
        1);

    const newPositionType = type;

    const newPosition = newPositionTemplate(
      newPositionName,
      newPositionType,
      selectedStation._id,
      currentMap._id
    );

    await dispatchSetSelectedStationChildrenCopy({
      ...selectedStationChildrenCopy,
      [newPosition._id]: newPosition,
    });

    await dispatchAddPosition(newPosition);

    let { children } = selectedStation;
    children.push(newPosition._id);

    dispatchSetStationAttributes(selectedStation._id, { children });
  };

  const onDeleteAssociatedPosition = async () => {
    await onDelete(deletingPosition);
    setConfirmDeleteModal(null);
  };

  const renderPositionCards = () => {
    return positionTypes.map((positionType) => {
      let positionName;
      // Sets of vairables based on position type
      if (positionType === "cart_position") {
        positionName = "Cart";
      }
      if (positionType === "shelf_position") {
        positionName = "Shelf";
      }

      return (
        <styled.Card>
          <styled.NewPositionCard
            style={{ transform: "translate(-0.4rem, 0.4rem)" }}
          />
          <styled.NewPositionCard
            style={{ transform: "translate(-0.2rem, 0.2rem)" }}
          />
          <styled.NewPositionCard
            draggable={false}
            onMouseDown={(e) => {
              onAddAssociatedPosition(positionType);
            }}
          >
            <styled.LocationTypeGraphic
              fill={PositionTypes[positionType].color}
              stroke={PositionTypes[positionType].color}
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 400"
            >
              {PositionTypes[positionType].svgPath}
            </styled.LocationTypeGraphic>

            <styled.LocationTypeLabel>{positionName}</styled.LocationTypeLabel>
          </styled.NewPositionCard>
        </styled.Card>
      );
    });
  };

  return (
    <styled.PositionsContainer>
      <ConfirmDeleteModal
        isOpen={!!confirmDeleteModal}
        title={"Are you sure you want to delete this Position?"}
        button_1_text={"Yes"}
        handleOnClick1={async () => {
          await onDeleteAssociatedPosition();
        }}
        button_2_text={"No"}
        handleOnClick2={() => setConfirmDeleteModal(null)}
        handleClose={() => setConfirmDeleteModal(null)}
      />

      {/* Cards for dragging a new position onto the map */}

      {!!MiRMapEnabled && (
        <>
          <styled.CardContainer>{renderPositionCards()}</styled.CardContainer>

          <styled.Label>Associated Positions</styled.Label>
        </>
      )}

      <styled.ListContainer>
        {!!selectedStationChildrenCopy && renderAssociatedPositions()}
      </styled.ListContainer>
    </styled.PositionsContainer>
  );
}
