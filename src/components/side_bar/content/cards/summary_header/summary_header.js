import React from 'react'
import { useParams } from 'react-router-dom'

// functions external
import PropTypes from 'prop-types'
import { useHistory } from "react-router-dom"

// Import Basic
import Button from '../../../../basic/button/button'

// styles
import * as styled from "./summary_header.style"
import BackButton from '../../../../basic/back_button/back_button'

const SummaryHeader = (props) => {
    const {
        showBackButton,
        title
    } = props

    const params = useParams()
    const history = useHistory()

    const {
        page,
        subpage,
        id
    } = params

    return (
        <styled.Header>
            {showBackButton ?
                <BackButton onClick={() => {
                        history.replace('/processes')
                    }} 
                />

                :
                <styled.InvisibleItem style={{ marginRight: "auto" }} /> // used for spacing
            }
            <styled.TitleContainer style={{}}>
                <styled.Title>{title ? title : "untitled"}</styled.Title>
            </styled.TitleContainer>
            <styled.InvisibleItem
                style={{ marginLeft: "auto" }}
            />
        </styled.Header>
    )
}

SummaryHeader.propTypes = {
    showBackButton: PropTypes.bool,
    title: PropTypes.string
}

SummaryHeader.defaultProps = {
    showBackButton: false,
    title: ""
}

export default SummaryHeader
