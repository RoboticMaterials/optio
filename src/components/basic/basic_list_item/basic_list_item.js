import React from 'react'
import PropTypes from 'prop-types'

import * as style from './basic_list_item.style'

function BasicListItem(props) {

	// extract props
	const {
		LeftContentContainer, leftContentContainerCss, leftContentContainerProps, leftContent,
		RightContentContainer, rightContentContainerCss, rightContentContainerProps, rightContent,
		ContentContainer, contentContainerCss, contentContainerProps,
		Container, containerCss, containerProps,
		title, Title, titleCss, titleProps, onClick, Status, status
	} = props

	return (
		<Container
			{...containerProps}
            css={containerCss}
		>
			<LeftContentContainer css={leftContentContainerCss} {...leftContentContainerProps} onClick={onClick}
>
				{leftContent && leftContent}
			</LeftContentContainer>

			<ContentContainer
				{...contentContainerProps}
				css={contentContainerCss}
				onClick={onClick}

			>
				<Title css={titleCss}{...titleProps}>
					{title}
				</Title>

                <Status>
                    {status}
                </Status>
			</ContentContainer>

			<RightContentContainer css={rightContentContainerCss} {...rightContentContainerProps}>
				{rightContent && rightContent}
			</RightContentContainer>
		</Container>
	)
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
}

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
}

export default BasicListItem
