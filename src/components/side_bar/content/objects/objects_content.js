import React, { useState } from 'react'
import * as styled from './objects_content.style'
import { useSelector, useDispatch } from 'react-redux'

import ContentHeader from '../content_header/content_header'
import PlusButton from '../../../basic/plus_button/plus_button'
import BackButton from '../../../basic/back_button/back_button'
import Textbox from '../../../basic/textbox/textbox.js'
import Button from '../../../basic/button/button'

import ContentList from '../content_list/content_list'

import * as objectActions from '../../../../redux/actions/objects_actions'
import { setAction } from '../../../../redux/actions/sidebar_actions'
import { deepCopy } from '../../../../methods/utils/utils'


export default function ObjectsContent(props) {

    const dispatch = useDispatch()
    let objects = useSelector(state => state.objectsReducer.objects)
    let selectedObject = useSelector(state => state.objectsReducer.selectedObject)
    const currentMap = useSelector(state => state.mapReducer.currentMap)

    const [editing, toggleEditing] = useState(false)
    const [selectedObjectCopy, setSelectedObjectCopy] = useState(null)

    const updateType = (type) => {
        dispatch(objectActions.setObjectAttributes(selectedObject._id.$oid, { type }))
    }

    if (editing) {
        return (
            <styled.ContentContainer>
                <div style={{ marginBottom: '1rem' }}>
                    <ContentHeader
                        content={'objects'}
                        mode={'create'}
                        onClickBack={() => {
                            if (selectedObject._id.$oid == '__NEW') {
                                dispatch(objectActions.removeObject('__NEW'))
                            } else {
                                dispatch(objectActions.updateObject(selectedObjectCopy))
                            }
                            dispatch(objectActions.deselectObject())
                            dispatch(setAction(null))
                            setSelectedObjectCopy(null)
                            toggleEditing(false)
                        }}

                        onClickSave={() => {
                            if (selectedObject._id.$oid == '__NEW_OBJECT') {
                                delete selectedObject._id
                                dispatch(objectActions.postObject(selectedObject))
                            } else {
                                dispatch(objectActions.putObject(selectedObject, selectedObject._id.$oid))
                            }
                            dispatch(objectActions.deselectObject())
                            dispatch(setAction(null))
                            setSelectedObjectCopy(null)
                            toggleEditing(false)
                        }}

                    />
                </div>
                <Textbox
                    placeholder="Object Name"
                    defaultValue={!!selectedObject && selectedObject.name}
                    schema={'objects'}
                    focus={selectedObject.type == null}
                    onChange={(e) => {
                        dispatch(objectActions.setObjectAttributes({ name: e.target.value }))
                    }}
                    style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                </Textbox>

                <div style={{ height: "100%" }}></div>

                <Button schema={'objects'} secondary onClick={() => {
                    dispatch(objectActions.deleteObject(selectedObject._id.$oid));
                    dispatch(objectActions.deselectObject());
                    toggleEditing(false)
                }}>Delete</Button>
            </styled.ContentContainer>
        )
    } else {
        return (
            <ContentList
                title={'Objects'}
                schema={'objects'}
                elements={Object.values(objects).filter((item) => item.map_id === currentMap._id)}
                onMouseEnter={(object) => dispatch(objectActions.selectObject(object._id.$oid))}
                onMouseLeave={() => dispatch(objectActions.deselectObject())}
                onClick={() => {
                    setSelectedObjectCopy(deepCopy(selectedObject))
                    toggleEditing(true)
                }}
                onPlus={() => {
                    dispatch(objectActions.addObject({
                        name: "",
                        _id: { $oid: '__NEW_OBJECT' },
                        map_id: currentMap._id,
                    }))
                    dispatch(setAction('NEW'))
                    dispatch(objectActions.selectObject('__NEW_OBJECT'))
                    toggleEditing(true)
                }}
            />
        )
    }
}
