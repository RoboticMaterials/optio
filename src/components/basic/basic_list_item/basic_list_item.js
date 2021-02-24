import React from "react";
import PropTypes from "prop-types";

import * as style from "./basic_list_item.style";

function BasicListItem(props) {
  // extract props
  const {
    LeftContentContainer,
    leftContentContainerCss,
    leftContentContainerProps,
    leftContent,
    RightContentContainer,
    rightContentContainerCss,
    rightContentContainerProps,
    rightContent,
    ContentContainer,
    contentContainerCss,
    contentContainerProps,
    Container,
    containerCss,
    containerProps,
    title,
    Title,
    titleCss,
    titleProps,
    onClick,
    onMouseEnter,
    onMouseLeave,
    Status,
    status,
    isSelected,
    selectable,
  } = props;

  return (
    <Container
      isSelected={isSelected}
      selectable={selectable}
      {...containerProps}
      css={containerCss}
    >
      <LeftContentContainer
        css={leftContentContainerCss}
        {...leftContentContainerProps}
      >
        {leftContent && leftContent}
      </LeftContentContainer>

      <ContentContainer
        {...contentContainerProps}
        css={contentContainerCss}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Title css={titleCss} {...titleProps}>
          {title}
        </Title>

        <Status>{status}</Status>
      </ContentContainer>

      <RightContentContainer
        css={rightContentContainerCss}
        {...rightContentContainerProps}
      >
        {rightContent && rightContent}
      </RightContentContainer>
    </Container>
  );
}

BasicListItem.propTypes = {
  Container: PropTypes.elementType,
  LeftContentContainer: PropTypes.elementType,
  RightContentContainer: PropTypes.elementType,
  ContentContainer: PropTypes.elementType,
  Title: PropTypes.elementType,
  Status: PropTypes.elementType,
  title: PropTypes.string,
  containerCss: PropTypes.object,
  leftContentContainerCss: PropTypes.object,
  rightContentContainerCss: PropTypes.object,
  titleCss: PropTypes.object,
  contentContainerCss: PropTypes.object,
  isSelected: PropTypes.bool,
  selectable: PropTypes.bool,
};

BasicListItem.defaultProps = {
  Container: style.Container,
  LeftContentContainer: style.LeftContentContainer,
  RightContentContainer: style.RightContentContainer,
  ContentContainer: style.ContentContainer,
  Title: style.Title,
  Status: style.Status,
  title: "",
  containerCss: {},
  titleCss: {},
  leftContentContainerCss: {},
  rightContentContainerCss: {},
  contentContainerCss: {},
  isSelected: false,
  selectable: false,
};

export default BasicListItem;
