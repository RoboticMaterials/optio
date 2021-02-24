import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as styled from "./card.style";
import { Draggable } from "react-smooth-dnd";
import PropTypes from "prop-types";
import TextField from "../../../../basic/form/text_field/text_field";

function hashCode(str) {
  // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  var c = (i & 0x00ffffff).toString(16).toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

const Card = (props) => {
  const {
    name,
    index,
    id,
    onClick,
    count,
    objectName,
    lotName,
    lotId = 2,
    start_date,
    end_date,
    containerStyle,
    selectable,
    isSelected,
  } = props;

  const startDateText =
    start_date?.month + 1 && start_date?.day && start_date?.year
      ? start_date.month + 1 + "/" + start_date.day + "/" + start_date.year
      : "Start";
  const endDateText =
    end_date?.month + 1 && end_date?.day && end_date?.year
      ? end_date.month + 1 + "/" + end_date.day + "/" + end_date.year
      : "End";

  const lotColor = "#" + intToRGB(hashCode(lotId));

  return (
    <styled.StyledDraggable key={id} index={index}>
      <styled.Container
        selectable={selectable}
        isSelected={isSelected}
        onClick={onClick}
        color={lotColor}
        containerStyle={containerStyle}
      >
        <styled.HeaderBar color={lotColor}>
          <styled.CardName>{name}</styled.CardName>
        </styled.HeaderBar>
        <styled.ContentContainer>
          <styled.Row>
            <styled.Label>Dates</styled.Label>
            <styled.DatesContainer>
              <styled.DateItem>
                <styled.DateText>{startDateText}</styled.DateText>
              </styled.DateItem>

              <styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

              <styled.DateItem>
                <styled.DateText>{endDateText}</styled.DateText>
              </styled.DateItem>
            </styled.DatesContainer>
          </styled.Row>

          <styled.Row style={{ border: "none" }}>
            <styled.Label>Quantity</styled.Label>
            <styled.Count>{count}</styled.Count>
          </styled.Row>
        </styled.ContentContainer>

        {/*<styled.FooterBar*/}
        {/*    color={lotColor}*/}
        {/*>*/}

        {/*    {objectName &&*/}
        {/*        <styled.Count style={{marginRight: "1rem"}}>{objectName}:</styled.Count>*/}
        {/*    }*/}

        {/*</styled.FooterBar>*/}
      </styled.Container>
    </styled.StyledDraggable>
  );
};

// Specifies propTypes
Card.propTypes = {
  isSelected: PropTypes.bool,
  selectable: PropTypes.bool,
};

// Specifies the default values for props:
Card.defaultProps = {
  isSelected: false,
  selectable: false,
};

export default Card;
