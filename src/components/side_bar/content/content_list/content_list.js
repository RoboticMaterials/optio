import React, { useState } from 'react'
import * as styled from './content_list.style'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import ContentHeader from '../content_header/content_header'

import { deepCopy } from '../../../../methods/utils/utils'


export default function ContentList(props) {

    const {
        executeTask,
        hideHeader
    } = props
    return (
        <styled.Container>

            {!hideHeader &&
                <ContentHeader content={props.schema} onClickAdd={props.onPlus} />
            }

            <styled.List>
                {props.elements.map((element, ind) =>
                    <styled.ListItem
                        key={`li-${ind}`}
                        onMouseEnter={() => props.onMouseEnter(element)}
                        onMouseLeave={() => props.onMouseLeave(element)}
                    >
                        <styled.ListItemRect>
                            <styled.ListItemTitle schema={props.schema} onClick={() => props.onClick(element)}>{element.name}</styled.ListItemTitle>
                        </styled.ListItemRect>

                        {props.schema === 'tasks' &&
                            <styled.ListItemIcon
                                className='fas fa-play'
                                onClick={() => {
                                    executeTask()
                                }}
                            />
                        }

                    </styled.ListItem>
                )}
            </styled.List>
        </styled.Container>
    )
}
