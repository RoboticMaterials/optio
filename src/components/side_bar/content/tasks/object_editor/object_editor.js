import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'


import BackButton from '../../../../basic/back_button/back_button'
import Button from '../../../../basic/button/button'
import TextField from '../../../../basic/form/text_field/text_field'
import Textbox from '../../../../basic/textbox/textbox'
import PlusButton from '../../../../basic/plus_button/plus_button'

// Import actions
import { setSelectedStation } from '../../../../../redux/actions/stations_actions'
import { handlePostTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import {setSelectedObject, setRouteObject, setEditingObject} from '../../../../../redux/actions/objects_actions'

// Import styles
import * as styled from './object_editor.style'


const ObjectEditor = (props) => {

  const {
    onBackClick,
    name,
    description,
    focus,
    onSaveObject,
    onAddObject,
    onDeleteObject,
    onSelectObject,
    disabled,
    saveDisabled,
    deleteDisabled,
    onChangeQuantity,
    quantity,
  } = props

    const dispatch = useDispatch()
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetSelectedObject = (object) => dispatch(setSelectedObject(object))
    const dispatchSetEditingObject = (bool)=>dispatch(setEditingObject(bool))

    const stations = useSelector(state => state.stationsReducer.stations)
    const objects = useSelector(state => state.objectsReducer.objects)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const editingObject = useSelector(state=> state.objectsReducer.editingObject)
    const selectedObject = useSelector(state => state.objectsReducer.selectedObject)
    const routeObject = useSelector(state=>state.objectsReducer.routeObject)
    const [pageName, setPageName] = useState('')
    const url = useLocation().pathname

      return (
          <styled.ObjectContainer style = {{borderColor: url==='/tasks' ? '#313236': 'white'}} >
            <styled.RowContainer>
                <BackButton
                  style = {{color: 'white', marginBottom:'2rem'}}
                  schema = {'tasks'}
                  onClick = {onBackClick}
                />
                {!editingObject ?
                  <styled.ListItemTitle style = {{fontSize:'1.2rem', paddingTop:'.7rem', paddingLeft:'.5rem', width: '75%'}}>Choose an object...</styled.ListItemTitle>
                  :
                  <styled.ListItemTitle style = {{fontSize:'1.2rem', paddingTop:'.7rem', paddingLeft:'.5rem', width: '75%'}}>Editing Object</styled.ListItemTitle>

                }
                {!editingObject &&
                  <PlusButton
                    style = {{marginTop: '0.2rem'}}
                    onClick = {()=>{
                      dispatchSetEditingObject(true)
                      onAddObject()
                    }}
                  />
                }

              </styled.RowContainer>

              {!editingObject ?
              <styled.ScrollableContainer>
              {Object.values(objects).map((object) => {

                return (
                  <>
                    <styled.ListItem
                      onMouseEnter = {()=>dispatchSetSelectedObject(object)}
                      onMouseLeave = {()=>dispatchSetSelectedObject(null)}
                    >
                    <styled.HoverContainer onClick = {onSelectObject}>
                        <styled.ListItemIcon
                            className='fas fa-box'
                        />
                        <styled.ListItemTitle>{object.name}</styled.ListItemTitle>
                      </styled.HoverContainer>
                      <styled.ListItemIcon
                          className='fas fa-edit'
                          style={{ color: 'white', marginRight: '0.5rem' }}
                          onClick = {()=>dispatchSetEditingObject(true)}
                      />
                    </styled.ListItem>
                  </>
                )
              })}
            </styled.ScrollableContainer>
            :
            <>
                  <styled.ListItemTitle style = {{marginBottom: '0.2rem'}}>Name</styled.ListItemTitle>

                  <styled.RowContainer style = {{paddingLeft:'0.5rem', paddingRight: '0.5rem'}}>
                    <TextField
                        InputComponent={Textbox}
                        name={name}
                        placeholder={"Object Name"}
                        schema={'tasks'}
                        focus={focus}
                        style={{ fontSize: '1.2rem', fontWeight: '600'}}
                    />
                  </styled.RowContainer>

                  <styled.ListItemTitle style = {{marginBottom: '0.2rem', marginTop: '0.5rem'}}>Description</styled.ListItemTitle>

                  <styled.RowContainer style = {{paddingLeft:'0.5rem', paddingRight: '0.5rem'}}>
                    <TextField
                        InputComponent={Textbox}
                        name={description}
                        placeholder={"Add a Description..."}
                        schema={'tasks'}
                        focus={focus}
                        style={{ fontSize: '0.9rem', fontWeight: '600'}}
                        lines = {2}
                    />
                  </styled.RowContainer>

                  <styled.RowContainer style = {{justifyContent: 'flex-start', marginBottom: '2rem'}}>
                  <styled.ListItemTitle style = {{marginBottom: '0.2rem', marginTop: '1.3rem', width: '6rem'}}>Quantity:</styled.ListItemTitle>

                    <styled.QuantityInput
                      placeholder={'Qty'}
                      onChange={onChangeQuantity}
                      value = {quantity}
                     >

                    </styled.QuantityInput>

                  </styled.RowContainer>
                  <styled.RowContainer style = {{marginTop: '0.5rem'}}>
                    <Button
                        schema={'tasks'}
                        style = {{width: '50%'}}
                        secondary
                        disabled = {saveDisabled}
                        onClick= {()=>{
                          onSaveObject()

                        }}

                    >
                        Save
                    </Button>
                    <Button
                        schema={'error'}
                        style = {{width: '50%'}}
                        secondary
                        disabled = {deleteDisabled}
                        onClick={() => {
                          onDeleteObject()
                          dispatchSetEditingObject(false)
                        }}
                    >
                        Delete
                    </Button>
                </styled.RowContainer>
            </>
          }


            </styled.ObjectContainer>
          )
    }


export default ObjectEditor
