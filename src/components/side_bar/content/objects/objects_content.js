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
    const currentMapId = useSelector(state => state.settingsReducer.settings.currentMapId)
    const maps = useSelector(state => state.mapReducer.maps)
    const currentMap = Object.values(maps).find(map => map.id === currentMapId)
    const [editing, toggleEditing] = useState(false)
    const [selectedObjectCopy, setSelectedObjectCopy] = useState(null)

    const updateType = (type) => {
        dispatch(objectActions.setObjectAttributes(selectedObject.id, { type }))
    }

    if (editing) {
        return (
            <styled.ContentContainer>
                <div style={{ marginBottom: '1rem' }}>
                    <ContentHeader
                        content={'objects'}
                        mode={'create'}
                        onClickBack={() => {
                            if (selectedObject.id == '__NEW') {
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
                            if (selectedObject.id == '__NEW_OBJECT') {
                                delete selectedObject.id
                                dispatch(objectActions.postObject(selectedObject))
                            } else {
                                dispatch(objectActions.putObject(selectedObject, selectedObject.id))
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
                    dispatch(objectActions.deleteObject(selectedObject.id));
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
                elements={Object.values(objects).filter((item) => item.mapId === currentMap.id)}
                onMouseEnter={(object) => dispatch(objectActions.selectObject(object.id))}
                onMouseLeave={() => dispatch(objectActions.deselectObject())}
                onClick={() => {
                    setSelectedObjectCopy(deepCopy(selectedObject))
                    toggleEditing(true)
                }}
                onPlus={() => {
                    dispatch(objectActions.addObject({
                        name: "",
                        id: '__NEW_OBJECT',
                        mapId: currentMap.id,
                    }))
                    dispatch(setAction('NEW'))
                    dispatch(objectActions.selectObject('__NEW_OBJECT'))
                    toggleEditing(true)
                }}
            />
        )
    }
}
