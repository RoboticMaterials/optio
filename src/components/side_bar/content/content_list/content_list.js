import React, { useState } from 'react'
import * as styled from './content_list.style'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import ContentHeader from '../content_header/content_header'

import { deepCopy } from '../../../../methods/utils/utils'


export default function ContentList(props) {

    const {
        executeTask,
        hideHeader,
        handleCardView
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


                        <styled.ListItemIconContainer style={{width:'15%'}}>

                            {props.schema === 'tasks' &&
                                <styled.ListItemIcon
                                    className='fas fa-play'
                                    onClick={() => {
                                        executeTask()
                                    }}
                                />
                            }

                            {props.schema === 'processes' &&
                                <styled.ListItemIcon
                                    className='far fa-clone'
                                    onClick={() => {
                                        handleCardView(element)
                                    }}
                                />
                            }

                        </styled.ListItemIconContainer>


                        <styled.ListItemTitle schema={props.schema}>{element.name}</styled.ListItemTitle>



                        <styled.ListItemIconContainer>

                            <styled.ListItemIcon
                                className='fas fa-cog'
                                onClick={() => props.onClick(element)}
                                style={{color:'#c6ccd3'}}
                            />


                        </styled.ListItemIconContainer>

                    </styled.ListItem>
                )}
            </styled.List>
        </styled.Container>
    )
}
