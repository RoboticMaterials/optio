import React from 'react'
import PropTypes from 'prop-types'

import * as styled from './list_item.style'

import ReactTooltip from "react-tooltip";

import { randomHash } from '../../../methods/utils/utils'

function ListItem(props) {
    return (
        <styled.Container key={props.key}>
            <styled.InfoContainer>
                <styled.Label onClick={props.onEdit} warning={!!props.warning}>
                    {props.label}
                    {!!props.warning && 
                        <>
                            <ReactTooltip id={"task-warning"}  >
                                <span>{props.warning}</span>
                            </ReactTooltip>

                            <styled.WarningIcon data-tip data-for="task-warning" className="fas fa-exclamation-triangle"/>
                        </>
                    }
                </styled.Label>
                <styled.Description onClick={props.onEdit}>
                    {props.description}
                </styled.Description>
            </styled.InfoContainer>
            <styled.OptionsContainer>
                {!!props.onPlay && <styled.OptionButton onClick={props.onPlay} className="fas fa-play" />}
                {!!props.onAnalyze && <styled.OptionButton onClick={props.onAnalyze} className="fas fa-chart-bar" />}
                {!!props.onDelete && <styled.OptionButton onClick={props.onDelete} className="fas fa-trash-alt"/>}
            </styled.OptionsContainer>
        </styled.Container>
    )
}

ListItem.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    warning: PropTypes.string,
}

ListItem.defaultProps = {
    onPlay: null,
    onEdit: null,
    onDelete: null,
    onAnalyze: null,

    label: "",
    description: "",
    warning: null,

    key: randomHash(),
}

export default ListItem

