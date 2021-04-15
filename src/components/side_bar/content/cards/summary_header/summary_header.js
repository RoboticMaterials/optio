import React from 'react'
import { useParams } from 'react-router-dom'

// functions external
import PropTypes from 'prop-types'
import { useHistory } from "react-router-dom"

// Import Basic
import Button from '../../../../basic/button/button'

// styles
import * as styled from "./summary_header.style"

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
                <styled.MenuButton
                    style={{ marginRight: "auto" }}
                    className="fas fa-chevron-left"
                    aria-hidden="true"
                    onClick={() => {
                        history.replace('/processes')
                    }
                    }
                />
                :
                <styled.InvisibleItem style={{ marginRight: "auto" }} /> // used for spacing
            }
            {!!title && (page === 'processes') &&
                <Button
                    label={title.includes('Statistics') ? 'Lots' : 'Statistics'}
                    schema={title.includes('Statistics') ? 'lots' : 'statistics'}
                    secondary
                    onClick={() => {
                        title.includes('Statistics') ?
                            history.push('/' + page + '/' + id + "/lots")
                            :
                            history.push('/' + page + '/' + id + "/statistics")
                    }}
                />
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
